# Architecture: PodcastBot Clone (Discord Broadcast Automation Platform)

## Stack

| layer | choice | why |
| --- | --- | --- |
| web app | Next.js 15 (App Router) + TypeScript | React Server Components, server actions, fast route handlers, and shared typing across client/server. |
| styling | Tailwind CSS + CSS Custom Properties | Discord dark theme (`--bg-primary: #0a0a1a`, `--purple: #8b5cf6`), glassmorphism cards, and RTL/LTR support. |
| database | PostgreSQL (Supabase or Neon) | Managed relational database with JSONB support for rich embeds, RLS policies, and rock-solid ACID transactions. |
| ORM | Drizzle ORM | Type-safe SQL query builder with zero overhead and lightweight migrations. |
| auth | Auth.js (NextAuth v5) + Discord Provider | Official Discord OAuth2 login, retrieves user Discord ID, avatar, and mutual server access roles. |
| bot gateway | Node.js + `discord.js` v14 | The standard client library for interacting with Discord Gateway, intents, guild member fetching, and DM dispatching. |
| encryption | Node.js `crypto` (AES-256-GCM) | Master application key encrypts Discord bot tokens at rest with unique IV and authentication tags. |
| queue / worker | BullMQ + Redis (Upstash Redis) | Robust distributed queue supporting job throttling (~1-2 DM/s), pause, resume, retries, and backoff. |
| realtime / telemetry | Server-Sent Events (SSE) / Socket.IO | Push real-time broadcast progress, target member names, failure categorization, and emergency ban alerts to the client. |
| hosting | Fly.io or Railway (Web + Worker) | Low-latency container hosting supporting persistent long-running Discord Bot Gateway and Redis worker processes. |

## Schema

Tables: 6 tables (`users`, `bot_credentials`, `templates`, `campaigns`, `campaign_recipients`, `global_metrics`).  
Access rules: PostgreSQL Row Level Security (RLS) enabled on all tables; scoped to `auth.uid()`.  
Full SQL definition is maintained in [`replica/schema.sql`](file:///c:/Users/david/Desktop/wel3akta3at/replica/schema.sql).

### Key Constraints & Indexes
- `bot_credentials.user_id` has a unique constraint: one active bot credential set per user.
- `campaign_recipients.(campaign_id, recipient_discord_id)` has a composite unique constraint to guarantee zero duplicate DMs.
- Filter indexes on `campaigns(status)` and `campaigns(scheduled_at) where status = 'scheduled'` ensure fast worker queue polling.

## API

| method path | does | who | input | output | flow |
| --- | --- | --- | --- | --- | --- |
| `GET /api/auth/me` | Fetch authenticated Discord session & role gate | Any session | None | `{ id, username, avatar, hasAccess }` | F01 |
| `POST /api/auth/logout` | Terminate session cookie | User | None | `{ success: true }` | F01 |
| `POST /api/bot/connect` | Validate bot token, encrypt, test intents, store | User | `{ token: string }` | `{ bot: { id, username, avatar } }` | F01 |
| `POST /api/bot/disconnect` | Destroy bot gateway instance & mark inactive | User | None | `{ success: true }` | F01 |
| `GET /api/bot/status` | Current bot connection state and running progress | User | None | `{ connected, bot, isSending, sendProgress }` | F01, F06 |
| `GET /api/bot/saved-token` | Check if user has an encrypted token on file | User | None | `{ hasSavedToken: boolean }` | F01 |
| `GET /api/bot/guilds` | List mutual Discord servers the bot is in | User | None | `[{ id, name, memberCount, icon }]` | F01, F04 |
| `GET /api/bot/guilds/:guildId/roles` | Fetch guild roles with colors and member counts | User | None | `[{ id, name, color, memberCount }]` | F04 |
| `POST /api/bot/guilds/:guildId/members/count` | Calculate recipient target count and ETA | User | `{ roleIds: string[], sendToAll: bool }` | `{ count: number, estimatedSeconds: number }` | F04 |
| `POST /api/send` | Launch immediate broadcast campaign | User | `{ guildId, roleIds, sendToAll, message }` | `{ campaignId, status: 'running' }` | F04 |
| `POST /api/send/test` | Dispatch single test DM to operator's Discord account | User | `{ message }` | `{ success: true }` | F02 |
| `POST /api/send/schedule` | Queue future broadcast campaign | User | `{ guildId, roleIds, sendToAll, message, scheduledAt }` | `{ campaignId, status: 'scheduled' }` | F05 |
| `GET /api/send/schedule` | List all pending scheduled campaigns | User | None | `[{ id, guild_id, target, status, scheduled_at }]` | F05 |
| `DELETE /api/send/schedule/:id` | Cancel and delete scheduled campaign | User | None | `{ success: true }` | F05 |
| `POST /api/send/pause` | Pause ongoing delivery queue | User | None | `{ isPaused: true }` | F06 |
| `POST /api/send/resume` | Resume paused delivery queue | User | None | `{ isPaused: false }` | F06 |
| `POST /api/send/stop` | Terminate and abort ongoing campaign | User | None | `{ status: 'stopped' }` | F06 |
| `GET /api/templates` | List user's saved message templates | User | None | `[{ id, name, content, embed_data }]` | F03 |
| `POST /api/templates` | Save current message draft as template | User | `{ name, content, embed }` | `{ id, name }` | F03 |
| `DELETE /api/templates/:id` | Delete saved template | User | None | `{ success: true }` | F03 |
| `GET /api/stats` | Fetch aggregate platform metrics | Public / User | None | `{ totalSent, totalFailed, totalOperations, totalBots }` | S10 |
| `GET /api/logs` | Fetch historical campaign executions | User | None | `[{ id, created_at, guild_name, message_preview, total, sent, failed }]` | S10 |

### Real-Time Telemetry (WebSocket / SSE Events)
- `bot:status`: Emits bot connectivity events (`{ connected: boolean, bot: object }`).
- `send:progress`: Live tick during active delivery (`{ percentage, sent, failed, remaining, estTimeLeft, currentUser: { username }, failReasons }`).
- `send:complete`: Emitted when campaign finishes (`{ total, sent, failed }`).
- `send:error`: Emitted on rate-limit tripwire or 401/403 ban (`{ title, message, sent, failed, total }`).

### Background Jobs
1. **`ScheduledCampaignsWatcher`**: Runs every 60 seconds (`* * * * *`). Queries `campaigns` where `status = 'scheduled' AND scheduled_at <= now()`. Updates status to `queued` and enqueues jobs to BullMQ.
2. **`BroadcastQueueWorker`**: Processes recipient delivery jobs with token bucket rate-limiting (1 message per 1.25s). Handles exponential backoff when encountering HTTP 429 (`retry_after`).
3. **`MetricsAggregatorJob`**: Runs daily to compact delivery logs and update `global_metrics`.

## The Parts That Bite

- **Discord DM Rate Limits & IP Throttling**: Discord strictly throttles DM creation. Sending faster than ~1 DM per second triggers HTTP 429 `rate_limit_exceeded`. The worker must respect the `X-RateLimit-Reset-After` header and dynamically throttle execution.
- **Privileged Gateway Intents**: Fetching a guild's entire member list requires `GatewayIntentBits.GuildMembers` enabled in Discord Developer Portal. The bot connection endpoint must proactively test for intent permissions before confirming connection.
- **Closed User DMs (Error 50007)**: If a target user has DMs disabled or shares no mutual servers where DMs are permitted, Discord returns `50007: Cannot send messages to this user`. The worker must log this as `dm_closed` and proceed immediately without pausing the queue.
- **Bot Suspension & Token Invalidation (HTTP 401/403)**: If Discord flags or bans the bot token during broadcast, subsequent requests fail with 401/403. The worker must detect this condition instantly, halt the queue, trigger `send:error` with the Emergency Ban Modal, and prevent wasted proxy calls.
- **Duplicate Prevention & Idempotency**: If the server or worker crashes mid-broadcast, resuming from `campaign_recipients where status = 'pending'` ensures no user ever receives the same broadcast twice.
- **Time Zones & Scheduling**: Scheduled timestamps are computed on the client in the user's local time, converted to UTC ISO-8601 strings, stored as PostgreSQL `timestamptz`, and compared against `now() AT TIME ZONE 'UTC'`.

## Build Order

1. **Vertical slice (Core Loop Proof):**
   - Screens: S01 (Login), S02 (Bot Connect), S03 (Server Select), S07 (Test Send).
   - Tables: `users`, `bot_credentials`.
   - Routes: `GET /api/auth/me`, `POST /api/bot/connect`, `GET /api/bot/guilds`, `POST /api/send/test`.
2. **Must-haves (Production Broadcast Engine):**
   - Screens: S03 (Role Chips filter), S04 (Rich Embed Composer), S05 (Discord Preview Modal), S07 (Start Broadcast), S08 (Live Delivery Monitor & Pause/Resume/Stop), S09 (Emergency Ban Modal), S10 (Stats & Logs).
   - Tables: `campaigns`, `campaign_recipients`, `global_metrics`.
   - Routes: `GET /api/bot/guilds/:id/roles`, `POST /api/send`, `POST /api/send/pause`, `POST /api/send/resume`, `POST /api/send/stop`, `GET /api/stats`, `GET /api/logs`.
   - Services: BullMQ queue worker + SSE / Socket.IO real-time progress channel.
3. **Should-haves & Polish:**
   - Screens: S06 (Templates Drawer), S11 (Scheduled Campaigns Table), Developer Setup Guide Accordion, RTL/LTR Arabic/English toggle.
   - Tables: `templates`.
   - Routes: `GET /api/templates`, `POST /api/templates`, `DELETE /api/templates/:id`, `POST /api/send/schedule`, `GET /api/send/schedule`, `DELETE /api/send/schedule/:id`.
4. **Fixes from replica-entrepreneur:**
   - Review analysis inputs addressing user friction points (e.g. anti-ban proxy support, smart member cooldowns, auto-save drafts).

## Summary
- **Stack:** Next.js 15 (App Router) + PostgreSQL (Supabase/Neon) + Drizzle ORM + Auth.js (Discord) + `discord.js` v14 + BullMQ (Redis).
- **Tables:** 6 relational tables with RLS and strict composite uniqueness constraints.
- **Routes:** 21 REST API endpoints + 4 WebSocket/SSE real-time telemetry events + 2 background worker jobs.
- **Top 3 Risks:** Discord DM rate limits & IP throttling, Discord privileged intent requirements (403), and anti-ban token invalidation recovery.
- **Next Step:** Run `/replica-design` to extract the design tokens, typography, dark color roles, and Discord-accurate component specs.
