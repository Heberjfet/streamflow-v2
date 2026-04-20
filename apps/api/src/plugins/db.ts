import { FastifyInstance } from 'fastify';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import fp from 'fastify-plugin';
import { schema } from '../db/schema.js';
import { eq, desc } from 'drizzle-orm';

const connectionString = process.env.DATABASE_URL || 'postgres://streamflow:streamflow@postgres:5432/streamflow';

const client = postgres(connectionString, { max: 10 });
const db = drizzle(client, { schema });

export default fp(async function dbPlugin(fastify: FastifyInstance) {
  fastify.log.info('dbPlugin: Decorating fastify with db');
  fastify.decorate('db', db);
  fastify.decorate('schema', schema);
  fastify.decorate('eq', eq);
  fastify.decorate('desc', desc);
  fastify.log.info('dbPlugin: db decoration complete');

  fastify.addHook('onClose', async () => {
    await client.end();
  });
});

declare module 'fastify' {
  interface FastifyInstance {
    db: typeof db;
    schema: typeof schema;
    eq: typeof eq;
    desc: typeof desc;
  }
}

export { db, eq, desc };