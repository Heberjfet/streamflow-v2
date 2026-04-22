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
  thumbnailKey?: string,
  errorMessage?: string
) {
  const query = `
    UPDATE assets
    SET status = $1, hls_manifest_key = $2, thumbnail_key = $3, updated_at = NOW()
    WHERE id = $4
  `;
  await sql.unsafe(query, [status, outputKey ?? null, thumbnailKey ?? null, assetId]);
}

function generateMasterPlaylist(renditions: { name: string; bandwidth: number; playlistName: string }[]): string {
  let playlist = '#EXTM3U\n';
  playlist += '#EXT-X-VERSION:3\n';
  
  for (const rendition of renditions) {
    playlist += `#EXT-X-STREAM-INF:BANDWIDTH=${rendition.bandwidth},RESOLUTION=${rendition.resolution}\n`;
    playlist += `${rendition.playlistName}\n`;
  }
  
  return playlist;
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

    const renditionData: { name: string; bandwidth: number; resolution: string; playlistName: string }[] = [];

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
      
      renditionData.push({
        name: rendition.name,
        bandwidth: rendition.bandwidth,
        resolution: `${rendition.width}x${rendition.height}`,
        playlistName: `${s3Prefix}/playlist.m3u8`
      });

      await job.updateProgress(
        (renditions.indexOf(rendition) / renditions.length) * 80
      );
    }

    const masterPlaylistPath = path.join(hlsDir, 'master.m3u8');
    const masterContent = generateMasterPlaylist(renditionData);
    await fs.writeFile(masterPlaylistPath, masterContent);

    const masterKey = `assets/${assetId}/hls/master.m3u8`;
    await s3Service.uploadFile(masterPlaylistPath, masterKey);

    let thumbnailKey: string | undefined;
    try {
      const thumbnailPath = path.join(tempDir, 'thumbnail.jpg');
      await ffmpegService.generateThumbnail(sourcePath, thumbnailPath);
      if (await fs.access(thumbnailPath).then(() => true).catch(() => false)) {
        const thumbKey = `assets/${assetId}/thumbnail.jpg`;
        await s3Service.uploadFile(thumbnailPath, thumbKey);
        thumbnailKey = thumbKey;
      }
    } catch (e) {
      console.log('[Transcode] Thumbnail generation skipped or failed');
    }

    await updateAssetStatus(assetId, 'completed', masterKey, thumbnailKey);

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