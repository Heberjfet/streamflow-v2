import { Job } from 'bullmq';
import path from 'path';
import { promises as fs } from 'fs';
import { TranscodeJobData, RENDITIONS } from '../types';
import { ffmpegService } from '../services/ffmpeg.service';
import { s3Service } from '../services/s3.service';
import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL || '', { max: 1 });

async function updateAssetStatus(
  assetId: string,
  status: 'pending' | 'processing' | 'completed' | 'failed',
  outputKey?: string,
  errorMessage?: string
) {
  const query = `
    UPDATE assets
    SET status = $1, hls_manifest_key = $2, updated_at = NOW()
    WHERE id = $3
  `;
  await sql.unsafe(query, [status, outputKey ?? null, assetId]);
}

export async function transcodeProcessor(job: Job<TranscodeJobData>): Promise<void> {
  const { assetId, inputKey: sourceKey, renditions = RENDITIONS } = job.data;
  console.log(`[Transcode] Starting job for asset: ${assetId}`);

  const tempDir = `/tmp/streamflow/${assetId}`;
  const sourcePath = path.join(tempDir, 'source');
  await fs.mkdir(tempDir, { recursive: true });

  try {
    await updateAssetStatus(assetId, 'processing');

    console.log(`[Transcode] Downloading source from S3: ${sourceKey}`);
    await s3Service.downloadFile(sourceKey, sourcePath);

    const hlsDir = path.join(tempDir, 'hls');
    await fs.mkdir(hlsDir, { recursive: true });

    const outputKeys: string[] = [];

    for (const rendition of renditions) {
      console.log(`[Transcode] Processing rendition: ${rendition.name}`);

      const renditionDir = path.join(hlsDir, rendition.name);
      await fs.mkdir(renditionDir, { recursive: true });

      const playlistPath = path.join(renditionDir, 'playlist.m3u8');

      await ffmpegService.processVideo(
        sourcePath,
        playlistPath,
        {
          width: rendition.width,
          height: rendition.height,
          videoBitrate: rendition.videoBitrate,
          audioBitrate: rendition.audioBitrate,
          outputPath: playlistPath,
        }
      );

      const s3Prefix = `assets/${assetId}/hls/${rendition.name}`;
      await s3Service.uploadFolder(renditionDir, s3Prefix);
      outputKeys.push(`${s3Prefix}/playlist.m3u8`);

      await job.updateProgress(
        renditions.indexOf(rendition) / renditions.length * 100
      );
    }

    await updateAssetStatus(assetId, 'completed', outputKeys.join(','));

    console.log(`[Transcode] Job completed for asset: ${assetId}`);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[Transcode] Job failed for asset ${assetId}:`, errorMessage);
    await updateAssetStatus(assetId, 'failed');
    throw error;
  } finally {
    try {
      await ffmpegService.cleanupTempFolder(tempDir);
    } catch (e) {
      console.warn('[Transcode] Cleanup failed:', e);
    }
  }
}