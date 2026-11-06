import React from 'react';
import Link from 'next/link';
import { FileText, ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-bg text-text p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-text-muted hover:text-accent transition-colors">
          <ArrowLeft size={16} />
          Back to Wel3a_Broadcast
        </Link>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-accent/20 border border-accent flex items-center justify-center text-accent">
          <FileText size={22} />
        </div>
        <h1 className="text-3xl font-extrabold text-white">Terms of Service</h1>
      </div>

      <p className="text-xs text-text-muted mb-8">Effective Date: November 6, 2026</p>

      <div className="space-y-6 text-sm text-text-muted leading-relaxed">
        <section className="card-glass p-6">
          <h2 className="text-base font-bold text-white mb-2">1. Acceptable Use Policy</h2>
          <p>
            Wel3a_Broadcast is intended strictly for legitimate community announcements, merchant updates, and permissioned member communications. You agree never to use Wel3a_Broadcast for unsolicited commercial spam, phishing, harassment, or in violation of Discord&apos;s Developer Terms of Service.
          </p>
        </section>

        <section className="card-glass p-6">
          <h2 className="text-base font-bold text-white mb-2">2. Bot Credentials & Gateway Limits</h2>
          <p>
            You are responsible for maintaining the security of your Discord bot tokens and configuring appropriate Privileged Gateway Intents. Wel3a_Broadcast automatically enforces throttling to comply with Discord rate limits; attempts to circumvent these safety mechanisms are strictly prohibited.
          </p>
        </section>

        <section className="card-glass p-6">
          <h2 className="text-base font-bold text-white mb-2">3. Subscription Billing & Cancellation</h2>
          <p>
            Paid subscriptions renew automatically on a monthly or annual basis. You may cancel your subscription at any time with one click through the Stripe Customer Portal in your dashboard. Unreachable DMs (e.g. users with closed privacy settings) do not consume monthly quota allowances.
          </p>
        </section>

        <section className="card-glass p-6">
          <h2 className="text-base font-bold text-white mb-2">4. Limitation of Liability</h2>
          <p>
            Wel3a_Broadcast is provided &ldquo;as is&rdquo; without warranties of any kind. While our platform implements proactive anti-ban tripwires and rate-limiting throttles, we are not responsible for actions taken by Discord against third-party bot applications or developer accounts.
          </p>
        </section>
      </div>
    </div>
  );
}
