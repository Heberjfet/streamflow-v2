import { Job } from 'bullmq';
import path from 'path';
import { promises as fs } from 'fs';
import { ThumbnailJobData } from '../types';
import { thumbnailService } from '../services/thumbnail.service';
import { s3Service } from '../services/s3.service';
import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL || '', { max: 1 });

async function updateAssetStatus(
  assetId: string,
  status: 'pending' | 'processing' | 'completed' | 'failed',
  outputKey?: string,
  error?: string
) {
  const query = `
    UPDATE assets
    SET thumbnail_status = $1, thumbnail_key = $2, thumbnail_error = $3, updated_at = NOW()
    WHERE id = $4
  `;
  await sql.unsafe(query, [status, outputKey ?? null, error ?? null, assetId]);
}

export async function thumbnailProcessor(job: Job<ThumbnailJobData>): Promise<void> {
  const { assetId, sourceKey } = job.data;
  console.log(`[Thumbnail] Starting job for asset: ${assetId}`);

  const tempDir = `/tmp/streamflow/${assetId}`;
  const sourcePath = path.join(tempDir, 'source');
  await fs.mkdir(tempDir, { recursive: true });

  try {
    await updateAssetStatus(assetId, 'processing');

    console.log(`[Thumbnail] Downloading source from S3: ${sourceKey}`);
    await s3Service.downloadFile(sourceKey, sourcePath);

    await thumbnailService.generateThumbnails(assetId, sourceKey);

    const thumbnailKey = `assets/${assetId}/thumbnails/`;
    await updateAssetStatus(assetId, 'completed', thumbnailKey);
    console.log(`[Thumbnail] Job completed for asset: ${assetId}`);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[Thumbnail] Job failed for asset ${assetId}:`, errorMessage);
    await updateAssetStatus(assetId, 'failed', undefined, errorMessage);
    throw error;
  } finally {
    try {
      await fs.rm(`/tmp/streamflow/${assetId}`, { recursive: true, force: true });
    } catch (e) {
      console.warn('[Thumbnail] Cleanup failed:', e);
    }
  }
}