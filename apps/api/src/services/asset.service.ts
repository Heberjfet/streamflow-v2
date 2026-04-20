import { Queue } from 'bullmq';
import { S3Service } from './s3.service.js';

export class AssetService {
  constructor(
    private readonly s3Service: S3Service,
    private readonly transcodeQueue: Queue
  ) {}

  async enqueueTranscodeJob(assetId: string, userId: string, inputKey: string): Promise<string> {
    const job = await this.transcodeQueue.add('transcode', {
      assetId,
      userId,
      inputKey,
      outputKey: `hls/${assetId}/master.m3u8`,
      thumbnailKey: `thumbnails/${assetId}/thumb.jpg`
    });

    return job.id || '';
  }

  generatePlaybackId(): string {
    return `playback_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  async generatePlaybackUrl(
    s3Service: S3Service,
    playbackId: string
  ): Promise<string> {
    return s3Service.getPublicUrl(`hls/${playbackId}/master.m3u8`);
  }
}
