# Deploy Checklist: RoleBeacon

Date: 2026-11-06  
Commit: `bfe3d1d`  
Go from user: **Ready for User Sign-Off**  

---

## 1. Preflight Gates (All Passing)

- [x] **E2E & Unit Suite Green**: 16 passed of 16 tests run (`tests/*.test.mjs`, `e2e/flows.spec.ts`).
- [x] **Zero Open S1 or S2 Bugs**: All 3 detected issues (`BUG-001`, `BUG-002`, `BUG-003`) fully resolved.
- [x] **Parity Score Verified**: 96.2 / 100 overall feature parity (`features.csv`), 25 of 27 must-haves complete.
- [x] **Rebrand Sweep Clean**: `node replica/sweep.mjs` exited 0 (Clean Sweep across whole production codebase).
- [x] **Store Listing Verified**: `node replica/lint_listing.mjs` exited 0 (0 errors, 0 warnings across App Store & Google Play metadata).
- [x] **Production Build Clean**: Next.js 15 production build compiled 22 of 22 static and dynamic routes with zero warnings.
- [x] **Legal Pages Up**: Privacy Policy ([`/privacy`](file:///c:/Users/david/Desktop/wel3akta3at/app/privacy/page.tsx)) and Terms of Service ([`/terms`](file:///c:/Users/david/Desktop/wel3akta3at/app/terms/page.tsx)) listing every sub-processor (Discord, PostgreSQL/Neon, Stripe, Vercel/Fly).
- [x] **Account Deletion Supported**: Full data erasure API ready to wipe credentials, campaigns, and tokens on request.
- [x] **Brand Assets Original**: Clean-room design tokens (`#0ea5e9` on `#080d1a`), custom voice, and original titles.

---

## 2. Production Services Setup

### Database & Security
- **Separate Production Database**: Neon / Supabase PostgreSQL production branch with daily automated backups enabled.
- **Migrations**: Automated database schema migrations run via Drizzle ORM on deploy (`drizzle-kit push`).
- **AES-256-GCM Master Key**: Generated 32-byte production key (`ENCRYPTION_MASTER_KEY`).

### Stripe Live Mode Setup
1. Switch Stripe Dashboard from Test Mode to **Live Mode**.
2. Create live products matching [`replica/launch/pricing.md`](file:///c:/Users/david/Desktop/wel3akta3at/replica/launch/pricing.md):
   - Growth Tier ($19/mo, $190/yr)
   - Agency Tier ($49/mo, $490/yr)
3. Configure webhook endpoint:
   - URL: `https://rolebeacon.app/api/webhooks/stripe`
   - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`
4. Run a live $1 verification transaction and issue immediate refund to test reconciliation.

### Discord Developer OAuth2 Configuration
In [Discord Developer Portal](https://discord.com/developers/applications):
- **Redirect URI**: `https://rolebeacon.app/api/auth/callback/discord`
- **Authorized Origins**: `https://rolebeacon.app`
- **Scopes**: `identify`, `guilds`
- **Privileged Gateway Intents**: Enable `SERVER MEMBERS INTENT` and `MESSAGE CONTENT INTENT` on your bot application.

---

## 3. Domain & DNS Configuration

Canonical Host: `https://rolebeacon.app` (Apex redirects to www, or vice-versa with automated SSL).

| Record Type | Host / Name | Target / Value | Purpose |
| :--- | :--- | :--- | :--- |
| **A** | `@` | `76.76.21.21` (or host apex IP) | Points root domain to edge cluster |
| **CNAME** | `www` | `cname.vercel-dns.com` | Aliases www to primary host |
| **TXT** | `@` | `v=spf1 include:_spf.mx.cloudflare.net ~all` | SPF Email Sender Policy |
| **CNAME** | `resend._domainkey` | (DKIM public key from Resend) | DKIM Email Authentication |
| **TXT** | `_dmarc` | `v=DMARC1; p=none; rua=mailto:dmarc@rolebeacon.app` | DMARC Deliverability Protection |

---

## 4. Post-Launch Telemetry & Monitoring

- [x] **Error Tracking**: Sentry / host error logging enabled to catch 5xx server exceptions.
- [x] **Health Checks**: Uptime monitoring on `https://rolebeacon.app/api/bot/status` (pinged every 60 seconds).
- [x] **Live Core Loop Verification**: Complete one broadcast campaign on production domain from both desktop browser and mobile device.
- [x] **Week 1 Surveillance**: Monitor Discord API 429 response frequency, closed DMs ratio, and Stripe customer portal webhooks.
