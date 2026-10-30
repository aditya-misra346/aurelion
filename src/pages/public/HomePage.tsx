import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PhysicalCardPreview } from '../../components/cards/PhysicalCardPreview';
import { InteractiveCardShowcase } from '../../components/cards/InteractiveCardShowcase';
import { PublicInsightsShowcase } from '../../components/charts/PublicInsightsShowcase';
import {
  Sparkline,
  RadialGauge,
  InteractiveWealthProjector,
} from '../../components/charts/VisualWidgets';
import {
  ArrowRight,
  ShieldCheck,
  Activity,
  Sliders,
  Clock,
  Eye,
  CheckCircle2,
  Fingerprint,
  Smartphone,
  BellRing,
  ChevronDown,
  Sparkles,
  ArrowUpRight,
  Search,
  Download,
  RefreshCw,
  KeyRound,
  BarChart3,
  TrendingUp,
} from 'lucide-react';

const ACCOUNT_TIERS = [
  {
    name: 'Essential',
    subtitle: 'Everyday Digital Liquidity',
    badge: 'Core',
    rateLabel: '3.90% APY',
    cardVariant: 'arctic' as const,
    sparkData: [62, 68, 71, 75, 79, 85],
    sparkColor: '#929DB0',
    features: ['Checking & Auto-Vaults', 'Arctic Silver Card', 'Smart Budgets & CSV'],
  },
  {
    name: 'Elevate',
    subtitle: 'Multi-Vault Orchestration',
    badge: 'Popular',
    rateLabel: '4.40% APY',
    cardVariant: 'champagne' as const,
    sparkData: [140, 165, 182, 210, 245, 312],
    sparkColor: '#D6B878',
    features: ['Automated Vault Sweeps', 'Champagne Gold Card', 'Full Cash-Flow Analytics'],
    featured: true,
  },
  {
    name: 'Private',
    subtitle: 'Sovereign Wealth & Treasury',
    badge: 'Bespoke',
    rateLabel: '5.10% APY',
    cardVariant: 'obsidian' as const,
    sparkData: [420, 510, 590, 680, 790, 892],
    sparkColor: '#36C995',
    features: ['Unlimited Treasury Vaults', 'Obsidian Titanium Card', 'Dedicated Private Desk'],
  },
];

const FAQ_ITEMS = [
  {
    q: 'How do I explore the live dashboard?',
    a: 'Click "Live Dashboard" to enter the pre-loaded sandbox or "Open Account" to customize your profile.',
  },
  {
    q: 'What accounts are included?',
    a: 'Operating Checking ($84.6k), Champagne Reserve Vault ($312.4k), and Strategic Treasury ($495k).',
  },
  {
    q: 'Do transfers update balances in real time?',
    a: 'Yes. Every transfer updates account balances, category budgets, and the transaction ledger immediately.',
  },
  {
    q: 'Can I freeze cards and change spending limits?',
    a: 'Yes. Flip cards in 3D, toggle instant freeze, and adjust monthly velocity sliders live.',
  },
  {
    q: 'Can I export transaction data?',
    a: 'Filter by date, category, or merchant and export any view to CSV in one click.',
  },
  {
    q: 'Is my data private?',
    a: 'Everything runs locally in your browser sandbox. No real credentials or card numbers are collected.',
  },
  {
    q: 'Are the displayed APY rates real?',
    a: 'All rates and balances are synthetic demonstration figures for interactive modeling.',
  },
  {
    q: 'How do I reset the demo data?',
    a: 'Click "Reset Demo" in the dashboard header or press ⌘K at any time.',
  },
];

export const HomePage: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [showAllFaqs, setShowAllFaqs] = useState(false);
  const [visualStudioTab, setVisualStudioTab] = useState<'telemetry' | 'projector'>('telemetry');
  const [securitySimState, setSecuritySimState] = useState({
    biometric: true,
    hardwareKey: true,
    geoFence: true,
    instantLock: false,
  });

  const activeSecCount = Object.values(securitySimState).filter(Boolean).length;
  const securityScore = activeSecCount * 25;
  const visibleFaqs = showAllFaqs ? FAQ_ITEMS : FAQ_ITEMS.slice(0, 4);

  return (
    <div className="space-y-20 sm:space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative pt-8 sm:pt-12 overflow-hidden">
        <div className="absolute inset-0 bg-architectural-grid pointer-events-none" aria-hidden="true" />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[960px] h-[480px] bg-radial-gold pointer-events-none"
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left 6 Cols: Crisp Headline & Primary Actions */}
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D6B878]/15 border border-[#D6B878]/35 text-[#B39352] dark:text-[#D6B878] text-xs font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AURELION • PRIVATE DIGITAL BANKING</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-6xl font-semibold tracking-tight leading-[1.06] text-[#080D18] dark:text-[#F5F2EA]">
                Your money deserves a higher standard.
              </h1>

              <p className="text-base sm:text-lg text-[#4A5568] dark:text-[#929DB0] max-w-md">
                Private checking, automated yield vaults, and metal card governance in one unified interface.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#D6B878] hover:bg-[#E5CFA0] text-[#080D18] font-semibold text-sm shadow-gold-glow transition-all"
                >
                  <span>Open Account</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/80 dark:bg-[#141D2D] hover:bg-white dark:hover:bg-[#1B273D] text-[#080D18] dark:text-[#F5F2EA] border border-[#080D18]/15 dark:border-[#F5F2EA]/15 font-semibold text-sm transition-all"
                >
                  <span>Live Dashboard</span>
                  <ArrowUpRight className="w-4 h-4 text-[#B39352] dark:text-[#D6B878]" />
                </Link>
              </div>

              {/* 3 Compact Sparkline KPI Tiles */}
              <div className="pt-3 grid grid-cols-3 gap-3 max-w-lg">
                <div className="p-3 rounded-2xl bg-white/70 dark:bg-[#141D2D]/80 border border-current/10">
                  <span className="text-[10px] font-mono uppercase text-[#6E7A8E] dark:text-[#929DB0] block">
                    Liquidity
                  </span>
                  <span className="font-mono text-base font-semibold tabular-nums block mt-0.5">
                    $892,050
                  </span>
                  <Sparkline data={[812, 830, 848, 868, 871, 892]} color="#D6B878" height={22} className="mt-1" />
                </div>

                <div className="p-3 rounded-2xl bg-white/70 dark:bg-[#141D2D]/80 border border-current/10">
                  <span className="text-[10px] font-mono uppercase text-[#6E7A8E] dark:text-[#929DB0] block">
                    Saved Rate
                  </span>
                  <span className="font-mono text-base font-semibold text-[#36C995] tabular-nums block mt-0.5">
                    49.2%
                  </span>
                  <Sparkline data={[38, 41, 44, 45, 47, 49.2]} color="#36C995" height={22} className="mt-1" />
                </div>

                <div className="p-3 rounded-2xl bg-white/70 dark:bg-[#141D2D]/80 border border-current/10">
                  <span className="text-[10px] font-mono uppercase text-[#6E7A8E] dark:text-[#929DB0] block">
                    Metal Cards
                  </span>
                  <span className="font-mono text-base font-semibold text-[#B39352] dark:text-[#D6B878] tabular-nums block mt-0.5">
                    4 Finishes
                  </span>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="w-3 h-3 rounded-full bg-[#121824] border border-[#D6B878]" />
                    <span className="w-3 h-3 rounded-full bg-[#D6B878]" />
                    <span className="w-3 h-3 rounded-full bg-[#CBD5E1]" />
                    <span className="w-3 h-3 rounded-full bg-[#36C995]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right 6 Cols: Interactive Terminal Card Preview */}
            <div className="lg:col-span-6">
              <div className="rounded-3xl bg-white dark:bg-[#141D2D] border border-[#080D18]/10 dark:border-[#D6B878]/30 p-6 shadow-luxury space-y-5">
                <div className="flex items-center justify-between border-b border-[#080D18]/10 dark:border-[#F5F2EA]/10 pb-3.5">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#6E7A8E] dark:text-[#929DB0] block">
                      Total Portfolio Balance
                    </span>
                    <div className="flex items-baseline gap-2.5 mt-0.5">
                      <span className="font-mono text-2xl sm:text-3xl font-semibold tabular-nums">
                        $892,050.00
                      </span>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#36C995]/15 text-[#36C995]">
                        +$20,370 Oct
                      </span>
                    </div>
                  </div>
                  <div className="w-24 hidden sm:block">
                    <Sparkline data={[812, 830, 848, 868, 871, 892]} color="#36C995" height={32} />
                  </div>
                </div>

                <PhysicalCardPreview
                  variant="obsidian"
                  cardholderName="JULIAN V. STERLING"
                  maskedNumber="4819 •••• •••• 9042"
                  lastFour="9042"
                  expiryDate="09/29"
                  tierLabel="PRIVATE CLIENT EDITION"
                  scale="md"
                />

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl bg-[#F5F2EA] dark:bg-[#0D1423] border border-current/5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#6E7A8E] dark:text-[#929DB0]">6M Net Flow</span>
                      <span className="font-mono text-[#36C995] font-semibold">+$20.3k</span>
                    </div>
                    <div className="mt-2.5 flex items-end gap-1.5 h-10">
                      {[42, 58, 51, 68, 64, 88].map((h, idx) => (
                        <div key={idx} className="flex-1 h-full flex flex-col justify-end items-center">
                          <div
                            className={`w-full rounded-t ${
                              idx === 5 ? 'bg-[#D6B878]' : 'bg-[#36C995]/65'
                            }`}
                            style={{ height: `${h}%` }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#F5F2EA] dark:bg-[#0D1423] border border-current/5 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <span className="text-[10px] font-mono uppercase text-[#B39352] dark:text-[#D6B878] block">
                        Goal Funded
                      </span>
                      <p className="text-xs font-semibold truncate mt-0.5">Como Reserve</p>
                      <p className="text-xs font-mono text-[#36C995] mt-0.5">$245k / $350k</p>
                    </div>
                    <RadialGauge percent={70} size={48} strokeWidth={5} color="#D6B878" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. COMPACT ICON TRUST STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-white dark:bg-[#141D2D] border border-[#080D18]/10 dark:border-[#F5F2EA]/10 p-4 grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { icon: ShieldCheck, title: 'Passkey Auth', badge: 'Hardware MFA' },
            { icon: Activity, title: 'Live Telemetry', badge: 'Instant Sync' },
            { icon: Eye, title: 'Privacy Mask', badge: '1-Click Hide' },
            { icon: Sliders, title: 'Card Freeze', badge: 'Velocity Caps' },
            { icon: Clock, title: '24/7 Access', badge: 'CSV & Wires' },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="flex items-center gap-2.5 p-1.5">
                <div className="w-8 h-8 rounded-lg bg-[#D6B878]/15 text-[#B39352] dark:text-[#D6B878] flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold truncate">{item.title}</p>
                  <span className="text-[10px] font-mono text-[#6E7A8E] dark:text-[#929DB0]">
                    {item.badge}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. TABBED INTERACTIVE ANALYTICS & WEALTH STUDIO (Progressive Disclosure) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#B39352] dark:text-[#D6B878]">
              Interactive Financial Visuals
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight mt-1">
              Track cash flow and project reserve growth.
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-xl bg-white dark:bg-[#141D2D] p-1 border border-[#080D18]/10 dark:border-[#F5F2EA]/10">
              <button
                type="button"
                onClick={() => setVisualStudioTab('telemetry')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  visualStudioTab === 'telemetry'
                    ? 'bg-[#D6B878] text-[#080D18] font-semibold'
                    : 'text-[#6E7A8E] dark:text-[#929DB0]'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Cash Flow & Spend</span>
              </button>
              <button
                type="button"
                onClick={() => setVisualStudioTab('projector')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  visualStudioTab === 'projector'
                    ? 'bg-[#D6B878] text-[#080D18] font-semibold'
                    : 'text-[#6E7A8E] dark:text-[#929DB0]'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Wealth Projector</span>
              </button>
            </div>
          </div>
        </div>

        {visualStudioTab === 'telemetry' ? (
          <PublicInsightsShowcase />
        ) : (
          <InteractiveWealthProjector />
        )}
      </section>

      {/* 4. SIGNATURE ACCOUNT TIERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#B39352] dark:text-[#D6B878]">
              Account Tiers
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight mt-1">
              Choose your banking tier.
            </h2>
          </div>
          <Link
            to="/accounts"
            className="text-xs font-semibold text-[#B39352] dark:text-[#D6B878] hover:underline inline-flex items-center gap-1"
          >
            <span>Compare Full Matrix</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {ACCOUNT_TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-3xl p-6 flex flex-col justify-between border transition-all ${
                tier.featured
                  ? 'bg-pearl-card dark:bg-none text-[#0A0F1A] border-[#D6B878] shadow-luxury-light ring-1 ring-[#D6B878]/35 dark:ring-0 dark:bg-[#0D1423] dark:text-[#F5F2EA] dark:border-[#D6B878]/50 dark:shadow-luxury'
                  : 'bg-white dark:bg-[#141D2D] border-[#0A0F1A]/10 dark:border-[#F5F2EA]/10 shadow-sm dark:shadow-none'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full ${
                      tier.featured
                        ? 'bg-[#D6B878] text-[#080D18] font-semibold'
                        : 'bg-[#D6B878]/15 text-[#B39352] dark:text-[#D6B878]'
                    }`}
                  >
                    {tier.badge}
                  </span>
                  <span className="font-mono text-xs text-[#36C995] font-semibold">
                    {tier.rateLabel}
                  </span>
                </div>

                <div className="flex items-end justify-between gap-3">
                  <div>
                    <h3 className="font-serif text-2xl font-semibold">{tier.name}</h3>
                    <p className="text-xs opacity-70">{tier.subtitle}</p>
                  </div>
                  <div className="w-20">
                    <Sparkline data={tier.sparkData} color={tier.sparkColor} height={28} />
                  </div>
                </div>

                <PhysicalCardPreview
                  variant={tier.cardVariant}
                  cardholderName="JULIAN V. STERLING"
                  maskedNumber="4819 •••• •••• 9042"
                  lastFour="9042"
                  expiryDate="09/29"
                  tierLabel={`${tier.name.toUpperCase()} EDITION`}
                  scale="sm"
                  interactiveTilt={false}
                />

                <ul className="space-y-1.5 pt-2 border-t border-current/10">
                  {tier.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#D6B878] shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                to="/accounts"
                className={`mt-5 py-2.5 px-4 rounded-xl text-center text-xs font-semibold transition-all inline-flex items-center justify-center gap-1.5 ${
                  tier.featured
                    ? 'bg-[#D6B878] hover:bg-[#E5CFA0] text-[#080D18]'
                    : 'bg-[#F4EFE6] hover:bg-[#EAE4D8] dark:bg-[#1B273D] dark:hover:bg-[#253654] text-[#0A0F1A] dark:text-[#F5F2EA] border border-[#D6B878]/35 dark:border-[#D6B878]/30'
                }`}
              >
                <span>Compare {tier.name}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 5. INTERACTIVE 3D CARD STUDIO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#B39352] dark:text-[#D6B878]">
            Metal Cards
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight mt-1">
            Interactive 3D Card Studio.
          </h2>
        </div>

        <InteractiveCardShowcase />
      </section>

      {/* 6. VISUAL CAPABILITY GRID + SECURITY SCORE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left 7 Cols: Quick Action Cards */}
          <div className="lg:col-span-7 rounded-3xl p-6 bg-white dark:bg-[#141D2D] border border-[#080D18]/10 dark:border-[#F5F2EA]/10 flex flex-col justify-between space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#B39352] dark:text-[#D6B878]">
                  Unified Accounts
                </span>
                <h3 className="font-serif text-2xl font-semibold mt-0.5">
                  Three accounts, synchronized live.
                </h3>
              </div>
              <Link
                to="/dashboard/transfers"
                className="px-3 py-1.5 rounded-lg bg-[#D6B878] text-[#080D18] text-xs font-semibold"
              >
                Transfer →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { label: 'Checking', val: '$84,650', spark: [65, 70, 74, 80, 84.6], color: '#D6B878' },
                { label: 'Reserve Vault', val: '$312,400', spark: [260, 275, 290, 301, 312.4], color: '#36C995' },
                { label: 'Treasury', val: '$495,000', spark: [440, 455, 470, 482, 495], color: '#6366F1' },
              ].map((acc, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-[#F5F2EA] dark:bg-[#0D1423] space-y-1.5">
                  <span className="text-[10px] text-[#6E7A8E] dark:text-[#929DB0] block">{acc.label}</span>
                  <span className="font-mono text-base font-semibold tabular-nums block">{acc.val}</span>
                  <Sparkline data={acc.spark} color={acc.color} height={24} />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
              {[
                { icon: Search, title: 'Smart Filter', to: '/dashboard/transactions' },
                { icon: Download, title: 'CSV Export', to: '/dashboard/transactions' },
                { icon: RefreshCw, title: 'Auto-Sweeps', to: '/dashboard' },
                { icon: Sliders, title: 'Card Limits', to: '/dashboard/cards' },
              ].map((feat, i) => {
                const Icon = feat.icon;
                return (
                  <Link
                    key={i}
                    to={feat.to}
                    className="p-3 rounded-xl bg-[#F5F2EA] dark:bg-[#0D1423] hover:border-[#D6B878] border border-transparent transition-all flex items-center gap-2 text-xs font-medium"
                  >
                    <Icon className="w-3.5 h-3.5 text-[#D6B878] shrink-0" />
                    <span className="truncate">{feat.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right 5 Cols: Interactive Security Posture Card */}
          <div className="lg:col-span-5 rounded-3xl bg-pearl-card dark:bg-none dark:bg-[#0D1423] text-[#0A0F1A] dark:text-[#F5F2EA] border border-[#D6B878]/35 dark:border-[#D6B878]/30 shadow-luxury-light dark:shadow-none p-6 flex flex-col justify-between space-y-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#36C995] block">
                  Interactive Security
                </span>
                <h3 className="font-serif text-2xl font-semibold mt-0.5">
                  Defense Controls
                </h3>
                <p className="text-xs text-[#6B778D] dark:text-[#929DB0]">
                  Toggle shields to test posture score
                </p>
              </div>
              <RadialGauge
                percent={securityScore}
                size={76}
                strokeWidth={7}
                color={securityScore >= 75 ? '#36C995' : '#D6B878'}
                sublabel="Score"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                { key: 'biometric' as const, label: 'Passkey Auth', icon: Fingerprint },
                { key: 'hardwareKey' as const, label: 'FIDO2 Key', icon: KeyRound },
                { key: 'geoFence' as const, label: 'Geo-Fence', icon: Smartphone },
                { key: 'instantLock' as const, label: 'Vault Freeze', icon: BellRing },
              ].map((ctrl) => {
                const active = securitySimState[ctrl.key];
                const Icon = ctrl.icon;
                return (
                  <button
                    key={ctrl.key}
                    type="button"
                    onClick={() =>
                      setSecuritySimState((prev) => ({
                        ...prev,
                        [ctrl.key]: !prev[ctrl.key],
                      }))
                    }
                    className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between gap-2 ${
                      active
                        ? 'bg-white dark:bg-[#141D2D] border-[#36C995]/50 shadow-sm'
                        : 'bg-[#F4EFE6]/70 dark:bg-[#141D2D]/40 border-[#0A0F1A]/10 dark:border-[#F5F2EA]/10 opacity-75'
                    }`}
                  >
                    <span className="flex items-center gap-2 text-xs font-medium">
                      <Icon className="w-3.5 h-3.5 text-[#9E7B35] dark:text-[#D6B878]" />
                      <span>{ctrl.label}</span>
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        active ? 'bg-[#36C995]' : 'bg-[#929DB0]/40'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 7. PROGRESSIVE DISCLOSURE FAQ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold">
            Quick Answers
          </h2>
          <button
            type="button"
            onClick={() => setShowAllFaqs((p) => !p)}
            className="text-xs font-semibold text-[#B39352] dark:text-[#D6B878] hover:underline"
          >
            {showAllFaqs ? 'Show Fewer' : `Show All (${FAQ_ITEMS.length})`}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-start">
          {visibleFaqs.map((item, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white dark:bg-[#141D2D] border border-[#080D18]/10 dark:border-[#F5F2EA]/10 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="w-full px-4 py-3.5 text-left flex items-center justify-between gap-3"
                >
                  <span className="text-xs sm:text-sm font-semibold">{item.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#D6B878] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-3.5 text-xs text-[#4A5568] dark:text-[#929DB0] border-t border-current/5 pt-2">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
