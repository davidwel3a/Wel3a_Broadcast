# Pricing Architecture & Competitive Benchmark: RoleBeacon

Date: 2026-11-06  

---

## 1. Competitive Pricing Benchmark

| Platform | Model / Price | Stated Limits | Source URL | Date Checked |
| :--- | :--- | :--- | :--- | :--- |
| **PodcastBot / Mass DM Bot** | Free basic / $10–$25 one-time per server | No rate limit safeguards, manual execution | `https://podcastbot.online/` | 2026-11-06 |
| **Dyno Bot (Premium)** | $5.99 / mo per server | Basic announcements, no DM role segmentation | `https://dyno.gg/upgrade` | 2026-11-06 |
| **Carl-bot (Premium)** | $5.00 / mo per server | Basic feed embeds, no individual DM broadcasts | `https://carl.gg/` | 2026-11-06 |
| **Custom DM Scripts (Fiverr/GitHub)** | $30–$80 one-time code | Unmaintained scripts that get tokens banned quickly | Various public repos | 2026-11-06 |

---

## 2. Reviewer Feedback on Pricing & Billing

From community feedback (`replica/feedback.md`):
- **Hidden Fees & Rigid Paywalls**: Users hate paying per server when managing multiple communities.
- **Complex Cancellation Traps**: Difficult cancellation flows are the #1 source of chargebacks and negative reviews for bot subscription platforms.
- **Wasted Credits on Dead Accounts**: Broadcasters that count closed DMs or banned members toward monthly usage quotas cause user resentment.

### Our Billing Guarantees
1. **One-Click Cancel**: Cancel anytime directly through the Stripe Customer Portal with a single button.
2. **Quota Fairness**: Members whose DMs are closed (`Error 50007`) or who left the server **do not consume your paid monthly broadcast allowance**.
3. **Transparent Billing Alerts**: Automated email notice sent 3 days before any annual renewal.

---

## 3. Subscription Tiers

### Tier 1: Starter (Free Forever)
- **Target**: Small community leaders and indie project creators.
- **Price**: **$0 / month**
- **Quota**: Up to 500 delivered DMs / month.
- **Features**:
  - 1 Active Discord Bot connection
  - Role-filtered audience selection
  - True Discord dark mode live preview
  - Manual execution with safety throttle

### Tier 2: Growth (Most Popular)
- **Target**: Commercial servers, esports communities, and digital stores.
- **Price**: **$19 / month** (or **$190 / year** — 2 months free)
- **Quota**: Up to 15,000 delivered DMs / month.
- **Features**:
  - Up to 3 Active Discord Bots
  - Automated scheduling with time zone calculation
  - 48-Hour Member Fatigue Cooldown guard
  - Unlimited saved message templates
  - Priority delivery queue

### Tier 3: Agency & Pro Network
- **Target**: Discord marketing agencies, multi-server networks, and SaaS businesses.
- **Price**: **$49 / month** (or **$490 / year** — 2 months free)
- **Quota**: Up to 100,000 delivered DMs / month.
- **Features**:
  - Unlimited Discord Bot connections
  - Closed DMs channel fallback ping mode
  - Dedicated residential proxy rotation support
  - Team member seats with audit logs
  - 24/7 Priority Discord & Email support

---

## 4. Stripe Product Setup Specs

For deployment in Stripe Dashboard (Test Mode first):

1. **`prod_rolebeacon_growth`**:
   - Monthly: `$19.00 USD / month` (`price_growth_monthly`)
   - Annual: `$190.00 USD / year` (`price_growth_annual`)
2. **`prod_rolebeacon_agency`**:
   - Monthly: `$49.00 USD / month` (`price_agency_monthly`)
   - Annual: `$490.00 USD / year` (`price_agency_annual`)
