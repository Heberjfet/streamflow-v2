import { pgTable, uuid, varchar, text, integer, timestamp } from 'drizzle-orm/pg-core'
import { assets } from './assets'

export const jobs = pgTable('jobs', {
  id: uuid('id').defaultRandom().primaryKey(),
  assetId: uuid('asset_id').references(() => assets.id),
  type: varchar('type', { length: 50 }).notNull(),
  status: varchar('status', { length: 50 }).default('pending'),
  progress: integer('progress').default(0),
  error: text('error'),
  queueId: varchar('queue_id', { length: 100 }),
  startedAt: timestamp('started_at'),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow(),
})
