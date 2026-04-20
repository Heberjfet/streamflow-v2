import { pgTable, uuid, varchar, integer, timestamp } from 'drizzle-orm/pg-core'
import { assets } from './assets'

export const renditions = pgTable('renditions', {
  id: uuid('id').defaultRandom().primaryKey(),
  assetId: uuid('asset_id').references(() => assets.id),
  resolution: varchar('resolution', { length: 20 }).notNull(),
  bitrate: integer('bitrate'),
  hlsPlaylistKey: varchar('hls_playlist_key', { length: 500 }),
  segmentPath: varchar('segment_path', { length: 500 }),
  status: varchar('status', { length: 50 }).default('pending'),
  createdAt: timestamp('created_at').defaultNow(),
})
