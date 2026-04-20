import { FastifyInstance } from 'fastify';
import { Redis } from 'ioredis';
import { Queue } from 'bullmq';
import fp from 'fastify-plugin';

const redisUrl = process.env.REDIS_URL || 'redis://redis:6379';

export default fp(async function redisPlugin(fastify: FastifyInstance) {
  const redis = new Redis(redisUrl, {
    maxRetriesPerRequest: null,
    lazyConnect: true
  });

  await redis.connect();

  const transcodeQueue = new Queue('transcode', { connection: redis });

  fastify.decorate('redis', redis);
  fastify.decorate('transcodeQueue', transcodeQueue);

  fastify.addHook('onClose', async () => {
    await transcodeQueue.close();
    await redis.quit();
  });
});

declare module 'fastify' {
  interface FastifyInstance {
    redis: Redis;
    transcodeQueue: Queue;
  }
}