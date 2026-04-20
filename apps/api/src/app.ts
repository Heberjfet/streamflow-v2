import Fastify from 'fastify';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import { authPlugin } from './plugins/auth.js';
import { dbPlugin } from './plugins/db.js';
import { redisPlugin } from './plugins/redis.js';
import { s3Plugin } from './plugins/s3.js';
import { authRoutes } from './routes/auth.js';
import { assetRoutes } from './routes/assets.js';
import { playbackRoutes } from './routes/playback.js';
import { categoryRoutes } from './routes/categories.js';

const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

async function buildApp() {
  const fastify = Fastify({
    logger: {
      level: 'info',
      transport: {
        target: 'pino-pretty',
        options: {
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname'
        }
      }
    }
  });

  await fastify.register(cors, {
    origin: frontendUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
  });

  await fastify.register(multipart, {
    limits: {
      fileSize: 10 * 1024 * 1024 * 1024
    }
  });

  await fastify.register(dbPlugin);
  await fastify.register(redisPlugin);
  await fastify.register(s3Plugin);
  await fastify.register(authPlugin);

  await fastify.register(authRoutes, { prefix: '/v1/auth' });
  await fastify.register(assetRoutes, { prefix: '/v1/assets' });
  await fastify.register(playbackRoutes, { prefix: '/v1/playback' });
  await fastify.register(categoryRoutes, { prefix: '/v1/categories' });

  fastify.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  fastify.setErrorHandler((error, request, reply) => {
    fastify.log.error(error);

    if (error.statusCode) {
      return reply.status(error.statusCode).send({
        error: error.message
      });
    }

    return reply.status(500).send({
      error: 'Internal server error'
    });
  });

  return fastify;
}

const app = await buildApp();

const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '3000');
    const host = process.env.HOST || '0.0.0.0';

    await app.listen({ port, host });
    console.log(`Server running at http://${host}:${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();

export { buildApp };
