import path from 'path';
import { promises as fs } from 'fs';
import { ffmpegService } from './ffmpeg.service';
import { s3Service } from './s3.service';

export class ThumbnailService {
  async generateThumbnails(assetId: string, sourceKey: string): Promise<void> {
    const tempDir = `/tmp/streamflow/${assetId}/thumbnails`;
    await fs.mkdir(tempDir, { recursive: true });

    const inputPath = `/tmp/streamflow/${assetId}/source`;

    try {
      const spritePath = path.join(tempDir, 'sprite.vtt');
      await ffmpegService.generateSpriteSheet(inputPath, spritePath, 10);

      const previewPath = path.join(tempDir, 'preview.jpg');
      await ffmpegService.generateThumbnail(inputPath, previewPath, '00:00:05');

      await s3Service.uploadFolder(tempDir, `assets/${assetId}/thumbnails`);

      console.log(`[Thumbnail] Assets generated for ${assetId}`);
    } finally {
      await ffmpegService.cleanupTempFolder(tempDir);
    }
  }
}

export const thumbnailService = new ThumbnailService();