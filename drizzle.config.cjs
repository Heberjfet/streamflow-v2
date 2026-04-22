/** @type {import('drizzle-kit').Config} */
module.exports = {
  schema: './apps/api/src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgresql://streamflow:streamflow@postgres:5432/streamflow',
  },
};