import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import fastifyJwt from '@fastify/jwt';

interface CurrentUser {
  userId: string;
  email: string;
  name: string;
}

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
  interface FastifyRequest {
    currentUser: CurrentUser;
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: {
      userId: string;
      email: string;
    };
    user: CurrentUser;
  }
}

export async function authPlugin(fastify: FastifyInstance) {
  fastify.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    sign: {
      expiresIn: '7d'
    }
  });

  fastify.decorate('authenticate', async function(request: FastifyRequest, reply: FastifyReply) {
    try {
      const decoded = await request.jwtVerify();
      request.currentUser = decoded as CurrentUser;
    } catch (err) {
      reply.status(401).send({ error: 'Unauthorized' });
    }
  });
}
