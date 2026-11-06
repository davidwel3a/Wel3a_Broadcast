# Test Plan: PodcastBot Replica

Build: `42708e2`  Date: 2026-11-06  Env: Local Node.js / Next.js production build

| case | flow | type | steps | expected | auto | result |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **F01-H1** | Connect Bot | Happy | Enter valid token, click Connect | Bot status shows connected badge with avatar and username | unit/e2e | **PASS** |
| **F01-E1** | Connect Bot | Edge: empty token | Click connect with blank input | Toast warning asks for token, no API dispatch | unit/e2e | **PASS** |
| **F01-N1** | Connect Bot | Negative: invalid token | Enter malformed token | Error toast shown, remains disconnected | unit | **PASS** |
| **F02-H1** | Compose & Preview | Happy | Draft title, description, color, click Preview | Modal opens with Discord DM bubble simulation | e2e | **PASS** |
| **F02-E1** | Compose & Preview | Edge: character limit | Type >2000 chars text or >256 title | Zod validation rejects and char counter warns | unit | **PASS** |
| **F02-E2** | Compose & Preview | Edge: invalid hex color | Enter non-hex color string | Regex check fails, falls back to default accent | unit | **PASS** |
| **F03-H1** | Templates | Happy | Click "Save as template", enter name, confirm | Template added to drawer and available for 1-click use | unit/e2e | **PASS** |
| **F03-H2** | Templates | Happy: apply | Click "Use" on saved template | Message composer fields populate immediately | unit/e2e | **PASS** |
| **F03-E1** | Templates | Edge: delete template | Click trash icon on template | Template removed optimistically | unit | **PASS** |
| **F04-H1** | Audience Filter | Happy: specific roles | Select 1 or more role chips | Recipient counter dynamically sums member counts | unit/e2e | **PASS** |
| **F04-H2** | Audience Filter | Happy: send to all | Toggle "Send to all" checkbox | Recipient count equals total server member count | unit/e2e | **PASS** |
| **F04-E1** | Audience Filter | Edge: closed DMs | Dispatch to member with disabled DMs | Categorized into `fail_reasons.dm_closed`, queue continues | unit | **PASS** |
| **F05-H1** | Scheduled Broadcast | Happy | Toggle schedule, select preset (6h), launch | Added to scheduled campaigns queue table with date | unit/e2e | **PASS** |
| **F05-E1** | Scheduled Broadcast | Edge: cancel schedule | Click delete in scheduled table | Removed from queue, no delivery occurs | unit | **PASS** |
| **F06-H1** | Queue Controls | Happy: pause/resume | Click Pause mid-broadcast, then Resume | Progress halts and restarts cleanly | unit | **PASS** |
| **F06-N1** | Queue Controls | Negative: Discord 403 ban | Encounter Discord 403 during delivery | Tripwire aborts queue immediately, alarm siren fires | unit/e2e | **PASS** |

### Test Summary
- **Total Test Cases**: 16
- **Passed**: 16
- **Failed**: 0
- **Automated**: 100% covered via `tests/*.test.mjs` and `e2e/flows.spec.ts`.
