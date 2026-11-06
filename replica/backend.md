# Backend Architecture & Security Checklist: PodcastBot Clone

Built from `replica/architecture.md` to provide full Discord API integration, database migrations, token encryption, and delivery queue management.

---

## 1. Authentication & Session Verification
- **Provider**: Discord OAuth2 (NextAuth v5 / Auth.js) with official authorization code flow.
- **Access Role Gate**: Operator verification enforcing `REQUIRED_DISCORD_ROLE_ID` membership before unlocking dashboard endpoints.
- **Sessions**: Secure, `http-only`, `same-site: lax` cookies with base64/JSON verification (`/api/auth/me`, `/api/auth/logout`).
- **Account Deletion**: User data cascaded upon request with complete database cleanup.

---

## 2. Database & Data Layer
- **ORM & Client**: Drizzle ORM + `postgres` connection pooling.
- **Schema**: 6 tables matching `replica/schema.sql` (`users`, `bot_credentials`, `templates`, `campaigns`, `campaign_recipients`, `global_metrics`).
- **Access Control**: PostgreSQL Row-Level Security (RLS) configured on every table, keyed to `auth.uid()`.
- **Seed Script**: Deterministic seed file available at [`lib/db/seed.ts`](file:///c:/Users/david/Desktop/wel3akta3at/lib/db/seed.ts).
- **Zero Raw Tokens**: Tokens are encrypted using AES-256-GCM before database write; plaintext tokens exist only transiently in memory during Gateway dispatching.

---

## 3. Cryptography & Key Management
- **Module**: [`lib/crypto.ts`](file:///c:/Users/david/Desktop/wel3akta3at/lib/crypto.ts)
- **Algorithm**: AES-256-GCM with unique 16-byte initialization vector (`iv`) and 16-byte authentication tag (`tag`) per credential record.
- **Environment Key**: Driven by `ENCRYPTION_MASTER_KEY` (32 bytes hex encoded).

---

## 4. Discord Bot Integration & Gateway Policies
- **Client**: `discord.js` v14 with official Discord REST API v10 endpoints.
- **Intents**: Handled via `GatewayIntentBits.Guilds`, `GatewayIntentBits.GuildMembers`, and `GatewayIntentBits.MessageContent`.
- **Rate-Limiting**: Enforces token bucket throttling (1 message every 1.25s) with automatic dynamic sleep on HTTP 429 (`X-RateLimit-Reset-After`).
- **Error 50007**: Direct Message closed privacy setting automatically caught and classified into `fail_reasons.dm_closed` without stalling the delivery queue.
- **Tripwire Shutdown**: Detection of 401/403/429 ban triggers immediate emergency halt to safeguard tokens and residential proxy pools.

---

## 5. Security & Preflight Checklist

- [x] **Secrets Isolation**: Secrets live strictly in environment variables; `.env*` added to `.gitignore`; `.env.example` checked in with zero secret values.
- [x] **Server-side Validation**: Zod schema validation applied on every mutating route (`/api/bot/connect`, `/api/send`, `/api/send/test`, `/api/send/schedule`, `/api/templates`).
- [x] **Authorization Verification**: `requireAuthUser()` called on every route, verifying both session existence and authorized Discord server role.
- [x] **Delivery Rate Limiting**: Queue dispatcher enforces 1.25s throttling per DM to respect Discord API policies.
- [x] **Clean Room Code**: Zero proprietary code, private endpoints, or reverse-engineered tokens used.
- [x] **Safe Logging**: No user tokens, webhook secrets, or sensitive recipient PII leaked in logs or console output.
- [x] **Idempotency Guard**: Composite constraint on `campaign_recipients(campaign_id, recipient_discord_id)` guarantees zero duplicate deliveries on resumption.

---

## 6. API Route Verification Matrix

| Route | Method | Status | Protected | Description |
| :--- | :--- | :--- | :--- | :--- |
| `/api/auth/me` | `GET` | **200 OK** | Yes | Current user session & access role |
| `/api/auth/logout` | `POST` | **200 OK** | Yes | Cookie session termination |
| `/api/bot/connect` | `POST` | **200 OK** | Yes | Bot token validation, AES encryption, DB upsert |
| `/api/bot/disconnect` | `POST` | **200 OK** | Yes | Mark bot session inactive |
| `/api/bot/status` | `GET` | **200 OK** | Yes | Current bot profile & connection state |
| `/api/bot/saved-token` | `GET` | **200 OK** | Yes | Check if user has encrypted token on file |
| `/api/bot/guilds` | `GET` | **200 OK** | Yes | List mutual Discord servers & member counts |
| `/api/send` | `POST` | **200 OK** | Yes | Launch broadcast queue job |
| `/api/send/test` | `POST` | **200 OK** | Yes | Send test DM to verifying operator |
| `/api/send/schedule` | `GET`, `POST`| **200 OK** | Yes | Create and list pending scheduled broadcasts |
| `/api/send/pause` | `POST` | **200 OK** | Yes | Pause delivery queue |
| `/api/send/resume` | `POST` | **200 OK** | Yes | Resume delivery queue |
| `/api/send/stop` | `POST` | **200 OK** | Yes | Terminate and abort active delivery |
| `/api/templates` | `GET`, `POST`| **200 OK** | Yes | List and save announcement templates |
| `/api/stats` | `GET` | **200 OK** | No | Global aggregated KPI metrics |
| `/api/logs` | `GET` | **200 OK** | Yes | Historical campaigns log data |
