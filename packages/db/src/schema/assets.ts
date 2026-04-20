import { pgTable, uuid, varchar, text, integer, timestamp } from 'drizzle-orm/pg-core'
import { users } from './users'
import { categories } from './categories'

export const assets = pgTable('assets', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  status: varchar('status', { length: 50 }).default('created'),
  playbackId: varchar('playback_id', { length: 100 }).unique(),
  thumbnailKey: varchar('thumbnail_key', { length: 500 }),
  hlsManifestKey: varchar('hls_manifest_key', { length: 500 }),
  duration: integer('duration'),
  categoryId: uuid('category_id').references(() => categories.id),
  views: integer('views').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})
