import { pgTable, text, timestamp, varchar, integer, uuid, boolean, jsonb, index, unique } from 'drizzle-orm/pg-core';

export const organizations = pgTable('organizations', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  ownerId: uuid('owner_id').notNull(),
  tier: varchar('tier', { length: 50 }).notNull().default('free'),
  webhookUrl: text('webhook_url'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const orgMembers = pgTable('org_members', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').notNull().references(() => organizations.id),
  userId: uuid('user_id').notNull().references(() => users.id),
  role: varchar('role', { length: 50 }).notNull().default('member'),
  createdAt: timestamp('created_at').defaultNow()
}, (table) => ({
  orgUserUnique: unique('org_members_org_user_unique').on(table.orgId, table.userId)
}));

export const apiKeys = pgTable('api_keys', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').notNull().references(() => organizations.id),
  name: varchar('name', { length: 255 }).notNull(),
  keyHash: text('key_hash').notNull(),
  keyPrefix: varchar('key_prefix', { length: 20 }).notNull(),
  lastUsedAt: timestamp('last_used_at'),
  createdAt: timestamp('created_at').defaultNow()
});

export const webhooks = pgTable('webhooks', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').references(() => organizations.id),
  url: text('url').notNull(),
  events: jsonb('events').notNull().default([]),
  active: boolean('active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow()
});

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  passwordHash: text('password_hash'),
  googleId: varchar('google_id', { length: 255 }).unique(),
  avatarUrl: text('avatar_url'),
  role: varchar('role', { length: 50 }).notNull().default('viewer'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow()
});

export const assets = pgTable('assets', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').references(() => organizations.id),
  userId: uuid('user_id').notNull().references(() => users.id),
  title: varchar('title', { length: 500 }).notNull(),
  description: text('description'),
  categoryId: uuid('category_id').references(() => categories.id),
  status: varchar('status', { length: 50 }).notNull().default('pending'),
  playbackId: varchar('playback_id', { length: 255 }).unique(),
  duration: integer('duration'),
  thumbnailKey: varchar('thumbnail_key', { length: 500 }),
  hlsManifestKey: varchar('hls_manifest_key', { length: 500 }),
  sourceKey: varchar('source_key', { length: 500 }),
  sourceType: varchar('source_type', { length: 50 }).default('upload'),
  views: integer('views').default(0),
  publicSettings: jsonb('public_settings').default({
    allowDownload: false,
    showComments: true,
    showReactions: true
  }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
}, (table) => ({
  statusIdx: index('assets_status_idx').on(table.status),
  orgIdIdx: index('assets_org_id_idx').on(table.orgId),
  userIdIdx: index('assets_user_id_idx').on(table.userId)
}));

export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  token: text('token').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow()
});

export const analyticsEvents = pgTable('analytics_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').references(() => organizations.id),
  assetId: uuid('asset_id').references(() => assets.id),
  playbackId: varchar('playback_id', { length: 255 }),
  sessionId: varchar('session_id', { length: 255 }),
  eventType: varchar('event_type', { length: 50 }).notNull(),
  currentTime: integer('current_time'),
  duration: integer('duration'),
  qualityHeight: integer('quality_height'),
  referrer: text('referrer'),
  playerType: varchar('player_type', { length: 50 }),
  bufferDurationMs: integer('buffer_duration_ms'),
  errorMessage: text('error_message'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow()
}, (table) => ({
  eventTypeIdx: index('analytics_event_type_idx').on(table.eventType),
  assetIdIdx: index('analytics_asset_id_idx').on(table.assetId),
  createdAtIdx: index('analytics_created_at_idx').on(table.createdAt)
}));

export const comments = pgTable('comments', {
  id: uuid('id').primaryKey().defaultRandom(),
  assetId: uuid('asset_id').notNull().references(() => assets.id),
  userId: uuid('user_id').references(() => users.id),
  authorName: varchar('author_name', { length: 255 }),
  authorEmail: varchar('author_email', { length: 255 }),
  content: text('content').notNull(),
  timestamp: integer('timestamp'),
  gravatarHash: varchar('gravatar_hash', { length: 32 }),
  createdAt: timestamp('created_at').defaultNow()
}, (table) => ({
  assetIdIdx: index('comments_asset_id_idx').on(table.assetId)
}));

export const reactions = pgTable('reactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  assetId: uuid('asset_id').notNull().references(() => assets.id),
  sessionId: varchar('session_id', { length: 255 }).notNull(),
  emoji: varchar('emoji', { length: 50 }).notNull(),
  createdAt: timestamp('created_at').defaultNow()
}, (table) => ({
  assetIdIdx: index('reactions_asset_id_idx').on(table.assetId),
  assetSessionUnique: unique('reactions_asset_session_emoji_unique').on(table.assetId, table.sessionId, table.emoji)
}));

export const schema = {
  organizations,
  orgMembers,
  apiKeys,
  webhooks,
  users,
  categories,
  assets,
  sessions,
  analyticsEvents,
  comments,
  reactions
};

export type Organization = typeof organizations.$inferSelect;
export type NewOrganization = typeof organizations.$inferInsert;
export type OrgMember = typeof orgMembers.$inferSelect;
export type ApiKey = typeof apiKeys.$inferSelect;
export type Webhook = typeof webhooks.$inferSelect;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Asset = typeof assets.$inferSelect;
export type NewAsset = typeof assets.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type AnalyticsEvent = typeof analyticsEvents.$inferSelect;
export type Comment = typeof comments.$inferSelect;
export type Reaction = typeof reactions.$inferSelect;

export const USER_ROLES = {
  OWNER: 'owner',
  ADMIN: 'admin',
  MEMBER: 'member'
} as const;

export const ASSET_STATUS = {
  PENDING: 'pending',
  UPLOADING: 'uploading',
  UPLOADED: 'uploaded',
  PROCESSING: 'processing',
  READY: 'ready',
  FAILED: 'failed'
} as const;

export const ANALYTICS_EVENT_TYPES = {
  VIEW_START: 'view_start',
  HEARTBEAT: 'heartbeat',
  PAUSE: 'pause',
  SEEK: 'seek',
  QUALITY_CHANGE: 'quality_change',
  BUFFER_START: 'buffer_start',
  BUFFER_END: 'buffer_end',
  ERROR: 'error',
  VIEW_END: 'view_end'
} as const;

export const WEBHOOK_EVENTS = {
  ASSET_READY: 'asset.ready',
  ASSET_ERROR: 'asset.error',
  ASSET_DELETED: 'asset.deleted'
} as const;

export const REACTION_EMOJIS = ['fire', 'heart', 'laugh', 'clap', 'mindblown', 'sad'] as const;