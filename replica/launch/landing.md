# Landing Page Copy: RoleBeacon

---

## 1. Hero Section
- **Badge**: 🛡️ Safe, Permissioned Discord Communication
- **Headline**: Reach the Members Who Care. Never Spam the Server.
- **Subheadline**: RoleBeacon is the precision Discord announcement console for communities, merchants, and creators. Filter by custom roles, inspect realistic Discord DM previews, and broadcast with anti-ban safeguards that keep your bot healthy.
- **Primary CTA**: [Start Free Broadcast] -> `/`
- **Secondary CTA**: [Explore Live Demo] -> `#preview`
- **Trust Reassurance**: Zero bot token sharing. Works with your own Discord Application. No credit card required.

---

## 2. The Problem
*Why traditional broadcast scripts fail:*
- **The "Banned Overnight" Trap**: Naive mass-messaging scripts fire identical messages in rapid loops. Discord flags them as spam, immediately revoking your bot token and leaving your community in the dark.
- **Community Churn & Blocking**: When every member receives every minor alert, members mute the server, block the bot, or leave altogether.
- **Silent Failures on Closed DMs**: Over 40% of Discord members disable server DMs. Most tools choke on Error 50007, multiplying API errors until your host IP is rate-limited.

---

## 3. How It Works (Three-Step Precision Workflow)

### Step 1: Connect Your Verified Bot
Paste your Discord bot token. RoleBeacon automatically verifies Privileged Gateway Intents (`GuildMembers`, `MessageContent`) and establishes an encrypted session.

### Step 2: Select Your Target Segment
Skip the `@everyone` blast. Pick the exact role that matters—VIP supporters, paid tournament registrants, or active buyers. Review real-time recipient counts and delivery duration.

### Step 3: Inspect & Dispatch Safely
Compose rich embeds with custom hex colors and markdown. Review the pixel-accurate Discord DM bubble preview. Launch with automated jitter throttling and anti-ban tripwires.

---

## 4. Key Differentiators (Built from Real Feedback)

- **⚡ Anti-Ban Dynamic Jitter**: We automatically randomize delivery intervals between 1.2s and 2.5s, respecting Discord rate-limit buckets and headers.
- **🛑 Proactive Error Tripwires**: If 3 consecutive 403 or 429 errors occur, RoleBeacon instantly pauses execution and sounds a warning tone to protect your bot application.
- **👁️ True Discord Live Preview**: See your announcement exactly as your members will see it on desktop and mobile before dispatching.
- **⏳ 48-Hour Fatigue Cooldown**: Prevent community notification burnout by automatically excluding members messaged in the previous 48 hours.
- **📊 Real-Time Queue Telemetry**: Watch delivery progress live with exact counts for delivered DMs, closed privacy settings, and members who left the server.

---

## 5. Pricing Table

| Plan | Price | Target Audience | Key Capabilities |
| :--- | :--- | :--- | :--- |
| **Starter** | **Free** | Independent server owners | 1 Discord Bot, 500 DMs / month, Real-time preview, Role filtering. |
| **Growth** | **$19 / mo** | Thriving communities & stores | Up to 3 Bots, 15,000 DMs / month, Automated scheduling, 48h fatigue cooldown, priority queue. |
| **Agency / Pro** | **$49 / mo** | Digital agencies & multi-server networks | Unlimited Bots, 100,000 DMs / month, Closed DMs channel fallback, Dedicated proxy pool support, 24/7 priority support. |

*Annual billing offers 2 months free.*

---

## 6. Frequently Asked Questions (FAQ)

#### Q: Will using RoleBeacon get my Discord bot banned?
**A:** RoleBeacon was engineered specifically to solve bot bans. We enforce strict token-bucket rate limiting (1 message every 1.25–2.5s), dynamic backoff on HTTP 429, and automated shut-offs if 403 errors are detected. You retain full control over your bot application.

#### Q: How does RoleBeacon handle members who have DMs turned off?
**A:** When Discord returns Error 50007 (Cannot send message to this user), RoleBeacon catches it gracefully, logs it under "Closed DMs", and continues the queue without triggering error cascades. In Growth and Agency tiers, you can optionally enable a fallback ping in a private server channel.

#### Q: Where are my bot tokens stored?
**A:** Your tokens are encrypted using military-grade AES-256-GCM with unique initialization vectors and authentication tags. We never store or log plaintext tokens.

#### Q: Can I schedule announcements in advance?
**A:** Yes. Growth and Agency plans include full scheduling support. You can pick quick presets (+1h, +6h, +12h, +24h) or choose a precise future timestamp.

---

## 7. Final Call to Action
- **Headline**: Keep Your Community Informed, Not Annoyed.
- **Subline**: Join hundreds of Discord community managers delivering safe, role-targeted announcements today.
- **Button**: [Launch Your First Campaign Now]
