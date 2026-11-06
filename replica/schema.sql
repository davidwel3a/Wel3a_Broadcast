-- ==============================================================================
-- Schema: Replica PodcastBot (Discord Broadcast Automation Platform)
-- PostgreSQL + RLS + UUIDs + Strict Constraints + Indices
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- ------------------------------------------------------------------------------
-- 1. USERS (Operators authenticated via Discord OAuth2)
-- ------------------------------------------------------------------------------
create table users (
  id uuid primary key default gen_random_uuid(),
  discord_id text unique not null,
  username text not null,
  discriminator text,
  avatar_url text,
  has_access_role boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_users_discord_id on users (discord_id);

-- ------------------------------------------------------------------------------
-- 2. BOT CREDENTIALS (Encrypted Bot Tokens per User)
-- ------------------------------------------------------------------------------
create table bot_credentials (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  encrypted_token text not null,
  token_iv text not null,
  token_tag text not null,
  bot_id text,
  bot_username text,
  bot_avatar_url text,
  is_connected boolean not null default false,
  last_connected_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint unique_user_bot unique (user_id)
);

create index idx_bot_credentials_user on bot_credentials (user_id);

-- ------------------------------------------------------------------------------
-- 3. MESSAGE TEMPLATES
-- ------------------------------------------------------------------------------
create table templates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  name text not null,
  content text,
  embed_data jsonb,
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_templates_user on templates (user_id);

-- ------------------------------------------------------------------------------
-- 4. BROADCAST CAMPAIGNS
-- ------------------------------------------------------------------------------
create table campaigns (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  guild_id text not null,
  guild_name text not null,
  target_type text not null check (target_type in ('all', 'roles')),
  target_role_ids text[] not null default '{}',
  message_content text,
  embed_data jsonb,
  image_url text,
  status text not null default 'draft'
    check (status in ('draft', 'scheduled', 'queued', 'running', 'paused', 'completed', 'failed', 'stopped')),
  total_recipients integer not null default 0 check (total_recipients >= 0),
  sent_count integer not null default 0 check (sent_count >= 0),
  failed_count integer not null default 0 check (failed_count >= 0),
  fail_reasons jsonb not null default '{"dm_closed": 0, "left_server": 0, "unknown": 0}'::jsonb,
  scheduled_at timestamptz,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_campaigns_user on campaigns (user_id);
create index idx_campaigns_status on campaigns (status);
create index idx_campaigns_scheduled on campaigns (scheduled_at) where status = 'scheduled';
create index idx_campaigns_created on campaigns (created_at desc);

-- ------------------------------------------------------------------------------
-- 5. CAMPAIGN RECIPIENTS (Individual DM delivery audit log & idempotency)
-- ------------------------------------------------------------------------------
create table campaign_recipients (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references campaigns(id) on delete cascade,
  recipient_discord_id text not null,
  recipient_username text,
  status text not null default 'pending' check (status in ('pending', 'sent', 'failed')),
  failure_reason text check (failure_reason in ('dm_closed', 'left_server', 'rate_limited', 'forbidden', 'unknown')),
  attempted_at timestamptz,
  created_at timestamptz not null default now(),
  constraint unique_campaign_recipient unique (campaign_id, recipient_discord_id)
);

create index idx_campaign_recipients_campaign on campaign_recipients (campaign_id);
create index idx_campaign_recipients_status on campaign_recipients (campaign_id, status);

-- ------------------------------------------------------------------------------
-- 6. GLOBAL METRICS (Aggregated platform stats)
-- ------------------------------------------------------------------------------
create table global_metrics (
  id uuid primary key default gen_random_uuid(),
  total_sent bigint not null default 0,
  total_failed bigint not null default 0,
  total_campaigns bigint not null default 0,
  total_bots bigint not null default 0,
  updated_at timestamptz not null default now()
);

-- Initialize global metrics row
insert into global_metrics (total_sent, total_failed, total_campaigns, total_bots)
values (0, 0, 0, 0)
on conflict do nothing;

-- ------------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS)
-- ------------------------------------------------------------------------------
alter table users enable row level security;
alter table bot_credentials enable row level security;
alter table templates enable row level security;
alter table campaigns enable row level security;
alter table campaign_recipients enable row level security;
alter table global_metrics enable row level security;

-- Policies (Assuming auth.uid() provides user.id in Supabase or session-based queries)
create policy "Users can view their own profile"
  on users for select using (id = auth.uid());

create policy "Users manage their own bot credentials"
  on bot_credentials for all using (user_id = auth.uid());

create policy "Users manage their own templates"
  on templates for all using (user_id = auth.uid());

create policy "Users manage their own campaigns"
  on campaigns for all using (user_id = auth.uid());

create policy "Users view their campaign recipients"
  on campaign_recipients for select using (
    exists (select 1 from campaigns c where c.id = campaign_recipients.campaign_id and c.user_id = auth.uid())
  );

create policy "Public read for global metrics"
  on global_metrics for select using (true);
