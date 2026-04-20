import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { OAuth2Client } from 'google-auth-library';
import bcrypt from 'bcrypt';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/v1/auth/callback';

const googleOAuth2Client = new OAuth2Client(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI
);

interface RegisterBody {
  email: string;
  password: string;
  name: string;
}

interface LoginBody {
  email: string;
  password: string;
}

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post<{ Body: RegisterBody }>('/register', async (request, reply) => {
    try {
      const { email, password, name } = request.body;

      const existingUser = await fastify.db.query.users.findFirst({
        where: fastify.eq(fastify.schema.users.email, email)
      });

      if (existingUser) {
        return reply.status(409).send({ error: 'Email already registered' });
      }

      const passwordHash = await bcrypt.hash(password, 12);

      const [user] = await fastify.db
        .insert(fastify.schema.users)
        .values({
          email,
          passwordHash,
          name
        })
        .returning();

      const token = fastify.jwt.sign({
        userId: user.id,
        email: user.email
      });

      return reply.status(201).send({
        id: user.id,
        email: user.email,
        name: user.name,
        token
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  fastify.post<{ Body: LoginBody }>('/login', async (request, reply) => {
    try {
      const { email, password } = request.body;

      const user = await fastify.db.query.users.findFirst({
        where: fastify.eq(fastify.schema.users.email, email)
      });

      if (!user || !user.passwordHash) {
        return reply.status(401).send({ error: 'Invalid credentials' });
      }

      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (!isValid) {
        return reply.status(401).send({ error: 'Invalid credentials' });
      }

      const token = fastify.jwt.sign({
        userId: user.id,
        email: user.email
      });

      return reply.send({
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  fastify.get('/google', async (request, reply) => {
    const url = googleOAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['email', 'profile'],
      prompt: 'consent'
    });
    return reply.redirect(url);
  });

  fastify.get('/callback', async (request, reply) => {
    try {
      const { code } = request.query as { code?: string };

      if (!code) {
        return reply.status(400).send({ error: 'Missing authorization code' });
      }

      const { tokens } = await googleOAuth2Client.getToken(code);
      googleOAuth2Client.setCredentials(tokens);

      const ticket = await googleOAuth2Client.verifyIdToken({
        idToken: tokens.id_token!,
        audience: GOOGLE_CLIENT_ID
      });

      const payload = ticket.getPayload();
      if (!payload) {
        return reply.status(400).send({ error: 'Invalid Google token' });
      }

      let user = await fastify.db.query.users.findFirst({
        where: fastify.eq(fastify.schema.users.googleId, payload.sub)
      });

      if (!user) {
        [user] = await fastify.db
          .insert(fastify.schema.users)
          .values({
            email: payload.email!,
            name: payload.name || 'Unknown User',
            googleId: payload.sub
          })
          .returning();
      }

      const token = fastify.jwt.sign({
        userId: user.id,
        email: user.email
      });

      return reply.send({
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  fastify.get('/me', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    try {
      const user = await fastify.db.query.users.findFirst({
        where: fastify.eq(fastify.schema.users.id, request.currentUser.userId)
      });

      if (!user) {
        return reply.status(404).send({ error: 'User not found' });
      }

      return reply.send({
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });

  fastify.post('/logout', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    return reply.send({ message: 'Logged out successfully' });
  });
}
