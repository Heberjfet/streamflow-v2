import { FastifyInstance } from 'fastify';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { schema } from '../db/schema.js';

const connectionString = process.env.DATABASE_URL || 'postgres://user:password@localhost:5432/streamflow';

const client = postgres(connectionString);
const db = drizzle(client, { schema });

export async function dbPlugin(fastify: FastifyInstance) {
  fastify.decorate('db', db);
  fastify.decorate('schema', schema);

  fastify.addHook('onClose', async () => {
    await client.end();
  });
}

declare module 'fastify' {
  interface FastifyInstance {
    db: typeof db;
    schema: typeof schema;
  }
}

export { db };
