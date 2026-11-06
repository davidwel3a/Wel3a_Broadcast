# Component Specifications: PodcastBot Design System

Specs for every component from `replica/recon.md`. Uses semantic tokens (`replica/design/tokens.json`) and WCAG-checked color pairs.

---

### Button
- **Variants**: `primary` (gradient accent), `ghost` (transparent + border), `danger` (red gradient), `success` (green gradient), `discord` (Discord Blurple gradient).
- **Sizes**: `sm` (height 32px, text-xs), `md` (height 40px, text-sm), `lg` (height 48px, text-base), `block` (width 100%).
- **States**: `default`, `hover` (elevated + slight brightness filter), `active` (scale 0.98), `focus-visible` (2px solid ring, `accent`), `disabled` (opacity 0.5, cursor not-allowed), `loading` (spinner icon, label retained for a11y).
- **Tokens**: `bg` accent | discord | danger, `text` on-accent, `radius` md, `font` sm/600, `transition` fast.
- **A11y**: Standard `<button>` element with `type="button|submit"`, `aria-busy` during loading, keyboard Enter/Space triggers.
- **Used on**: S01, S02, S04, S05, S06, S07, S08, S09, S11.

---

### Input & Textarea
- **Variants**: `text`, `password` (with eye toggle button), `number`, `textarea` (multiline, auto-resize), `select` (custom dropdown).
- **States**: `default` (border `border-input`), `hover` (border `accent`), `focus` (border `accent` + glow shadow), `disabled` (opacity 0.5), `invalid` (border `danger`).
- **Tokens**: `bg` surface, `border` border-input, `text` text, `placeholder` text-muted, `radius` md, `font` sm/400.
- **A11y**: Label association via `id` and `htmlFor`, `aria-invalid` on validation failure, `aria-describedby` pointing to error hint.
- **Used on**: S02, S03, S04, S06, S07.

---

### RoleChip
- **Purpose**: Interactive role selector chip with server role color dot and member counter.
- **Variants**: Default role pill.
- **States**: `unselected` (bg `surface`, subtle border), `hover` (border opacity increases), `selected` (bg with 15% role color tint, solid colored border, checkmark icon).
- **Tokens**: `radius` pill, `text` text, `font` xs/500, `gap` 6px, `padding` 6px 14px.
- **A11y**: `role="checkbox"`, `aria-checked="true|false"`, keyboard Space toggle.
- **Used on**: S03 (Settings & Audience filter).

---

### TabButton
- **Purpose**: Switch message editor mode (Plain Text, Rich Embed, Image Attachment).
- **Variants**: Inline horizontal tab strip.
- **States**: `idle` (text `text-muted`), `hover` (text `text`), `active` (text `text`, border-bottom 2px solid `accent`, subtle background glow).
- **Tokens**: `font` sm/600, `padding` 10px 16px, `transition` fast.
- **A11y**: `role="tab"`, `aria-selected="true|false"`, `aria-controls="tab-content-panel"`.
- **Used on**: S04 (Broadcast Composer).

---

### CharCounter
- **Purpose**: Real-time feedback for Discord character limitations (2000 for text, 256 for embed title, 4096 for embed description).
- **States**: `normal` (text `text-muted`), `warning` (>85% limit, text `warning`), `danger` (100% reached, text `danger`).
- **Tokens**: `font` xs/mono, `text` text-muted | warning | danger.
- **A11y**: `aria-live="polite"` announces remaining characters near threshold.
- **Used on**: S04 (Broadcast Composer).

---

### DiscordMessagePreview
- **Purpose**: Pixel-perfect preview card matching official Discord dark theme DM interface.
- **Structure**:
  - `Header`: Bot Avatar (round 40px), Bot Username (bold text), `BOT` badge (blurple tag), Timestamp ("Today at 12:00 PM").
  - `Body`: Markdown text content with line breaks.
  - `Embed Card`: Left border (4px solid custom hex color), Title (bold 16px), Description (14px regular), Optional Embed Image (max-width 400px, radius 8px).
  - `Image Attachment`: Standalone full image preview (radius 8px).
- **Tokens**: `bg` #313338 (Discord chat background), `radius` md, `font` sans.
- **Used on**: S05 (Live Preview Modal).

---

### ProgressBar & Queue Telemetry
- **Purpose**: Live visualization of broadcast execution with current target member.
- **Components**:
  - Track: Height 8px, background `surface`, border-radius pill.
  - Fill: Linear gradient (`accent` to `blue`), width 0% to 100% with smooth CSS transition.
  - Percentage & Status: Text `sm` displaying `XX%` and action verb ("Sending private messages...", "Paused").
  - Current Target Badge: Chip showing animated radar icon + `@username` currently being messaged.
  - Failure Breakdown: 3 pill chips (Closed DMs, Left Server, Unknown errors).
- **A11y**: `role="progressbar"`, `aria-valuenow="XX"`, `aria-valuemin="0"`, `aria-valuemax="100"`.
- **Used on**: S08 (Real-Time Delivery Monitor).

---

### StatCard
- **Purpose**: Display aggregate metrics (Total Sent, Total Failed, Success Rate, Active Campaigns).
- **Variants**: `purple` (accent glow), `green` (success), `red` (danger), `yellow` (warning).
- **Structure**: Icon badge, Large metric number (`text-xl` or `text-display`), Secondary label (`text-xs` `text-muted`).
- **Tokens**: `bg` surface, `border` border, `radius` lg, `shadow` card.
- **Used on**: S08, S10.

---

### DataTable
- **Purpose**: Display historical campaigns and pending scheduled queues.
- **Structure**: Column headers (sticky), zebra / hover rows, badge indicators for status (Pending, Completed, Failed).
- **States**: `loading` (animated skeleton pulse), `empty` (empty state illustration with clear copy), `populated`.
- **Tokens**: `font` sm, `border` border, `text` text, `text-muted` for timestamps.
- **Used on**: S10 (Historical Logs), S11 (Scheduled Campaigns).

---

### EmergencyBanModal
- **Purpose**: Critical safety interceptor fired when Discord bans or rate-limits a token.
- **Structure**:
  - Backdrop: Black 85% opacity with 8px CSS backdrop blur.
  - Box: 520px max width, border 2px solid `danger`, danger red glow shadow (`0 0 40px rgba(239, 68, 68, 0.45)`).
  - Header: Pulsing ban icon in red circle, bold title (`text-lg` `danger`).
  - Explanation: Clear diagnostic message instructing token removal / replacement.
  - Summary: Metrics snapshot (Sent vs Failed at moment of shutdown).
  - CTA: Acknowledge & close button.
- **A11y**: `role="alertdialog"`, `aria-modal="true"`, auto-focus acknowledge button, trap focus.
- **Audio**: Web Audio API oscillator synthesized dual-tone siren.
- **Used on**: S09.
