import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import { promises as fs } from 'fs';

export interface TranscodeOptions {
  width: number;
  height: number;
  videoBitrate: string;
  audioBitrate: string;
  outputPath: string;
}

export class FFmpegService {
  constructor() {
    console.log('[FFmpeg] Service initialized');
  }

  async processVideo(
    inputPath: string,
    outputPath: string,
    options: TranscodeOptions
  ): Promise<void> {
    const { width, height, videoBitrate, audioBitrate } = options;
    const segmentFilename = path.join(path.dirname(outputPath), 'segment_%03d.ts');

    console.log(
      `[FFmpeg] Starting transcode: ${inputPath} -> ${outputPath} (${width}x${height})`
    );

    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .outputOptions([
          '-c:v libx264',
          '-preset fast',
          '-crf 22',
          '-c:a aac',
          `-b:a ${audioBitrate}`,
          `-vf scale=-2:${height}`,
          '-f hls',
          '-hls_time 4',
          '-hls_list_size 0',
          `-hls_segment_filename ${segmentFilename}`,
        ])
        .output(outputPath)
        .on('start', (commandLine) => {
          console.log('[FFmpeg] Command:', commandLine);
        })
        .on('progress', (progress) => {
          if (progress.percent) {
            process.stdout.write(`\r[FFmpeg] Progress: ${progress.percent.toFixed(1)}%`);
          }
        })
        .on('end', () => {
          console.log('\n[FFmpeg] Transcode complete');
          resolve();
        })
        .on('error', (err, stdout, stderr) => {
          console.error('\n[FFmpeg] Error:', err.message);
          console.error('[FFmpeg] stderr:', stderr);
          reject(err);
        })
        .run();
    });
  }

  async generateThumbnail(
    inputPath: string,
    outputPath: string,
    timestamp: string = '00:00:05'
  ): Promise<void> {
    console.log(`[FFmpeg] Generating thumbnail at ${timestamp}`);

    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .seekInput(timestamp)
        .outputOptions(['-vframes 1', '-q:v 2'])
        .output(outputPath)
        .on('end', () => {
          console.log('[FFmpeg] Thumbnail generated:', outputPath);
          resolve();
        })
        .on('error', (err) => {
          console.error('[FFmpeg] Thumbnail error:', err.message);
          reject(err);
        })
        .run();
    });
  }

  async generateSpriteSheet(
    inputPath: string,
    outputPath: string,
    count: number = 10
  ): Promise<void> {
    console.log(`[FFmpeg] Generating sprite sheet with ${count} frames`);

    const tempDir = path.dirname(outputPath);
    const tempPattern = path.join(tempDir, 'thumb_%04d.jpg');

    const duration = await this.getVideoDuration(inputPath);
    const interval = duration / count;

    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .outputOptions([
          `-vf fps=${1 / interval},scale=160:90:tile=${count}x1`,
          '-q:v 2',
        ])
        .output(tempPattern)
        .on('end', async () => {
          try {
            const files = await fs.readdir(tempDir);
            const thumbs = files
              .filter((f) => f.startsWith('thumb_') && f.endsWith('.jpg'))
              .sort()
              .map((f) => path.join(tempDir, f));

            const spriteContent = thumbs.map((file, i) => {
              const start = i * interval;
              return `thumb_${String(i).padStart(4, '0')}.jpg\n${start.toFixed(3)}`;
            });

            await fs.writeFile(outputPath, spriteContent.join('\n\n'));
            console.log('[FFmpeg] Sprite sheet generated:', outputPath);
            resolve();
          } catch (err) {
            reject(err);
          }
        })
        .on('error', (err) => {
          console.error('[FFmpeg] Sprite sheet error:', err.message);
          reject(err);
        })
        .run();
    });
  }

  private getVideoDuration(inputPath: string): Promise<number> {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(inputPath, (err, metadata) => {
        if (err) reject(err);
        else resolve(metadata.format.duration || 60);
      });
    });
  }

  async cleanupTempFolder(folderPath: string): Promise<void> {
    console.log(`[FFmpeg] Cleaning up temp folder: ${folderPath}`);
    await fs.rm(folderPath, { recursive: true, force: true });
  }
}

export const ffmpegService = new FFmpegService();