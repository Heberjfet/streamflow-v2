import { FastifyInstance } from 'fastify';
import { Redis } from 'ioredis';
import { Queue, Worker } from 'bullmq';

const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  maxRetriesPerRequest: null
};

export const redis = new Redis(redisConfig);

export const transcodeQueue = new Queue('transcode', { connection: redis });

export async function redisPlugin(fastify: FastifyInstance) {
  fastify.decorate('redis', redis);
  fastify.decorate('transcodeQueue', transcodeQueue);

  fastify.addHook('onClose', async () => {
    await redis.quit();
    await transcodeQueue.close();
  });
}

declare module 'fastify' {
  interface FastifyInstance {
    redis: Redis;
    transcodeQueue: Queue;
  }
}
