import { pgTable, uuid, text, boolean, timestamp, integer, bigint, jsonb } from 'drizzle-orm/pg-core';

// 1. Users Table (Discord OAuth authenticated operators)
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  discordId: text('discord_id').unique().notNull(),
  username: text('username').notNull(),
  discriminator: text('discriminator'),
  avatarUrl: text('avatar_url'),
  hasAccessRole: boolean('has_access_role').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// 2. Bot Credentials Table (Encrypted Discord Bot Tokens)
export const botCredentials = pgTable('bot_credentials', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull().unique(),
  encryptedToken: text('encrypted_token').notNull(),
  tokenIv: text('token_iv').notNull(),
  tokenTag: text('token_tag').notNull(),
  botId: text('bot_id'),
  botUsername: text('bot_username'),
  botAvatarUrl: text('bot_avatar_url'),
  isConnected: boolean('is_connected').default(false).notNull(),
  lastConnectedAt: timestamp('last_connected_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// 3. Message Templates Table
export const templates = pgTable('templates', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  name: text('name').notNull(),
  content: text('content'),
  embedData: jsonb('embed_data'),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// 4. Broadcast Campaigns Table
export const campaigns = pgTable('campaigns', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  guildId: text('guild_id').notNull(),
  guildName: text('guild_name').notNull(),
  targetType: text('target_type').notNull(), // 'all' | 'roles'
  targetRoleIds: text('target_role_ids').array().default([]).notNull(),
  messageContent: text('message_content'),
  embedData: jsonb('embed_data'),
  imageUrl: text('image_url'),
  status: text('status').default('draft').notNull(), // 'draft' | 'scheduled' | 'queued' | 'running' | 'paused' | 'completed' | 'failed' | 'stopped'
  totalRecipients: integer('total_recipients').default(0).notNull(),
  sentCount: integer('sent_count').default(0).notNull(),
  failedCount: integer('failed_count').default(0).notNull(),
  failReasons: jsonb('fail_reasons').default({ dm_closed: 0, left_server: 0, unknown: 0 }).notNull(),
  scheduledAt: timestamp('scheduled_at', { withTimezone: true }),
  startedAt: timestamp('started_at', { withTimezone: true }),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// 5. Campaign Recipients (Delivery audit log & duplicate guard)
export const campaignRecipients = pgTable('campaign_recipients', {
  id: uuid('id').defaultRandom().primaryKey(),
  campaignId: uuid('campaign_id').references(() => campaigns.id, { onDelete: 'cascade' }).notNull(),
  recipientDiscordId: text('recipient_discord_id').notNull(),
  recipientUsername: text('recipient_username'),
  status: text('status').default('pending').notNull(), // 'pending' | 'sent' | 'failed'
  failureReason: text('failure_reason'), // 'dm_closed' | 'left_server' | 'rate_limited' | 'forbidden'
  attemptedAt: timestamp('attempted_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// 6. Global Platform Metrics
export const globalMetrics = pgTable('global_metrics', {
  id: uuid('id').defaultRandom().primaryKey(),
  totalSent: bigint('total_sent', { mode: 'number' }).default(0).notNull(),
  totalFailed: bigint('total_failed', { mode: 'number' }).default(0).notNull(),
  totalCampaigns: bigint('total_campaigns', { mode: 'number' }).default(0).notNull(),
  totalBots: bigint('total_bots', { mode: 'number' }).default(0).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
