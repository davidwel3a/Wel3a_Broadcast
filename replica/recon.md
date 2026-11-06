# Recon map: Podcast Bot (بوت بودكاست ديسكورد) (Web / Discord Bot Platform)

Scope: Full-stack Discord Broadcast Automation Platform (Dashboard, Bot Token Gateway, Target Role Filtering, Rich Embed Builder, Message Preview, Queue Scheduler, Real-time WebSocket Monitor, Anti-Ban Protection)  
For: Discord community managers, server owners, SaaS vendors, and digital agencies sending direct messaging broadcasts  
Date: 2026-11-06  

## Sources

| # | source | URL | notes |
| --- | --- | --- | --- |
| 1 | Production Web Application | https://podcastbot.online/ | Full dashboard layout, glassmorphic UI, RTL Arabic/LTR English |
| 2 | Frontend Logic & State Machine | https://podcastbot.online/script.js | Complete client architecture, API endpoints, Socket.IO events, state management |
| 3 | Core Styling & Design Tokens | https://podcastbot.online/style.css | Dark palette, CSS custom properties, Discord styling, responsive breakpoints |
| 4 | Discord Developer Documentation | https://discord.com/developers/docs | Discord Bot Gateway, Privileged Intents, REST API rate limits, OAuth2 |

## Core loop

Connect a Discord bot token, filter server members by custom roles, draft rich embed announcements with real-time Discord preview, and broadcast direct messages with live delivery tracking and anti-ban safeguards.

## Screens

| ID | screen | route / how to reach | purpose | key components | states seen |
| --- | --- | --- | --- | --- | --- |
| S01 | Discord OAuth2 Login Gate | `/` (unauthenticated) | Restrict dashboard access to verified server members / paying clients | Discord OAuth2 CTA button, animated logo, glassmorphic card, Arabic/English explanations | Unauthenticated (login card), Authenticating (spinner), Unauthorized (missing role error) |
| S02 | Bot Connection & Token Manager | Header / `#connect-card` | Input bot token, authenticate with Discord Gateway, view bot profile | Token input with reveal toggle, Connect/Disconnect button, Status badge, Bot profile avatar/username, Setup guide accordion | Disconnected, Connecting (spinner), Connected (online badge), Saved token masked (`••••••••`), Token invalid error |
| S03 | Audience & Server Target Selector | `#settings-card` | Select target guild and choose recipient scope | Server select dropdown, "Send to all" checkbox, Dynamic role chips with role color indicators, Recipient count badge, ETA display | Hidden (offline bot), Loading servers/roles, Guild selected, Roles multi-selected, All-members checked |
| S04 | Broadcast Message Composer | `#editor-card` | Draft plain text, rich embeds, or attached image messages | Textarea (2000 char counter), Embed Title (256 char), Embed Description (4096 char), Color picker, Image URL inputs, "Preview" button, "Save Template" button | Plain text mode, Rich embed mode, Image mode, Character limit warning/danger |
| S05 | Discord Message Live Preview Modal | `#preview-modal-el` | Pixel-accurate simulation of how the message renders inside Discord DMs | Modal backdrop, Close button, Bot avatar, Bot tag badge, Timestamp, Markdown body, Colored embed card, Attached image | Closed (hidden), Open (rendered preview) |
| S06 | Templates Manager | `#templates-card` | Save drafted announcements and reuse them with one click | Template save dialog (name input + confirm/cancel), Template list container, Apply button, Delete button | Empty (no templates), Dialog open, Templates loaded |
| S07 | Broadcast Controls & Scheduler | `#send-controls-card` | Choose immediate or scheduled execution and trigger delivery | "Schedule for later" checkbox, Quick preset chips (1h, 6h, 12h, 24h), Custom number & unit inputs, Calculated time badge, "Send Test Message" button, "Start Broadcast" button | Ready to send, Disabled (validation incomplete), Scheduled mode active, Sending in progress |
| S08 | Real-time Delivery Monitor | `#progress-container-el` | Live telemetry of broadcast progress, current recipient, and error breakdown | Animated progress bar & percentage, Current target member tag, Metrics (Sent, Failed, Remaining, Time Left), Error breakdown chips (Closed DMs, Left server, API error), Pause, Resume, Stop buttons | Idle, Sending (animated bar, live socket updates), Paused, Completed (success sound), Aborted |
| S09 | Emergency Restriction / Ban Alert Modal | `#emergency-ban-modal` | Immediate fail-safe overlay when Discord rate-limits or restricts the bot token | Red emergency alert box, Ban icon, Alert alarm tone, Summary stats box (Sent / Failed / Total), Acknowledge CTA | Hidden, Triggered upon 401/403/429 socket event |
| S10 | Performance Analytics & Historical Logs | `#overview-stats-card` & `#logs-card` | Overview KPIs and detailed table of past broadcast executions | Aggregate KPI cards (Total Sent, Total Failed, Success Rate %, Total Campaigns, Active Bots), Historical logs table with date, guild, preview, totals, and success ratios | Empty state, Populated logs table |
| S11 | Scheduled Campaigns Queue | `#scheduled-campaigns-card` | Monitor and manage pending future broadcasts | Scheduled jobs table (Date, Target Guild, Target Scope, Status badge, Cancel/Delete action button) | Hidden (no pending), Populated queue |

## Flows

```
F01 Connect Bot and Verify Setup
    S01 -> S02 (Paste Bot Token -> Click Connect) -> S03 (Guilds loaded)
    happy path clicks: 3
    edge: User lacks Discord server role; Token missing Privileged Gateway Intents (Server Members / Message Content); Token expired.

F02 Compose and Preview Discord Message
    S04 (Select Embed tab -> Enter title, description, color, image) -> S04 (Click "Preview") -> S05 (Inspect Discord bubble preview) -> Close modal
    happy path clicks: 4
    edge: Description exceeds 4096 chars; Invalid image URL format; Plain text exceeds 2000 chars.

F03 Save and Apply Message Template
    S04 (Draft message) -> Click "Save as Template" -> S06 (Enter template name -> Confirm) -> S06 (Click template chip -> Composer auto-fills)
    happy path clicks: 3
    edge: Template name blank; Overwriting unsaved active draft.

F04 Immediate Broadcast Execution
    S03 (Select Guild -> Pick Role chips -> Verify recipient count) -> S04 (Draft message) -> S07 (Click "Start Broadcast") -> S08 (Live progress bar, member tag, success audio on finish)
    happy path clicks: 4
    edge: Recipient DMs closed (classified in failure counter); Member left server; Bot temporarily rate-limited.

F05 Scheduled Broadcast Campaign
    S03 (Select Target) -> S04 (Draft Message) -> S07 (Check Schedule -> Pick preset e.g. 6h -> Confirm calculated time) -> S07 (Click Schedule) -> S11 (Queued in table)
    happy path clicks: 5
    edge: Scheduled time in the past; User cancels schedule before trigger; Token changed before scheduled trigger.

F06 In-Flight Queue Control & Emergency Intervention
    S08 (Click "Pause" -> Halts delivery queue) -> S08 (Click "Resume" -> Resumes) OR Discord 429/403 event -> S09 (Emergency siren + Modal pop-up -> Instantly aborts queue to save proxy and token)
    happy path clicks: 1
    edge: Network drop during socket streaming; Gateway disconnect during broadcast.
```

## Components

| component | variants | states | used on |
| --- | --- | --- | --- |
| Button (`btn`) | primary (`btn-primary`), ghost (`btn-ghost`), danger (`btn-danger`), warning (`btn-warning`), success (`btn-success`), sm / block | default, hover, focus, disabled, loading (spinner) | all screens |
| Input (`form-control`) | text, password with toggle, number, select | default, focus, invalid, disabled | S01, S02, S03, S04, S07 |
| Role Chip (`role-chip`) | colored dot, custom border color | default, selected, hover | S03 |
| Tab Button (`tab-btn`) | text, embed, image | default, active | S04 |
| Character Counter (`char-counter`) | normal, warning (>85%), danger (100%) | text counter | S04 |
| Color Picker | native hex color picker with preset sync | default, changed | S04 |
| Modal Backdrop & Box | Discord preview modal, Emergency ban modal | hidden, enter-animation, open | S05, S09 |
| Progress Bar | animated gradient fill (`send-progress-fill`) | 0% to 100%, smooth transition | S08 |
| Stat KPI Card | primary purple, success green, danger red, warning orange | default, hover glow | S08, S10 |
| Data Table | responsive dark table (`logs-table`, `scheduled-table`) | loading, empty row, populated rows | S10, S11 |
| Toast Notification | success (green), error (red), info (blue), warning (orange) | slide-in, auto-dismiss (4s) | all screens |
| Language Switcher | RTL / LTR toggle | active language | header |

## Inferred data model

```
User (Dashboard Operator)
  id: string (Discord Snowflake ID)
  username: string
  avatar: string (Discord CDN URL)
  has_access_role: boolean
  created_at: timestamp
  evidence: /api/auth/me response, login guard
  confidence: high

BotSession
  user_id: string (FK -> User.id)
  encrypted_token: string
  bot_id: string (Discord Snowflake ID)
  bot_username: string
  bot_avatar: string
  connected: boolean
  last_connected_at: timestamp
  evidence: /api/bot/connect, /api/bot/saved-token, /api/bot/status
  confidence: high

BroadcastCampaign
  id: string (UUID / Auto-increment)
  user_id: string (FK -> User.id)
  guild_id: string (Discord Guild Snowflake)
  guild_name: string
  target_type: enum ('all', 'roles')
  target_role_ids: json (array of role snowflake IDs)
  message_content: text (optional, max 2000 chars)
  embed_data: json ({ title, description, color, image }) (optional)
  image_url: string (optional)
  status: enum ('pending', 'running', 'paused', 'completed', 'failed', 'stopped')
  total_recipients: integer
  sent_count: integer
  failed_count: integer
  fail_reasons: json ({ dm_closed: int, left_server: int, unknown: int })
  scheduled_at: timestamp (optional)
  started_at: timestamp
  completed_at: timestamp
  evidence: /api/send, /api/send/schedule, /api/logs, socket send:progress
  confidence: high

Template
  id: string (UUID)
  user_id: string (FK -> User.id)
  name: string
  content: text (max 2000 chars)
  embed_data: json ({ title, description, color, image })
  created_at: timestamp
  evidence: /api/templates endpoints, template dialog
  confidence: high

GlobalStats
  total_sent: integer
  total_failed: integer
  total_operations: integer
  total_bots_registered: integer
  evidence: /api/stats endpoint
  confidence: high
```

Relationships:
- `User` 1-1 `BotSession`
- `User` 1-n `BroadcastCampaign`
- `User` 1-n `Template`
- `BroadcastCampaign` 1-n `DeliveryLogs`

## Feature matrix

See `features.csv`.
- **Must**: 21 features (OAuth login, token gateway, guilds/roles picker, message builder, live preview, immediate broadcast, progress stream, pause/resume/stop, stats, logs).
- **Should**: 10 features (setup guide, image attachment, templates, scheduling, member indicators, i18n RTL/LTR).
- **Could**: 5 features (quick presets, audio alerts, desktop notifications).
- **Skip**: 3 features (Discord API developer portal, Discord gateway DM rate limit policies, proxy residential network).

## Out of scope (cannot or should not be cloned)

1. **Discord API Gateway Infrastructure & Policy Constraints**: Discord strictly enforces developer bot intents, direct message rate limits (approx 1 DM per second per bot before throttling), and user privacy configurations (members who turn off DMs in server privacy settings cannot be messaged).
2. **Discord Developer Account Credentials**: Users must supply their own bot token from `discord.com/developers/applications`.
3. **Third-Party Proxy Networks**: Residential proxy rotation pools are external operational infrastructure, not application code.

## Size

- Screens: 11 (including modals & panels)
- Flows: 6 core user flows
- Entities: 5 primary data entities
- Hard parts:
  1. Real-time stateful queue runner with pause/resume and rate-limit backoff across Discord REST/Gateway endpoints.
  2. WebSocket telemetry streaming exact per-user progress, remaining time algorithms, and instant error reason classifications.
  3. Discord API compliance & anti-ban tripwires (401/403/429 emergency shutdown).

**Size: M (a few weeks for a production full-stack replica).**
