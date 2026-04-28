import path from 'path';
import { mkdir, rm, writeFile } from 'fs/promises';
import os from 'os';
import { randomUUID } from 'crypto';
import { runFfmpeg, ffprobe } from './ffmpeg.service';
import { s3Service } from './s3.service';

export async function generateThumbnails(sourcePath: string, outputDir: string, durationSec: number): Promise<void> {
  const spriteDir = path.join(outputDir, 'sprite');
  await mkdir(spriteDir, { recursive: true });

  const count = 10;
  const interval = durationSec / count;
  const tempPattern = path.join(spriteDir, 'thumb_%04d.jpg');

  await runFfmpeg([
    '-y', '-i', sourcePath,
    '-vf', `fps=${1 / interval},scale=160:90,tile=${count}x1`,
    '-q:v', '2',
    tempPattern,
  ]);

  const spriteContent: string[] = [];
  for (let i = 0; i < count; i++) {
    const start = i * interval;
    spriteContent.push(`thumb_${String(i).padStart(4, '0')}.jpg\n${start.toFixed(3)}`);
  }

  await writeFile(path.join(outputDir, 'sprite.vtt'), spriteContent.join('\n\n'), 'utf-8');
}

export class ThumbnailService {
  async generateThumbnails(assetId: string, sourceKey: string): Promise<void> {
    const tmpDir = path.join(os.tmpdir(), `streamflow-${randomUUID()}`);
    await mkdir(tmpDir, { recursive: true });

    const inputPath = path.join(tmpDir, 'source.mp4');
    const outputDir = path.join(tmpDir, 'thumbnails');
    await mkdir(outputDir, { recursive: true });

    try {
      await s3Service.downloadFile(sourceKey, inputPath);
      const probe = await ffprobe(inputPath);
      const spritePath = path.join(outputDir, 'sprite.vtt');
      await this.generateSpriteSheet(inputPath, spritePath, 10);

      const previewPath = path.join(outputDir, 'preview.jpg');
      await this.generateThumbnail(inputPath, previewPath, probe.duration);

      await s3Service.uploadFolder(outputDir, `assets/${assetId}/thumbnails`);

      console.log(`[Thumbnail] Assets generated for ${assetId}`);
    } finally {
      await rm(tmpDir, { recursive: true, force: true });
    }
  }

  async generateThumbnail(
    inputPath: string,
    outputPath: string,
    durationSec: number
  ): Promise<void> {
    const timestamp = Math.max(0, Math.floor(durationSec * 0.25));
    await runFfmpeg([
      '-y', '-i', inputPath,
      '-ss', String(timestamp),
      '-vframes', '1',
      '-vf', 'scale=640:-2',
      '-q:v', '2',
      outputPath,
    ]);
  }

  async generateSpriteSheet(
    inputPath: string,
    outputPath: string,
    count: number = 10
  ): Promise<void> {
    const probe = await ffprobe(inputPath);
    const duration = probe.duration || 60;
    const interval = duration / count;
    const tempDir = path.dirname(outputPath);
    const tempPattern = path.join(tempDir, 'thumb_%04d.jpg');

    await runFfmpeg([
      '-y', '-i', inputPath,
      '-vf', `fps=${1 / interval},scale=160:90,tile=${count}x1`,
      '-q:v', '2',
      tempPattern,
    ]);
  }
}

export const thumbnailService = new ThumbnailService();