import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import bcrypt from 'bcrypt';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';

const connectionString = process.env.DATABASE_URL || 'postgres://streamflow:streamflow@postgres:5432/streamflow';
const client = postgres(connectionString, { max: 10 });
const db = drizzle(client, { schema: { users } });

export async function authRoutes(fastify: FastifyInstance) {
  const authenticate = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.status(401).send({ error: 'Unauthorized' });
    }
  };

  fastify.post<{ Body: { email: string; password: string; name: string } }>('/register', async (request, reply) => {
    try {
      const { email, password, name } = request.body;

      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email)
      });

      if (existingUser) {
        return reply.status(409).send({ error: 'Email already registered' });
      }

      const passwordHash = await bcrypt.hash(password, 12);

      const allUsers = await db.query.users.findMany();
      const isFirstUser = allUsers.length === 0;
      const role = isFirstUser ? 'admin' : 'viewer';

      const [user] = await db
        .insert(users)
        .values({
          email,
          passwordHash,
          name,
          role
        })
        .returning();

      const token = request.server.jwt.sign({
        userId: user.id,
        email: user.email,
        role: user.role as 'admin' | 'editor' | 'viewer'
      });

      return reply.status(201).send({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        token
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  fastify.post<{ Body: { email: string; password: string } }>('/login', async (request, reply) => {
    try {
      const { email, password } = request.body;

      const user = await db.query.users.findFirst({
        where: eq(users.email, email)
      });

      if (!user || !user.passwordHash) {
        return reply.status(401).send({ error: 'Invalid credentials' });
      }

      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (!isValid) {
        return reply.status(401).send({ error: 'Invalid credentials' });
      }

      const token = request.server.jwt.sign({
        userId: user.id,
        email: user.email,
        role: user.role as 'admin' | 'editor' | 'viewer'
      });

      return reply.send({
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          avatarUrl: user.avatarUrl
        }
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  fastify.get('/google', async (request, reply) => {
    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&response_type=code&scope=email%20profile&redirect_uri=${process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3001/v1/auth/callback'}`;
    return reply.redirect(url);
  });

  fastify.get('/callback', async (request, reply) => {
    return reply.send({ message: 'Google OAuth callback - implement with google-auth-library' });
  });

  fastify.get('/me', { onRequest: [authenticate] }, async (request, reply) => {
    try {
      const decoded = await request.jwtVerify() as any;
      const user = await db.query.users.findFirst({
        where: eq(users.id, decoded.userId)
      });

      if (!user) {
        return reply.status(404).send({ error: 'User not found' });
      }

      return reply.send({
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
        role: user.role
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  fastify.post('/logout', { onRequest: [authenticate] }, async (request, reply) => {
    return reply.send({ message: 'Logged out successfully' });
  });
}