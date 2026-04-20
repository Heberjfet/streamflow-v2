import { Worker } from 'bullmq';
import { VIDEO_QUEUE_NAME } from './types';
import { transcodeProcessor } from './processors/transcode.processor';
import { thumbnailProcessor } from './processors/thumbnail.processor';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const concurrency = parseInt(process.env.WORKER_CONCURRENCY || '2', 10);

async function main() {
  console.log('[Worker] Starting StreamFlow v2 worker...');
  console.log('[Worker] Redis:', redisUrl);
  console.log('[Worker] Concurrency:', concurrency);

  const worker = new Worker(
    VIDEO_QUEUE_NAME,
    async (job) => {
      console.log(`[Worker] Processing job ${job.id} (${job.name})`);

      if (job.name === 'transcode') {
        return transcodeProcessor(job);
      } else if (job.name === 'generate-thumbnails') {
        return thumbnailProcessor(job);
      } else {
        throw new Error(`Unknown job type: ${job.name}`);
      }
    },
    {
      connection: { url: redisUrl },
      concurrency,
      limiter: {
        max: 4,
        duration: 1000,
      },
    }
  );

  worker.on('completed', (job) => {
    console.log(`[Worker] Job ${job.id} completed`);
  });

  worker.on('failed', (job, err) => {
    console.error(`[Worker] Job ${job?.id} failed:`, err.message);
  });

  worker.on('progress', (job, progress) => {
    console.log(`[Worker] Job ${job.id} progress: ${progress}%`);
  });

  worker.on('error', (err) => {
    console.error('[Worker] Worker error:', err);
  });

  console.log('[Worker] Ready and waiting for jobs...');

  process.on('SIGTERM', async () => {
    console.log('[Worker] Received SIGTERM, shutting down...');
    await worker.close();
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    console.log('[Worker] Received SIGINT, shutting down...');
    await worker.close();
    process.exit(0);
  });
}

main().catch((err) => {
  console.error('[Worker] Fatal error:', err);
  process.exit(1);
});