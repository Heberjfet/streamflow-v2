import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import fastifyJwt from '@fastify/jwt';
import { User } from '../types/index.js';

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
  interface FastifyRequest {
    currentUser: User;
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: {
      userId: string;
      email: string;
    };
    user: {
      userId: string;
      email: string;
    };
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
      request.currentUser = decoded as User;
    } catch (err) {
      reply.status(401).send({ error: 'Unauthorized' });
    }
  });
}
