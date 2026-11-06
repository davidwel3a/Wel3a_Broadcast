import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-bg text-text p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-text-muted hover:text-accent transition-colors">
          <ArrowLeft size={16} />
          Back to RoleBeacon
        </Link>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-accent/20 border border-accent flex items-center justify-center text-accent">
          <ShieldCheck size={22} />
        </div>
        <h1 className="text-3xl font-extrabold text-white">Privacy Policy</h1>
      </div>

      <p className="text-xs text-text-muted mb-8">Effective Date: November 6, 2026</p>

      <div className="space-y-6 text-sm text-text-muted leading-relaxed">
        <section className="card-glass p-6">
          <h2 className="text-base font-bold text-white mb-2">1. Overview & Commitment</h2>
          <p>
            RoleBeacon (&ldquo;we&rdquo;, &ldquo;us&rdquo;) respects your privacy and is engineered to deliver role-targeted Discord communications without unnecessary data collection. We never sell, rent, or trade your personal data or community information.
          </p>
        </section>

        <section className="card-glass p-6">
          <h2 className="text-base font-bold text-white mb-2">2. Data We Process</h2>
          <ul className="list-disc pl-5 space-y-1.5 mt-2">
            <li><strong>Operator Profile:</strong> Discord ID, username, and avatar URL provided via Discord OAuth2 to authenticate your console session.</li>
            <li><strong>Bot Credentials:</strong> Application tokens provided by you are encrypted using AES-256-GCM. We never log or store unencrypted tokens.</li>
            <li><strong>Delivery Audit Logs:</strong> Recipient Discord IDs, delivery timestamps, and error classifications (e.g. Closed DMs) to provide delivery analytics and prevent duplicate sends.</li>
          </ul>
        </section>

        <section className="card-glass p-6">
          <h2 className="text-base font-bold text-white mb-2">3. Third-Party Sub-Processors</h2>
          <p className="mb-3">To operate our platform securely, we utilize the following verified service providers:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-surface rounded-lg border border-border">
              <strong className="text-white block mb-0.5">Discord API Inc.</strong>
              <span>Gateway communication and OAuth2 identity authentication.</span>
            </div>
            <div className="p-3 bg-surface rounded-lg border border-border">
              <strong className="text-white block mb-0.5">PostgreSQL (Neon / Supabase)</strong>
              <span>Managed database storage with Row-Level Security and encryption at rest.</span>
            </div>
            <div className="p-3 bg-surface rounded-lg border border-border">
              <strong className="text-white block mb-0.5">Stripe Inc.</strong>
              <span>PCI-compliant subscription payment processing and customer billing portal.</span>
            </div>
            <div className="p-3 bg-surface rounded-lg border border-border">
              <strong className="text-white block mb-0.5">Vercel / Fly.io</strong>
              <span>Production application hosting, edge SSL termination, and container execution.</span>
            </div>
          </div>
        </section>

        <section className="card-glass p-6">
          <h2 className="text-base font-bold text-white mb-2">4. Complete Account & Data Deletion</h2>
          <p>
            You may request complete deletion of your account, encrypted credentials, message templates, and campaign history at any time directly through your dashboard settings or by contacting <code className="text-accent">privacy@rolebeacon.app</code>. Deletion removes all data from active databases within 24 hours.
          </p>
        </section>
      </div>
    </div>
  );
}
