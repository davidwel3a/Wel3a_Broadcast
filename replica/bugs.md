# Bug Tracking & Resolution Log: PodcastBot Replica

All issues identified during `/replica-build`, `/replica-design`, and `/replica-backend` testing loops.

---

### BUG-001: Webpack bundle failure on native optional dependencies in `discord.js`

- **Severity**: S2 (Feature blocked: Server API build failing)
- **Flow / case**: Backend Build
- **Screen**: All `/api/bot/*` endpoints
- **Build**: Initial backend wiring
- **Browser / device**: Node.js v22 Next.js 15 build

**Steps to Reproduce:**
1. Import `discord.js` in Next.js App Router route handlers.
2. Run `npx next build`.

- **Expected**: Next.js builds server functions cleanly.
- **Actual**: Build threw `Module not found: Can't resolve 'zlib-sync'`.
- **Evidence**: Next.js webpack build trace log.
- **Root Cause**: Next.js bundled `discord.js` into client-side/edge webpack context instead of treating it as an external Node.js package.
- **Status**: **Fixed** in commit `42708e2` by configuring `serverExternalPackages: ['discord.js', '@discordjs/ws', '@discordjs/rest']` in `next.config.mjs`.

---

### BUG-002: Button on-accent text contrast falling below WCAG AA 4.5:1 floor

- **Severity**: S3 (Accessibility compliance violation)
- **Flow / case**: F02 / Design Tokens
- **Screen**: S04, S07
- **Build**: Initial palette extraction
- **Browser / device**: Contrast checker script

**Steps to Reproduce:**
1. Measure `#8b5cf6` with `#ffffff` text in `replica/design/tokens.json`.
2. Run WCAG 2.2 contrast formula.

- **Expected**: Minimum 4.5:1 contrast for normal body text.
- **Actual**: Measured 4.23:1 (failing AA threshold).
- **Evidence**: `test_contrast.js` output.
- **Root Cause**: The raw production purple was slightly too bright for pure white body text.
- **Status**: **Fixed** in commit `d27595a` by tuning the semantic `accent` token to `#7c3aed` (5.70:1 AA pass).

---

### BUG-003: TypeScript 7 dummy package incompatibility with Next.js 15 typechecker

- **Severity**: S2 (Build failing)
- **Flow / case**: S01-S11 Next.js build
- **Screen**: All
- **Build**: Initial shell
- **Browser / device**: Node.js v22

**Steps to Reproduce:**
1. Install TypeScript via generic npm install.
2. Next.js typecheck failed with `"id" argument must be of type string`.

- **Expected**: Typecheck completes cleanly.
- **Actual**: Build halted during typecheck.
- **Evidence**: `task-254.log`
- **Root Cause**: Dummy `typescript: 7.0.2` package pulled by npm instead of genuine TypeScript 5.7.
- **Status**: **Fixed** in commit `d27595a` by pinning `typescript@^5.7.2`.

---

### Open Bugs Summary
- **S1 (Blockers)**: 0 open
- **S2 (Broken features)**: 0 open
- **S3 (Workarounds/Visual)**: 0 open
- **S4 (Cosmetic)**: 0 open
- **Status**: **100% Green - Ready for Parity Diffing.**
