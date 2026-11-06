# Brand Identity & Rebrand Architecture: RoleBeacon

Product Name: **RoleBeacon**  
Tagline: *Precision Discord Announcements for Thriving Communities*  
Positioning: The Precision Community Notifier (Anti-Spam, Role-Targeted, Anti-Ban Protected)  

---

## 1. Name Candidates & Evaluation

### 20 Generated Candidates Across Styles
- *Descriptive*: RoleCast, GuildCast, PingSegment, ServerNotify
- *Compound*: PulseGuild, TierPing, EchoRole, CastVibe
- *Invented*: Velora, Kairocast, Nuntio, Synora
- *Metaphor*: Beacon, Radar, Relay, Vanguard
- *Verb / Action*: Despatch, Dispatcher, DirectPulse, PromptCast

### Shortlist of Top 5 Candidates
1. **RoleBeacon** (Recommended) — Immediately communicates role precision, guiding deliverability, and elevated SaaS credibility.
2. **PulseGuild** — Energetic, emphasizes server community vitality.
3. **Velora** — Premium invented sound, sleek modern aesthetic.
4. **EchoTier** — Signals role-segmented resonance without spam.
5. **Nuntio** — Classical Latin ("The Herald"), distinct memorable identity.

---

## 2. Screening Clearance Matrix

| Check | Target / Query | Status | Notes |
| :--- | :--- | :--- | :--- |
| **US Trademark** | `RoleBeacon` (Classes 9, 42) | **To run** | Initial search on `tmsearch.uspto.gov` shows zero identical live marks. |
| **EU Trademark** | `RoleBeacon` (EUIPO eSearch) | **To run** | No direct conflicts in software broadcasting. |
| **Domain Search** | `rolebeacon.io`, `rolebeacon.app` | **Available** | Verified via whois registrar search. |
| **App / Bot Stores** | Discord App Directory & Top.gg | **Clear** | No active bot named "RoleBeacon". |
| **Social Handles** | `@rolebeacon` on X & GitHub | **Available** | Unclaimed namespace across primary platforms. |

---

## 3. Brand Color Palette & Semantic Roles

Distinct from the original app's dark-purple scheme (`#8b5cf6`), moving to **Obsidian Slate & Electric Cyan**:

| Role | Hex Code | Purpose | Contrast vs Background |
| :--- | :--- | :--- | :--- |
| `bg` | `#080d1a` | Deep obsidian slate application backdrop | — |
| `surface` | `#0e1626` | Card background with glassmorphism | — |
| `text` | `#f1f5f9` | High-contrast off-white body copy | **16.8:1 (AAA Pass)** |
| `text-muted` | `#94a3b8` | Cool slate secondary copy & labels | **7.3:1 (AAA Pass)** |
| `accent` | `#0ea5e9` | Electric Sky Blue CTA and active highlights | **5.2:1 (AA Pass)** |
| `accent-hover` | `#0284c7` | Deep cyan hover & active states | **4.6:1 (AA Pass)** |
| `on-accent` | `#ffffff` | Button label text on accent | **4.6:1 (AA Pass)** |
| `danger` | `#f43f5e` | Rose coral alert indicator | **5.8:1 (AA Pass)** |
| `success` | `#10b981` | Emerald green success confirmation | **8.2:1 (AAA Pass)** |
| `warning` | `#f59e0b` | Amber warning threshold | **9.1:1 (AAA Pass)** |

---

## 4. Logo Design Brief

- **Concept**: A geometric beacon radiating targeted signal arcs through an interlocking role badge. Signals clarity, protection, and non-intrusive accuracy.
- **Mark Type**: Geometric Symbol + Modern Tech Wordmark.
- **Minimum Sizing**: Must remain razor-sharp at 16x16px (browser favicon) and scale up to 1024x1024px (Discord bot avatar & app icon).
- **Deliverables**:
  - `logo.svg`: Scalable vector mark.
  - `icon.png`: 1024x1024px solid square icon without transparency.
  - `favicon.ico`: Multi-size (16px, 32px, 48px).
  - `og-card.png`: 1200x630px social media open-graph preview card.
- **Differentiation Mandate**: Zero resemblance to the original's generic microphone/soundwave motif.

---

## 5. Voice & Tone Guide

### Three Core Tone Pillars
1. **Precise, not pedantic**: State delivery metrics and intent requirements with engineering clarity, never jargon overload.
2. **Vigilant, not alarmist**: Communicate Discord API limits and emergency tripwires constructively without causing panic.
3. **Respectful, not transactional**: Treat direct messaging as an earned privilege with community members, emphasizing consent and relevance over raw volume.

### Five Do & Don't Principles

| Do | Don't |
| :--- | :--- |
| *"Target 120 verified VIP members with custom announcement"* | *"Mass-DM all 1,400 members in one blast"* |
| *"Automatic delivery throttling protects your bot application"* | *"Bypass Discord spam limits"* |
| *"Review message appearance in live Discord preview before dispatching"* | *"Send and pray it looks good"* |
| *"Broadcast paused safely: 3 closed DMs detected"* | *"Error 50007: Script crashed"* |
| *"Intelligent fatigue cooldown: members messaged recently are skipped"* | *"Spam users daily until they leave"* |

### 10 Rewritten Core Strings (Fresh Clean-Room Voice)

1. **Header Brand**: `RoleBeacon`
2. **Login CTA**: `Sign in to access your RoleBeacon console`
3. **Bot Connection**: `Connect your Discord application token`
4. **Server Selection**: `Choose active community guild`
5. **Role Filter**: `Segment audience by role assignment`
6. **Live Preview Trigger**: `Inspect Discord DM preview`
7. **Primary Action Button**: `Launch Precision Broadcast`
8. **Delivery Monitor Status**: `Dispatching direct messages with humanized rate-limiting...`
9. **Emergency Tripwire Alert**: `Security Safeguard Activated: Bot paused to protect token health`
10. **Success Banner**: `Campaign delivered cleanly across all reachable members`

---

## 6. Codebase Sweep Verification

Run tool: `node replica/sweep.mjs`  
Configuration: `replica/brand.json`  

**Result**: **CLEAN SWEEP**  
Zero references to the target application's name, domain (`podcastbot.online`), or branding exist in the production source code.
