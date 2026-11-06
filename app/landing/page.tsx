'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Send,
  Users,
  Eye,
  Clock,
  Ban,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function LandingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const faqs = [
    {
      q: 'Will using RoleBeacon get my Discord bot banned?',
      a: 'No. RoleBeacon was engineered specifically to prevent bot bans. We enforce token-bucket throttling (1.2s to 2.5s jitter delay between dispatches), dynamic backoff on HTTP 429, and automatic shut-offs if 403 errors are detected.',
    },
    {
      q: 'How does RoleBeacon handle members who have closed DMs?',
      a: 'When Discord returns Error 50007 (Cannot send message to this user), RoleBeacon catches it gracefully, classifies it under "Closed DMs", and continues the queue without triggering error cascades.',
    },
    {
      q: 'Where are my bot tokens stored?',
      a: 'Your bot tokens are encrypted at rest using AES-256-GCM with unique initialization vectors and authentication tags. We never store or log plaintext tokens.',
    },
    {
      q: 'Can I schedule announcements in advance?',
      a: 'Yes. Growth and Agency plans include automated scheduling with quick hour presets (+1h, +6h, +12h, +24h) and local time zone conversion.',
    },
  ];

  return (
    <div className="min-h-screen bg-bg text-text selection:bg-accent/30 selection:text-white">
      {/* Header */}
      <header className="border-b border-border/80 bg-surface/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-accent to-blue-500 flex items-center justify-center text-white shadow-md">
              <ShieldCheck size={18} />
            </div>
            <span className="font-bold text-lg text-text tracking-tight">RoleBeacon</span>
          </div>

          <div className="flex items-center gap-3">
            <Link href="#pricing" className="text-xs font-semibold text-text-muted hover:text-text transition-colors hidden sm:inline-block">
              Pricing
            </Link>
            <Link href="#features" className="text-xs font-semibold text-text-muted hover:text-text transition-colors hidden sm:inline-block">
              Features
            </Link>
            <Link href="/">
              <Button variant="primary" size="sm">
                Open Console
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 text-center max-w-4xl mx-auto overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold mb-6">
          <Sparkles size={14} />
          <span>Precision Discord Announcements • Anti-Ban Protected</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.15] mb-6">
          Reach the Members Who Care. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-blue-400 to-emerald-400">
            Never Spam the Server.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-text-muted max-w-2xl mx-auto leading-relaxed mb-8">
          The precision announcement platform for Discord servers and digital stores. Segment by custom roles, inspect authentic Discord DM previews, and broadcast with anti-ban safeguards that keep your bot healthy.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-14">
          <Link href="/">
            <Button variant="primary" size="lg" icon={<Send size={18} />}>
              Start Free Broadcast
            </Button>
          </Link>
          <Link href="#how-it-works">
            <Button variant="ghost" size="lg">
              How It Works
            </Button>
          </Link>
        </div>

        {/* Dashboard Preview Graphic */}
        <div className="relative mx-auto rounded-2xl border border-white/10 bg-surface/80 p-2 shadow-2xl backdrop-blur-xl">
          <div className="rounded-xl bg-[#080d1a] border border-border/80 p-6 text-left">
            <div className="flex items-center justify-between border-b border-border/60 pb-4 mb-5">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <span className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="text-xs text-text-muted ml-2 font-mono">rolebeacon.app/console</span>
              </div>
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                ● Bot Connected & Active
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <div className="p-3 bg-surface/80 border border-border rounded-lg">
                <span className="text-[11px] text-text-muted">Target Segment</span>
                <p className="text-sm font-bold text-white mt-0.5">VIP Members (120)</p>
              </div>
              <div className="p-3 bg-surface/80 border border-border rounded-lg">
                <span className="text-[11px] text-text-muted">Throttle Engine</span>
                <p className="text-sm font-bold text-accent mt-0.5">1.25s Jitter / Safe</p>
              </div>
              <div className="p-3 bg-surface/80 border border-border rounded-lg">
                <span className="text-[11px] text-text-muted">Live Delivery Rate</span>
                <p className="text-sm font-bold text-emerald-400 mt-0.5">98.2% Delivered</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="py-16 bg-surface/40 border-y border-border/60">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Why Traditional Broadcast Tools Fail</h2>
            <p className="text-sm text-text-muted">Ordinary scripts treat Discord like email, causing disaster for server reputation.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card-glass p-6">
              <div className="w-10 h-10 rounded-lg bg-danger/10 border border-danger/20 flex items-center justify-center text-danger mb-4">
                <Ban size={20} />
              </div>
              <h3 className="font-bold text-base text-white mb-2">Banned Overnight</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Synchronous loops fire identical DMs rapidly. Discord detects the pattern instantly, revoking your bot application token.
              </p>
            </div>

            <div className="card-glass p-6">
              <div className="w-10 h-10 rounded-lg bg-warning/10 border border-warning/20 flex items-center justify-center text-warning mb-4">
                <Users size={20} />
              </div>
              <h3 className="font-bold text-base text-white mb-2">Community Fatigue</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Blasting everyone in the server causes members to leave, mute channels, or report your bot as spam.
              </p>
            </div>

            <div className="card-glass p-6">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
                <Clock size={20} />
              </div>
              <h3 className="font-bold text-base text-white mb-2">Silent Crash Cascades</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Closed DMs throw 403 Forbidden errors. Unhandled loops compound errors until Cloudflare bans the host IP.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 max-w-5xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Three Steps to Safe Delivery</h2>
          <p className="text-sm text-text-muted">Built for speed, accuracy, and zero Discord policy violations.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-accent/20 border border-accent flex items-center justify-center text-accent font-bold text-lg mb-4">
              1
            </div>
            <h4 className="font-bold text-base text-white mb-2">Connect Your Bot</h4>
            <p className="text-xs text-text-muted leading-relaxed">
              Authenticate via encrypted token. RoleBeacon automatically verifies Gateway intents and loads mutual servers.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500 flex items-center justify-center text-blue-400 font-bold text-lg mb-4">
              2
            </div>
            <h4 className="font-bold text-base text-white mb-2">Segment by Role</h4>
            <p className="text-xs text-text-muted leading-relaxed">
              Target exact roles (VIPs, buyers, attendees) with dynamic member counts and duration estimates.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-400 font-bold text-lg mb-4">
              3
            </div>
            <h4 className="font-bold text-base text-white mb-2">Preview & Dispatch</h4>
            <p className="text-xs text-text-muted leading-relaxed">
              Inspect your announcement in authentic Discord dark mode, then launch with jitter throttling and live telemetry.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-16 bg-surface/30 border-t border-border/60">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Engineered for Community Health</h2>
            <p className="text-sm text-text-muted">Features designed specifically to solve the headaches of server announcements.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="p-5 bg-surface/60 border border-border rounded-xl flex gap-3.5">
              <ShieldCheck size={22} className="text-accent flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-white mb-1">Anti-Ban Dynamic Jitter</h4>
                <p className="text-xs text-text-muted leading-relaxed">
                  Randomized 1.2s to 2.5s delay intervals mimic natural dispatch patterns and respect Discord API bucket ceilings.
                </p>
              </div>
            </div>

            <div className="p-5 bg-surface/60 border border-border rounded-xl flex gap-3.5">
              <Eye size={22} className="text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-white mb-1">Live Discord DM Preview</h4>
                <p className="text-xs text-text-muted leading-relaxed">
                  Realistic rendering of bot avatar, BOT tag, markdown body, colored embed card, and attached images.
                </p>
              </div>
            </div>

            <div className="p-5 bg-surface/60 border border-border rounded-xl flex gap-3.5">
              <Clock size={22} className="text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-white mb-1">48-Hour Fatigue Cooldown</h4>
                <p className="text-xs text-text-muted leading-relaxed">
                  Automatically suppress members who received a notification in the last 48 hours to protect engagement.
                </p>
              </div>
            </div>

            <div className="p-5 bg-surface/60 border border-border rounded-xl flex gap-3.5">
              <CheckCircle2 size={22} className="text-warning flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-white mb-1">Graceful Closed DM Handling</h4>
                <p className="text-xs text-text-muted leading-relaxed">
                  Catches Error 50007 silently and classifies failures without crashing your queue or consuming credits.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 max-w-5xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Simple, Transparent Pricing</h2>
          <p className="text-sm text-text-muted mb-6">No hidden charges. Unreachable DMs never consume your quota.</p>

          {/* Monthly / Annual Toggle */}
          <div className="inline-flex items-center gap-1.5 p-1 bg-surface border border-border rounded-lg text-xs font-semibold">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                billingCycle === 'monthly' ? 'bg-accent text-white' : 'text-text-muted hover:text-text'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                billingCycle === 'annual' ? 'bg-accent text-white' : 'text-text-muted hover:text-text'
              }`}
            >
              Annual (2 Months Free)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Starter */}
          <div className="card-glass p-6 flex flex-col">
            <h3 className="font-bold text-base text-white mb-1">Starter</h3>
            <p className="text-xs text-text-muted mb-4">For community leaders & testing.</p>
            <div className="text-3xl font-extrabold text-white mb-5">$0 <span className="text-xs font-normal text-text-muted">/ month</span></div>

            <ul className="text-xs text-text-muted space-y-2.5 mb-8 flex-1">
              <li className="flex items-center gap-2">✓ 1 Active Discord Bot</li>
              <li className="flex items-center gap-2">✓ 500 Delivered DMs / month</li>
              <li className="flex items-center gap-2">✓ Role-filtered targeting</li>
              <li className="flex items-center gap-2">✓ Live Discord DM preview</li>
              <li className="flex items-center gap-2">✓ Automated safety throttling</li>
            </ul>

            <Link href="/">
              <Button variant="ghost" fullWidth>
                Get Started Free
              </Button>
            </Link>
          </div>

          {/* Growth */}
          <div className="card-glass p-6 border-accent shadow-glow flex flex-col relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Most Popular
            </span>
            <h3 className="font-bold text-base text-white mb-1">Growth</h3>
            <p className="text-xs text-text-muted mb-4">For stores & active communities.</p>
            <div className="text-3xl font-extrabold text-white mb-5">
              {billingCycle === 'monthly' ? '$19' : '$15.80'} <span className="text-xs font-normal text-text-muted">/ month</span>
            </div>

            <ul className="text-xs text-text-muted space-y-2.5 mb-8 flex-1">
              <li className="flex items-center gap-2 text-white font-medium">✓ Up to 3 Discord Bots</li>
              <li className="flex items-center gap-2 text-white font-medium">✓ 15,000 Delivered DMs / month</li>
              <li className="flex items-center gap-2">✓ 48-Hour Fatigue Cooldown</li>
              <li className="flex items-center gap-2">✓ Automated campaign scheduling</li>
              <li className="flex items-center gap-2">✓ Priority queue delivery</li>
            </ul>

            <Link href="/">
              <Button variant="primary" fullWidth>
                Start Growth Plan
              </Button>
            </Link>
          </div>

          {/* Agency */}
          <div className="card-glass p-6 flex flex-col">
            <h3 className="font-bold text-base text-white mb-1">Agency</h3>
            <p className="text-xs text-text-muted mb-4">For multi-server networks & agencies.</p>
            <div className="text-3xl font-extrabold text-white mb-5">
              {billingCycle === 'monthly' ? '$49' : '$40.80'} <span className="text-xs font-normal text-text-muted">/ month</span>
            </div>

            <ul className="text-xs text-text-muted space-y-2.5 mb-8 flex-1">
              <li className="flex items-center gap-2">✓ Unlimited Discord Bots</li>
              <li className="flex items-center gap-2">✓ 100,000 Delivered DMs / month</li>
              <li className="flex items-center gap-2">✓ Closed DMs channel fallback</li>
              <li className="flex items-center gap-2">✓ Dedicated proxy rotation support</li>
              <li className="flex items-center gap-2">✓ 24/7 Priority Discord support</li>
            </ul>

            <Link href="/">
              <Button variant="ghost" fullWidth>
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-surface/30 border-t border-border/60">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-white mb-2">Frequently Asked Questions</h2>
            <p className="text-xs text-text-muted">Everything you need to know about safety, billing, and deliverability.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-4 bg-surface/80 border border-border rounded-xl">
                <h4 className="font-bold text-sm text-white mb-1.5 flex items-center gap-2">
                  <HelpCircle size={15} className="text-accent flex-shrink-0" />
                  <span>{faq.q}</span>
                </h4>
                <p className="text-xs text-text-muted leading-relaxed pl-6">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 text-center max-w-4xl mx-auto px-4">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Keep Your Community Informed, Not Annoyed.</h2>
        <p className="text-sm text-text-muted max-w-xl mx-auto mb-8">
          Join community managers delivering safe, role-targeted announcements with zero Discord bot bans.
        </p>
        <Link href="/">
          <Button variant="primary" size="lg" icon={<ArrowRight size={18} />}>
            Launch Your First Campaign Now
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60 py-8 text-center text-xs text-text-muted">
        <p>© 2026 RoleBeacon. Precision Discord announcement infrastructure. All rights reserved.</p>
      </footer>
    </div>
  );
}
