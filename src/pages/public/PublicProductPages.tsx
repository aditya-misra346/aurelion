import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { InteractiveCardShowcase } from '../../components/cards/InteractiveCardShowcase';
import { PublicInsightsShowcase } from '../../components/charts/PublicInsightsShowcase';
import {
  Sparkline,
  RadialGauge,
  AllocationDonut,
  InteractiveWealthProjector,
} from '../../components/charts/VisualWidgets';
import { useBanking } from '../../contexts/BankingContext';
import { CURRENCY_RATES } from '../../utils/formatters';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  ArrowRight,
  ShieldCheck,
  Sliders,
  Globe,
  Calculator,
  Lock,
  Fingerprint,
  KeyRound,
  Eye,
  Server,
  MapPin,
  Mail,
  Phone,
  CheckCircle2,
  ArrowUpRight,
  Clock,
  Layers,
  Laptop,
  Smartphone,
  Building2,
  Compass,
} from 'lucide-react';

/* ============================================================================
   2. /personal-banking — PERSONAL BANKING PAGE
   ============================================================================ */
export const PersonalBankingPage: React.FC = () => {
  const [monthlyInflow, setMonthlyInflow] = useState(35000);
  const [operatingRatio, setOperatingRatio] = useState(45);
  const vaultRatio = 35;
  const treasuryRatio = 100 - operatingRatio - vaultRatio;

  const operatingAmt = Math.round((monthlyInflow * operatingRatio) / 100);
  const vaultAmt = Math.round((monthlyInflow * vaultRatio) / 100);
  const treasuryAmt = monthlyInflow - operatingAmt - vaultAmt;

  const sweepDonutData = useMemo(
    () => [
      { name: 'Operating', value: operatingAmt, color: '#D6B878' },
      { name: 'Reserve Vault', value: vaultAmt, color: '#36C995' },
      { name: 'Treasury', value: treasuryAmt, color: '#6395F2' },
    ],
    [operatingAmt, vaultAmt, treasuryAmt]
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-20">
      {/* Hero + Inflow Sweep Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-6 space-y-5">
          <span className="text-xs font-mono uppercase tracking-[0.22em] text-[#B39352] dark:text-[#D6B878]">
            Personal Banking Architecture
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-semibold tracking-tight leading-tight">
            Everyday operating liquidity, elevated.
          </h1>
          <p className="text-base text-[#4A5568] dark:text-[#929DB0] leading-relaxed max-w-xl">
            Automatically partition incoming deposits across operating checking, reserve vaults, and
            treasury buckets.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#D6B878] text-[#080D18] font-semibold text-sm hover:bg-[#E5CFA0] transition-colors"
            >
              <span>Open Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/accounts"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-[#080D18]/15 dark:border-[#F5F2EA]/15 text-sm font-medium hover:border-[#D6B878] transition-colors"
            >
              <span>Compare Tiers</span>
            </Link>
          </div>
        </div>

        {/* Interactive Automated Income Routing Simulator with Live Donut Chart */}
        <div className="lg:col-span-6 rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#141D2D] border border-[#080D18]/10 dark:border-[#D6B878]/30 shadow-luxury space-y-5">
          <div className="flex items-center justify-between border-b border-current/10 pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#B39352] dark:text-[#D6B878] block">
                Interactive Routing Studio
              </span>
              <h2 className="text-lg font-semibold">Automated Inflow Sweep Rules</h2>
            </div>
            <Sliders className="w-5 h-5 text-[#D6B878]" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
            <div className="sm:col-span-7 space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <label htmlFor="inflow-slider" className="text-[#6E7A8E] dark:text-[#929DB0]">
                    Simulated Monthly Inflow
                  </label>
                  <span className="font-mono font-semibold text-[#D6B878] tabular-nums">
                    ${monthlyInflow.toLocaleString()} USD
                  </span>
                </div>
                <input
                  id="inflow-slider"
                  type="range"
                  min={5000}
                  max={100000}
                  step={2500}
                  value={monthlyInflow}
                  onChange={(e) => setMonthlyInflow(Number(e.target.value))}
                  className="w-full accent-[#D6B878]"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <label htmlFor="op-slider" className="text-[#6E7A8E] dark:text-[#929DB0]">
                    Operating Checking ({operatingRatio}%)
                  </label>
                  <span className="font-mono font-semibold tabular-nums">
                    ${operatingAmt.toLocaleString()}
                  </span>
                </div>
                <input
                  id="op-slider"
                  type="range"
                  min={20}
                  max={60}
                  step={5}
                  value={operatingRatio}
                  onChange={(e) => setOperatingRatio(Number(e.target.value))}
                  className="w-full accent-[#D6B878]"
                />
              </div>

              <div className="space-y-2 pt-1">
                <div className="p-2.5 rounded-xl bg-[#F5F2EA] dark:bg-[#0D1423] flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 font-medium">
                    <span className="w-2 h-2 rounded-full bg-[#D6B878]" /> Operating ({operatingRatio}%)
                  </span>
                  <span className="font-mono font-semibold text-[#D6B878] tabular-nums">
                    ${operatingAmt.toLocaleString()}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#F5F2EA] dark:bg-[#0D1423] flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 font-medium">
                    <span className="w-2 h-2 rounded-full bg-[#36C995]" /> Reserve Vault ({vaultRatio}%)
                  </span>
                  <span className="font-mono font-semibold text-[#36C995] tabular-nums">
                    ${vaultAmt.toLocaleString()}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#F5F2EA] dark:bg-[#0D1423] flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 font-medium">
                    <span className="w-2 h-2 rounded-full bg-[#6395F2]" /> Treasury ({treasuryRatio}%)
                  </span>
                  <span className="font-mono font-semibold text-[#6395F2] tabular-nums">
                    ${treasuryAmt.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="sm:col-span-5">
              <AllocationDonut
                data={sweepDonutData}
                centerLabel="Monthly Sweep"
                centerValue={`$${(monthlyInflow / 1000).toFixed(1)}k`}
                height={180}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Three-Pillar Everyday Architecture with Sparklines */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            icon: Layers,
            title: 'Partitioned Sub-Ledgers',
            desc: 'Isolate operating expenses from tax reserves and acquisitions.',
            spark: [42, 48, 51, 56, 62, 68],
            color: '#D6B878',
          },
          {
            icon: Clock,
            title: 'Commitment Forecasting',
            desc: 'Preview recurring retainers alongside live checking liquidity.',
            spark: [30, 34, 33, 39, 44, 52],
            color: '#36C995',
          },
          {
            icon: ShieldCheck,
            title: 'Zero-Noise Telemetry',
            desc: 'Normalized merchant naming, location tags, and one-click CSV exports.',
            spark: [60, 64, 69, 74, 81, 88],
            color: '#6395F2',
          },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="rounded-3xl p-6 bg-white dark:bg-[#141D2D] border border-[#080D18]/10 dark:border-[#F5F2EA]/10 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#D6B878]/15 text-[#B39352] dark:text-[#D6B878] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <Sparkline data={item.spark} color={item.color} width={96} height={32} />
                </div>
                <h3 className="font-serif text-2xl font-semibold">{item.title}</h3>
                <p className="text-xs sm:text-sm text-[#4A5568] dark:text-[#929DB0] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <PublicInsightsShowcase />
    </div>
  );
};

/* ============================================================================
   3. /accounts — SIGNATURE ACCOUNTS & YIELD SIMULATOR PAGE
   ============================================================================ */
export const PublicAccountsPage: React.FC = () => {
  const { theme } = useBanking();
  const [depositSim, setDepositSim] = useState(250000);
  const [monthsSim, setMonthsSim] = useState(12);
  const [selectedTierTab, setSelectedTierTab] = useState<'Essential' | 'Elevate' | 'Private'>('Private');

  const tierRates = {
    Essential: 0.039,
    Elevate: 0.044,
    Private: 0.0465,
  };
  const illustrativeRate = tierRates[selectedTierTab];
  const projectedInterest = Math.round(
    depositSim * Math.pow(1 + illustrativeRate / 12, monthsSim) - depositSim
  );

  const compoundingCurve = useMemo(() => {
    const pts = [];
    const step = Math.max(1, Math.floor(monthsSim / 6));
    for (let m = 0; m <= monthsSim; m += step) {
      const bal = Math.round(depositSim * Math.pow(1 + illustrativeRate / 12, m));
      pts.push({
        label: `M${m}`,
        balance: bal,
        principal: depositSim,
      });
    }
    return pts;
  }, [depositSim, monthsSim, illustrativeRate]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16">
      <div className="max-w-3xl space-y-3">
        <span className="text-xs font-mono uppercase tracking-[0.22em] text-[#B39352] dark:text-[#D6B878]">
          Signature Account Matrix
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl font-semibold tracking-tight">
          Structured for clarity across every tier.
        </h1>
        <p className="text-sm sm:text-base text-[#4A5568] dark:text-[#929DB0]">
          Compare Essential, Elevate, and Private tiers with interactive compounding projections.
        </p>
      </div>

      {/* Interactive Reserve Compounding Calculator with Live AreaChart */}
      <div className="rounded-3xl p-6 sm:p-10 bg-pearl-card dark:bg-none dark:bg-[#0D1423] text-[#0A0F1A] dark:text-[#F5F2EA] border border-[#D6B878]/35 dark:border-[#D6B878]/30 shadow-luxury-light dark:shadow-none grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#9E7B35] dark:text-[#D6B878]">
              <Calculator className="w-4 h-4" /> Reserve Compounding Studio
            </div>
            <div className="inline-flex rounded-xl bg-[#F4EFE6] dark:bg-[#141D2D] p-1 border border-[#0A0F1A]/10 dark:border-[#F5F2EA]/10 text-xs">
              {(['Essential', 'Elevate', 'Private'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSelectedTierTab(t)}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                    selectedTierTab === t
                      ? 'bg-[#D6B878] text-[#080D18] font-semibold'
                      : 'text-[#6B778D] dark:text-[#929DB0]'
                  }`}
                >
                  {t} ({(tierRates[t] * 100).toFixed(2)}%)
                </button>
              ))}
            </div>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl font-semibold">
            Simulate {selectedTierTab} Reserve Growth
          </h2>

          <div className="space-y-4 pt-1">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <label htmlFor="vault-principal" className="text-[#6B778D] dark:text-[#929DB0]">
                  Simulated Vault Allocation
                </label>
                <span className="font-mono font-semibold text-[#9E7B35] dark:text-[#D6B878] tabular-nums">
                  ${depositSim.toLocaleString()} USD
                </span>
              </div>
              <input
                id="vault-principal"
                type="range"
                min={25000}
                max={1000000}
                step={25000}
                value={depositSim}
                onChange={(e) => setDepositSim(Number(e.target.value))}
                className="w-full accent-[#D6B878]"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <label htmlFor="vault-months" className="text-[#6B778D] dark:text-[#929DB0]">
                  Holding Horizon ({monthsSim} Months)
                </label>
                <span className="font-mono font-semibold tabular-nums">{monthsSim} Months</span>
              </div>
              <input
                id="vault-months"
                type="range"
                min={6}
                max={36}
                step={6}
                value={monthsSim}
                onChange={(e) => setMonthsSim(Number(e.target.value))}
                className="w-full accent-[#D6B878]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-white dark:bg-[#141D2D] border border-[#0A0F1A]/10 dark:border-[#F5F2EA]/10 shadow-sm dark:shadow-none">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B778D] dark:text-[#929DB0] block">
                Projected Ending Balance
              </span>
              <span className="font-mono text-2xl font-semibold text-[#0A0F1A] dark:text-[#F5F2EA] tabular-nums mt-1 block">
                ${(depositSim + projectedInterest).toLocaleString()}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-[#141D2D] border border-[#36C995]/40 shadow-sm dark:shadow-none">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#36C995] block">
                Simulated Yield Generated
              </span>
              <span className="font-mono text-2xl font-semibold text-[#36C995] tabular-nums mt-1 block">
                +${projectedInterest.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Live Compounding Curve Chart */}
        <div className="lg:col-span-6 rounded-2xl bg-white dark:bg-[#141D2D] border border-[#0A0F1A]/10 dark:border-[#F5F2EA]/10 p-5 space-y-4 shadow-sm dark:shadow-none">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono uppercase tracking-wider text-[#9E7B35] dark:text-[#D6B878]">
              Compounding Trajectory ({monthsSim}M)
            </span>
            <span className="font-mono text-[#36C995]">
              {(illustrativeRate * 100).toFixed(2)}% Illustrative APY
            </span>
          </div>
          <div className="h-[210px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={compoundingCurve}>
                <defs>
                  <linearGradient id="acctCompGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#36C995" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#36C995" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? 'rgba(146,157,176,0.12)' : 'rgba(10,15,26,0.06)'} vertical={false} />
                <XAxis dataKey="label" stroke={theme === 'dark' ? '#929DB0' : '#6B778D'} fontSize={11} tickLine={false} axisLine={false} />
                <YAxis
                  stroke={theme === 'dark' ? '#929DB0' : '#6B778D'}
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  domain={['dataMin - 5000', 'dataMax + 5000']}
                  tickFormatter={(v) => `$${Math.round(v / 1000)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? '#080D18' : '#FFFFFF',
                    borderColor: theme === 'dark' ? 'rgba(214,184,120,0.4)' : 'rgba(179,147,82,0.35)',
                    borderRadius: '12px',
                    color: theme === 'dark' ? '#F5F2EA' : '#0A0F1A',
                    boxShadow: theme === 'dark' ? '0 10px 25px -5px rgba(0,0,0,0.5)' : '0 10px 25px -5px rgba(10,15,26,0.08)',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '12px',
                  }}
                  formatter={(v: number) => [`$${v.toLocaleString()}`, 'Projected Reserve']}
                />
                <Area
                  type="monotone"
                  dataKey="balance"
                  stroke="#36C995"
                  strokeWidth={2.5}
                  fill="url(#acctCompGrad)"
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <Link
            to="/dashboard/accounts"
            className="w-full py-3 px-4 rounded-xl bg-[#D6B878] text-[#080D18] font-semibold text-xs text-center block hover:bg-[#E5CFA0] transition-colors"
          >
            Open Accounts →
          </Link>
        </div>
      </div>

      {/* Tier Comparison Matrix */}
      <div className="rounded-3xl bg-white dark:bg-[#141D2D] border border-[#080D18]/10 dark:border-[#F5F2EA]/10 overflow-hidden shadow-luxury-light dark:shadow-luxury">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#080D18]/10 dark:border-[#F5F2EA]/10 bg-[#F5F2EA]/60 dark:bg-[#0D1423]">
                <th className="p-5 text-xs font-mono uppercase tracking-wider text-[#6E7A8E] dark:text-[#929DB0]">
                  Capability
                </th>
                <th className="p-5 text-lg font-serif font-semibold">Essential</th>
                <th className="p-5 text-lg font-serif font-semibold text-[#B39352] dark:text-[#D6B878]">
                  Elevate
                </th>
                <th className="p-5 text-lg font-serif font-semibold">Private</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#080D18]/10 dark:divide-[#F5F2EA]/10 text-sm">
              {[
                {
                  feature: 'Sub-Accounts & Vaults',
                  essential: 'Up to 2',
                  elevate: 'Up to 5',
                  private: 'Unlimited',
                },
                {
                  feature: 'Payment Instrument',
                  essential: 'Arctic Silver',
                  elevate: 'Champagne Reserve',
                  private: 'Midnight Obsidian Titanium',
                },
                {
                  feature: 'Reserve Vault Yield',
                  essential: '3.90% APY',
                  elevate: '4.40% APY',
                  private: '4.65% – 5.10% APY',
                },
                {
                  feature: 'Card Velocity & Geo Locks',
                  essential: 'Included',
                  elevate: 'Multi-Card',
                  private: 'Dedicated Concierge',
                },
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-[#080D18]/[0.02] dark:hover:bg-[#F5F2EA]/[0.02]">
                  <td className="p-5 font-medium text-[#080D18] dark:text-[#F5F2EA]">{row.feature}</td>
                  <td className="p-5 text-[#4A5568] dark:text-[#929DB0] font-mono text-xs">{row.essential}</td>
                  <td className="p-5 font-mono text-xs font-semibold text-[#B39352] dark:text-[#D6B878]">
                    {row.elevate}
                  </td>
                  <td className="p-5 font-mono text-xs text-[#080D18] dark:text-[#F5F2EA]">{row.private}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   4. /cards — PUBLIC CARDS SHOWCASE PAGE
   ============================================================================ */
export const PublicCardsPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-mono uppercase tracking-[0.22em] text-[#B39352] dark:text-[#D6B878]">
            Aurelion Payment Instruments
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-semibold tracking-tight">
            Architectural metallurgy meets digital governance.
          </h1>
          <p className="text-sm sm:text-base text-[#4A5568] dark:text-[#929DB0]">
            Flip cards in 3D, toggle studio lighting, and customize spending limits.
          </p>
        </div>
        <Link
          to="/dashboard/cards"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#D6B878] text-[#080D18] font-semibold text-sm hover:bg-[#E5CFA0] transition-colors shrink-0"
        >
          <span>Card Controls</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      <InteractiveCardShowcase />

      {/* Metallurgy & Governance Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {[
          {
            name: 'Midnight Obsidian',
            alloy: 'Grade-5 PVD Titanium (22g)',
            defaultCap: '$50,000 / mo',
            spark: [12, 16, 15, 19, 17, 18],
            color: '#D6B878',
          },
          {
            name: 'Champagne Reserve',
            alloy: '18k Anodized Gold Alloy (20g)',
            defaultCap: '$35,000 / mo',
            spark: [8, 10, 9, 12, 11, 13],
            color: '#36C995',
          },
          {
            name: 'Arctic Silver',
            alloy: 'Aluminum-Ceramic Composite',
            defaultCap: '$15,000 / mo',
            spark: [3, 4, 4, 5, 4, 5],
            color: '#6395F2',
          },
          {
            name: 'Emerald Signature',
            alloy: 'Recycled Satin Palladium Alloy',
            defaultCap: '$25,000 / mo',
            spark: [5, 7, 6, 8, 9, 10],
            color: '#36C995',
          },
        ].map((spec, idx) => (
          <div
            key={idx}
            className="rounded-2xl p-6 bg-white dark:bg-[#141D2D] border border-[#080D18]/10 dark:border-[#F5F2EA]/10 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#B39352] dark:text-[#D6B878]">
                0{idx + 1} • Alloy
              </span>
              <Sparkline data={spec.spark} color={spec.color} width={72} height={24} />
            </div>
            <h3 className="font-serif text-xl font-semibold">{spec.name}</h3>
            <p className="text-xs text-[#6E7A8E] dark:text-[#929DB0]">{spec.alloy}</p>
            <div className="pt-3 border-t border-current/10 flex justify-between text-xs font-mono">
              <span className="opacity-70">Default Cap:</span>
              <span className="text-[#36C995]">{spec.defaultCap}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ============================================================================
   5. /payments — GLOBAL PAYMENTS & WIRE SIMULATOR PAGE
   ============================================================================ */
export const PublicPaymentsPage: React.FC = () => {
  const [sendUsd, setSendUsd] = useState(25000);
  const [targetCorridor, setTargetCorridor] = useState<'EUR' | 'GBP' | 'CHF'>('CHF');

  const rateObj = CURRENCY_RATES[targetCorridor];
  const converted = (sendUsd * rateObj.rate).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const fxTrendData = useMemo(() => {
    const base = rateObj.rate;
    return [
      { day: 'D-6', rate: Number((base * 0.994).toFixed(4)) },
      { day: 'D-5', rate: Number((base * 0.997).toFixed(4)) },
      { day: 'D-4', rate: Number((base * 0.995).toFixed(4)) },
      { day: 'D-3', rate: Number((base * 1.001).toFixed(4)) },
      { day: 'D-2', rate: Number((base * 0.999).toFixed(4)) },
      { day: 'D-1', rate: Number((base * 1.002).toFixed(4)) },
      { day: 'Spot', rate: base },
    ];
  }, [rateObj.rate]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-5 space-y-5">
          <span className="text-xs font-mono uppercase tracking-[0.22em] text-[#B39352] dark:text-[#D6B878]">
            Global Settlement & Transfers
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold tracking-tight">
            Precision domestic wires & global corridors.
          </h1>
          <p className="text-sm sm:text-base text-[#4A5568] dark:text-[#929DB0] leading-relaxed">
            Execute instant internal sweeps and multi-currency wires with real-time corridor rates.
          </p>
          <div className="pt-2">
            <Link
              to="/dashboard/transfers"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#D6B878] text-[#080D18] font-semibold text-sm hover:bg-[#E5CFA0] transition-colors"
            >
              <span>New Transfer</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Interactive FX Corridor Estimator + 7-Day Rate Curve */}
        <div className="lg:col-span-7 rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#141D2D] border border-[#080D18]/10 dark:border-[#D6B878]/30 shadow-luxury space-y-5">
          <div className="flex items-center justify-between border-b border-current/10 pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#B39352] dark:text-[#D6B878] block">
                Illustrative Corridor Preview
              </span>
              <h2 className="text-lg font-semibold">Multi-Currency Settlement & 7-Day Spot Curve</h2>
            </div>
            <Globe className="w-5 h-5 text-[#D6B878]" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
            <div className="sm:col-span-6 space-y-4">
              <div>
                <label
                  htmlFor="fx-usd-input"
                  className="block text-xs uppercase tracking-wider text-[#6E7A8E] dark:text-[#929DB0] mb-1.5"
                >
                  Source Amount (USD)
                </label>
                <input
                  id="fx-usd-input"
                  type="number"
                  min={100}
                  max={1000000}
                  value={sendUsd}
                  onChange={(e) => setSendUsd(Math.max(0, Number(e.target.value)))}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F5F2EA] dark:bg-[#0D1423] border border-current/15 font-mono text-base font-semibold tabular-nums focus:outline-none focus:border-[#D6B878]"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                {(['CHF', 'EUR', 'GBP'] as const).map((cur) => (
                  <button
                    key={cur}
                    type="button"
                    onClick={() => setTargetCorridor(cur)}
                    className={`py-2 px-3 rounded-xl font-mono text-xs border transition-all ${
                      targetCorridor === cur
                        ? 'bg-[#D6B878] text-[#080D18] border-[#D6B878] font-semibold'
                        : 'border-current/15 opacity-75 hover:opacity-100'
                    }`}
                  >
                    USD → {cur}
                  </button>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-[#F5F2EA] dark:bg-[#0D1423] border border-current/10 space-y-1.5">
                <div className="flex justify-between text-[11px] text-[#6E7A8E] dark:text-[#929DB0]">
                  <span>Reference Rate</span>
                  <span className="font-mono">
                    1 USD = {rateObj.rate} {targetCorridor}
                  </span>
                </div>
                <div className="flex justify-between items-baseline pt-1.5 border-t border-current/10">
                  <span className="text-xs font-medium">Recipient Credit</span>
                  <span className="font-mono text-xl font-semibold text-[#36C995] tabular-nums">
                    {rateObj.symbol}
                    {converted}
                  </span>
                </div>
              </div>
            </div>

            {/* 7-Day Corridor AreaChart */}
            <div className="sm:col-span-6 p-4 rounded-2xl bg-[#F5F2EA]/60 dark:bg-[#0D1423] border border-current/10 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-[#6E7A8E] dark:text-[#929DB0]">
                  USD/{targetCorridor} 7D Illustrative Curve
                </span>
                <span className="text-[#36C995]">{rateObj.rate} Spot</span>
              </div>
              <div className="h-[155px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={fxTrendData}>
                    <defs>
                      <linearGradient id="fxCurveGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#D6B878" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#D6B878" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" stroke="#929DB0" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis hide domain={['dataMin - 0.003', 'dataMax + 0.003']} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#080D18',
                        borderColor: 'rgba(214,184,120,0.4)',
                        borderRadius: '10px',
                        color: '#F5F2EA',
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: '11px',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="rate"
                      stroke="#D6B878"
                      strokeWidth={2}
                      fill="url(#fxCurveGrad)"
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settlement Rail Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {[
          {
            rail: 'Aurelion Internal Sweep',
            window: 'Instant (24/7/365)',
            fee: '$0 Illustrative',
            trace: 'Immediate Ledger Reference',
          },
          {
            rail: 'Domestic Wire Simulation',
            window: 'Same-Day Settlement',
            fee: '$0 Private / Elevate',
            trace: 'IMAD / OMAD Reference',
          },
          {
            rail: 'SEPA & Eurozone Corridor',
            window: 'Near Real-Time',
            fee: 'Transparent FX Spread',
            trace: 'IBAN End-to-End Tracking',
          },
          {
            rail: 'Swiss CHF Private Desk',
            window: 'Same-Day Zurich Cutoff',
            fee: 'Transparent FX Spread',
            trace: 'SWIFT gpi Telemetry',
          },
        ].map((item, i) => (
          <div
            key={i}
            className="rounded-2xl p-6 bg-white dark:bg-[#141D2D] border border-[#080D18]/10 dark:border-[#F5F2EA]/10 space-y-2"
          >
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#36C995]">
              {item.window}
            </span>
            <h3 className="font-serif text-xl font-semibold">{item.rail}</h3>
            <p className="text-xs text-[#6E7A8E] dark:text-[#929DB0]">{item.trace}</p>
            <p className="font-mono text-xs text-[#B39352] dark:text-[#D6B878] pt-2">{item.fee}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ============================================================================
   6. /loans — TAILORED LENDING & PRIVATE CREDIT PAGE
   ============================================================================ */
export const PublicLoansPage: React.FC = () => {
  const [loanAmount, setLoanAmount] = useState(450000);
  const [termYears, setTermYears] = useState(15);
  const illustrativeApr = 0.0525; // 5.25% illustrative

  const monthlyRate = illustrativeApr / 12;
  const totalPayments = termYears * 12;
  const monthlyPayment =
    (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments))) /
    (Math.pow(1 + monthlyRate, totalPayments) - 1);

  const totalPaid = monthlyPayment * totalPayments;
  const totalInterest = totalPaid - loanAmount;
  const principalRatio = Math.round((loanAmount / totalPaid) * 100);

  const amortizationCurve = useMemo(() => {
    const pts = [];
    const step = Math.max(1, Math.floor(termYears / 5));
    for (let y = 0; y <= termYears; y += step) {
      const k = y * 12;
      const remBalance =
        k === 0
          ? loanAmount
          : Math.max(
              0,
              Math.round(
                (loanAmount *
                  (Math.pow(1 + monthlyRate, totalPayments) - Math.pow(1 + monthlyRate, k))) /
                  (Math.pow(1 + monthlyRate, totalPayments) - 1)
              )
            );
      pts.push({
        year: `Y${y}`,
        remainingPrincipal: remBalance,
        equityPaid: loanAmount - remBalance,
      });
    }
    return pts;
  }, [loanAmount, termYears, monthlyRate, totalPayments]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-5 space-y-5">
          <span className="text-xs font-mono uppercase tracking-[0.22em] text-[#B39352] dark:text-[#D6B878]">
            Private Credit & Architectural Financing
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold tracking-tight">
            Structured liquidity without liquidating core holdings.
          </h1>
          <p className="text-sm sm:text-base text-[#4A5568] dark:text-[#929DB0] leading-relaxed">
            Model tailored portfolio credit lines and residential architectural financing using our
            interactive amortization curve simulator.
          </p>
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-[#141D2D] border border-[#080D18]/10 dark:border-[#F5F2EA]/10">
            <RadialGauge value={principalRatio} size={64} strokeWidth={6} color="#D6B878" />
            <div>
              <span className="text-xs font-semibold block">
                Principal Share of Total Facility ({principalRatio}%)
              </span>
              <span className="text-xs text-[#6E7A8E] dark:text-[#929DB0]">
                Principal vs. cumulative interest over {termYears} years
              </span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#141D2D] border border-[#080D18]/10 dark:border-[#D6B878]/30 shadow-luxury space-y-6">
          <h2 className="text-lg font-semibold border-b border-current/10 pb-3">
            Interactive Amortization & Paydown Simulator (5.25% Sample Rate)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
            <div className="sm:col-span-6 space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <label htmlFor="loan-amt">Simulated Facility Principal</label>
                  <span className="font-mono font-semibold text-[#D6B878] tabular-nums">
                    ${loanAmount.toLocaleString()}
                  </span>
                </div>
                <input
                  id="loan-amt"
                  type="range"
                  min={100000}
                  max={2000000}
                  step={50000}
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full accent-[#D6B878]"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <label htmlFor="loan-term">Amortization Horizon ({termYears} Years)</label>
                  <span className="font-mono font-semibold tabular-nums">{termYears} Years</span>
                </div>
                <input
                  id="loan-term"
                  type="range"
                  min={5}
                  max={30}
                  step={5}
                  value={termYears}
                  onChange={(e) => setTermYears(Number(e.target.value))}
                  className="w-full accent-[#D6B878]"
                />
              </div>

              <div className="p-4 rounded-2xl bg-[#F5F2EA] dark:bg-[#0D1423] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#6E7A8E] dark:text-[#929DB0]">Monthly Payment</span>
                  <span className="font-mono text-2xl font-semibold text-[#B39352] dark:text-[#D6B878] tabular-nums">
                    ${Math.round(monthlyPayment).toLocaleString()}/mo
                  </span>
                </div>
                <div className="pt-2 border-t border-current/10 flex justify-between text-xs font-mono">
                  <span className="text-[#6E7A8E] dark:text-[#929DB0]">Total Interest:</span>
                  <span>${Math.round(totalInterest).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="sm:col-span-6 p-4 rounded-2xl bg-[#F5F2EA]/60 dark:bg-[#0D1423] border border-current/10 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-[#6E7A8E] dark:text-[#929DB0]">Principal Paydown Curve</span>
                <span className="text-[#36C995]">{termYears}Y Schedule</span>
              </div>
              <div className="h-[170px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={amortizationCurve}>
                    <defs>
                      <linearGradient id="loanRemGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#D6B878" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#D6B878" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="year" stroke="#929DB0" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis
                      stroke="#929DB0"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => `$${Math.round(v / 1000)}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#080D18',
                        borderColor: 'rgba(214,184,120,0.4)',
                        borderRadius: '10px',
                        color: '#F5F2EA',
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: '11px',
                      }}
                      formatter={(v: number, name: string) => [
                        `$${v.toLocaleString()}`,
                        name === 'remainingPrincipal' ? 'Remaining Principal' : 'Principal Repaid',
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="remainingPrincipal"
                      stroke="#D6B878"
                      strokeWidth={2}
                      fill="url(#loanRemGrad)"
                      isAnimationActive={false}
                    />
                    <Area
                      type="monotone"
                      dataKey="equityPaid"
                      stroke="#36C995"
                      strokeWidth={2}
                      fillOpacity={0}
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   7. /wealth — PRIVATE WEALTH & TREASURY PAGE
   ============================================================================ */
export const PublicWealthPage: React.FC = () => {
  const [archetype, setArchetype] = useState<'preservation' | 'endowment' | 'strategic'>('endowment');
  const [wealthTab, setWealthTab] = useState<'projector' | 'telemetry'>('projector');

  const allocations = {
    preservation: [
      { name: 'Sovereign Treasury', value: 55, color: '#D6B878' },
      { name: 'Cash Reserve Vaults', value: 30, color: '#36C995' },
      { name: 'Quality Equities', value: 15, color: '#6395F2' },
    ],
    endowment: [
      { name: 'Sovereign Fixed Income', value: 35, color: '#D6B878' },
      { name: 'Global Direct Equities', value: 30, color: '#36C995' },
      { name: 'Cash Reserve Vaults', value: 20, color: '#6395F2' },
      { name: 'Real Assets & Credit', value: 15, color: '#E59866' },
    ],
    strategic: [
      { name: 'Global Equities', value: 50, color: '#36C995' },
      { name: 'Private Credit', value: 25, color: '#D6B878' },
      { name: 'Sovereign Treasury', value: 15, color: '#6395F2' },
      { name: 'Operating Vault', value: 10, color: '#E59866' },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-6 space-y-4">
          <span className="text-xs font-mono uppercase tracking-[0.22em] text-[#B39352] dark:text-[#D6B878]">
            Private Wealth & Treasury
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-semibold tracking-tight">
            Long-horizon capital stewardship.
          </h1>
          <p className="text-sm sm:text-base text-[#4A5568] dark:text-[#929DB0] leading-relaxed">
            Explore allocation mandates, multi-year compounding curves, and live cash flow telemetry.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              to="/dashboard/budgets"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#D6B878] text-[#080D18] font-semibold text-sm"
            >
              <span>Goals & Budgets</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/dashboard/analytics"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-current/15 text-sm font-medium"
            >
              <span>Analytics</span>
            </Link>
          </div>
        </div>

        {/* Interactive Portfolio Archetype Explorer with Live Donut Chart */}
        <div className="lg:col-span-6 rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#141D2D] border border-[#080D18]/10 dark:border-[#D6B878]/30 shadow-luxury space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-current/10 pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#B39352] dark:text-[#D6B878] block">
                Mandate Explorer
              </span>
              <h2 className="text-lg font-semibold">Allocation Archetypes</h2>
            </div>
            <Compass className="w-5 h-5 text-[#D6B878]" />
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'preservation' as const, label: 'Preservation' },
              { id: 'endowment' as const, label: 'Endowment' },
              { id: 'strategic' as const, label: 'Strategic' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setArchetype(tab.id)}
                className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all ${
                  archetype === tab.id
                    ? 'bg-[#D6B878] text-[#080D18] border-[#D6B878] font-semibold'
                    : 'border-current/15 opacity-75'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <AllocationDonut
            data={allocations[archetype]}
            centerLabel="Mandate"
            centerValue={archetype.toUpperCase()}
            height={190}
          />
        </div>
      </div>

      {/* Progressive Disclosure Tabs for Wealth Projector vs Cash Flow Telemetry */}
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold">
            Interactive Wealth & Telemetry Studio
          </h2>
          <div className="inline-flex rounded-xl bg-white dark:bg-[#141D2D] p-1 border border-current/10 text-xs">
            <button
              type="button"
              onClick={() => setWealthTab('projector')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                wealthTab === 'projector'
                  ? 'bg-[#D6B878] text-[#080D18] font-semibold'
                  : 'text-[#6E7A8E] dark:text-[#929DB0]'
              }`}
            >
              Wealth Projector
            </button>
            <button
              type="button"
              onClick={() => setWealthTab('telemetry')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                wealthTab === 'telemetry'
                  ? 'bg-[#D6B878] text-[#080D18] font-semibold'
                  : 'text-[#6E7A8E] dark:text-[#929DB0]'
              }`}
            >
              Cash Flow Telemetry
            </button>
          </div>
        </div>

        {wealthTab === 'projector' ? <InteractiveWealthProjector /> : <PublicInsightsShowcase />}
      </div>
    </div>
  );
};

/* ============================================================================
   8. /security — SECURITY ARCHITECTURE PAGE
   ============================================================================ */
export const PublicSecurityPage: React.FC = () => {
  const [sessions, setSessions] = useState([
    {
      id: 'ses-1',
      device: 'MacBook Pro 16" (M4 Max)',
      location: 'New York, NY • Primary Workstation',
      status: 'Current Session',
      current: true,
    },
    {
      id: 'ses-2',
      device: 'iPhone 17 Pro • Aurelion iOS App (Demo)',
      location: 'New York, NY • Biometric Bound',
      status: 'Active 14m ago',
      current: false,
    },
    {
      id: 'ses-3',
      device: 'iPad Pro 13" • Geneva Salon Terminal',
      location: 'Geneva, CH • Roaming Session',
      status: 'Active 2d ago',
      current: false,
    },
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-3">
          <span className="text-xs font-mono uppercase tracking-[0.22em] text-[#36C995]">
            Security & Privacy Architecture
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-semibold tracking-tight">
            Transparent controls and defense-in-depth engineering.
          </h1>
          <p className="text-sm sm:text-base text-[#4A5568] dark:text-[#929DB0] leading-relaxed">
            Instant card freeze, cryptographic balance masking, and multi-step transfer verification.
          </p>
        </div>

        {/* Visual Security Posture Gauges */}
        <div className="lg:col-span-5 grid grid-cols-3 gap-3 p-5 rounded-3xl bg-white dark:bg-[#141D2D] border border-[#080D18]/10 dark:border-[#F5F2EA]/10">
          <RadialGauge
            value={98}
            size={74}
            strokeWidth={6}
            color="#36C995"
            label="Posture Score"
            sublabel="Defense Index"
          />
          <RadialGauge
            value={100}
            size={74}
            strokeWidth={6}
            color="#D6B878"
            label="Passkey MFA"
            sublabel="Hardware Bound"
          />
          <RadialGauge
            value={100}
            size={74}
            strokeWidth={6}
            color="#6395F2"
            label="Sandbox Isolation"
            sublabel="Zero External Leak"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[
          {
            icon: Fingerprint,
            title: 'Biometric & Passkey Workflows',
            status: 'Simulated in Settings',
            desc: 'Hardware-backed passkeys and biometric step-up verification before high-value wires.',
          },
          {
            icon: Lock,
            title: 'Instant Card Freeze & Geo-Locks',
            status: 'Live Demo State',
            desc: 'Lock or unlock any payment card immediately, disable roaming, or cap monthly limits.',
          },
          {
            icon: Eye,
            title: 'Zero-Shoulder-Surfing Privacy Mask',
            status: 'Global Header Toggle',
            desc: 'One-click balance masking replaces portfolio figures with cryptographic dots.',
          },
          {
            icon: KeyRound,
            title: 'Multi-Step Transfer Confirmation',
            status: '6-Step Validation',
            desc: 'Transfers validate available liquidity and require explicit review before execution.',
          },
          {
            icon: Server,
            title: 'Strict Local Demo Isolation',
            status: 'Client-Side Sandbox',
            desc: 'No real credentials or card numbers are collected. Reset demo state anytime.',
          },
          {
            icon: ShieldCheck,
            title: 'Auditable Activity Log',
            status: 'Real-Time Ledger',
            desc: 'Every simulated transfer, card lock, and budget rule logs an immediate notification.',
          },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="rounded-3xl p-6 bg-white dark:bg-[#141D2D] border border-[#080D18]/10 dark:border-[#F5F2EA]/10 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#D6B878]/15 text-[#B39352] dark:text-[#D6B878] flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded bg-[#36C995]/15 text-[#36C995]">
                  {item.status}
                </span>
              </div>
              <h2 className="text-lg font-semibold">{item.title}</h2>
              <p className="text-xs text-[#4A5568] dark:text-[#929DB0] leading-relaxed">
                {item.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Interactive Device & Session Governance Simulator */}
      <div className="rounded-3xl p-8 bg-pearl-card dark:bg-none dark:bg-[#0D1423] text-[#0A0F1A] dark:text-[#F5F2EA] border border-[#D6B878]/35 dark:border-[#D6B878]/30 shadow-luxury-light dark:shadow-none space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#0A0F1A]/10 dark:border-[#F5F2EA]/10 pb-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#9E7B35] dark:text-[#D6B878]">
              Interactive Session Governance (Demo)
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold mt-1">
              Authorized Client Devices
            </h2>
          </div>
          <span className="text-xs font-mono text-[#36C995]">
            {sessions.length} Active Simulated Sessions
          </span>
        </div>

        <div className="divide-y divide-[#0A0F1A]/10 dark:divide-[#F5F2EA]/10">
          {sessions.map((ses) => (
            <div key={ses.id} className="py-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#F4EFE6] dark:bg-[#141D2D] border border-[#0A0F1A]/10 dark:border-[#F5F2EA]/10 flex items-center justify-center text-[#9E7B35] dark:text-[#D6B878]">
                  {ses.device.includes('MacBook') ? (
                    <Laptop className="w-5 h-5" />
                  ) : (
                    <Smartphone className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold">{ses.device}</p>
                  <p className="text-xs text-[#6B778D] dark:text-[#929DB0]">
                    {ses.location} • <span className="font-mono text-[#36C995]">{ses.status}</span>
                  </p>
                </div>
              </div>

              {!ses.current && (
                <button
                  type="button"
                  onClick={() => setSessions((prev) => prev.filter((s) => s.id !== ses.id))}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#FF7777]/15 text-[#FF7777] border border-[#FF7777]/30 hover:bg-[#FF7777]/25 transition-colors"
                >
                  Revoke Device Session
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   9. /about — ABOUT AURELION PAGE
   ============================================================================ */
export const PublicAboutPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16">
      <div className="max-w-3xl space-y-4">
        <span className="text-xs font-mono uppercase tracking-[0.22em] text-[#B39352] dark:text-[#D6B878]">
          Institutional Philosophy
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl font-semibold tracking-tight">
          Where private banking heritage meets precision interface craft.
        </h1>
        <p className="text-base text-[#4A5568] dark:text-[#929DB0] leading-relaxed">
          AURELION combines calm architectural typography, mathematically synchronized ledgers, and
          tactile interactive controls.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: '01. Editorial Restraint',
            desc: 'Generous whitespace, tabular numerals, and zero visual clutter so every decision is made with calm clarity.',
          },
          {
            title: '02. Mathematical Integrity',
            desc: 'Every balance, budget bar, and cash flow chart is synchronized to the underlying ledger in real time.',
          },
          {
            title: '03. Tactile Agency',
            desc: 'From 3D-flippable metal cards to instant CSV exports and 6-step wire confirmations, every control responds immediately.',
          },
        ].map((pillar, i) => (
          <div
            key={i}
            className="rounded-3xl p-7 bg-white dark:bg-[#141D2D] border border-[#080D18]/10 dark:border-[#F5F2EA]/10 space-y-3"
          >
            <h2 className="font-serif text-2xl font-semibold text-[#B39352] dark:text-[#D6B878]">
              {pillar.title}
            </h2>
            <p className="text-sm text-[#4A5568] dark:text-[#929DB0] leading-relaxed">
              {pillar.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Global Architectural Salons (Fictional Showcase) */}
      <div className="space-y-5">
        <h2 className="font-serif text-3xl font-semibold">
          Global Private Client Salons (Illustrative)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              city: 'Zurich',
              address: 'Bahnhofstrasse 42, 8001 Zürich',
              focus: 'Sovereign Treasury & Custody Desk',
            },
            {
              city: 'New York',
              address: '712 Fifth Avenue, Suite 3400',
              focus: 'North American Private Client Hub',
            },
            {
              city: 'London',
              address: '24 Mount Street, Mayfair',
              focus: 'Cross-Border Credit & Estate Desk',
            },
            {
              city: 'Tokyo',
              address: '1-8-1 Otemachi, Chiyoda-ku',
              focus: 'Asia-Pacific Liquidity & Aviation Desk',
            },
          ].map((salon, i) => (
            <div
              key={i}
              className="rounded-2xl p-6 bg-white dark:bg-[#141D2D] border border-[#080D18]/10 dark:border-[#F5F2EA]/10 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-serif text-2xl font-semibold">{salon.city}</span>
                <Building2 className="w-4 h-4 text-[#D6B878]" />
              </div>
              <p className="text-xs text-[#6E7A8E] dark:text-[#929DB0]">{salon.address}</p>
              <p className="text-[11px] font-mono text-[#B39352] dark:text-[#D6B878] pt-2">
                {salon.focus}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   10. /contact — CLIENT CONCIERGE & CONTACT PAGE
   ============================================================================ */
export const PublicContactPage: React.FC = () => {
  const { addToast } = useBanking();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: 'Private Client Onboarding (Demo)',
    salon: 'New York Private Salon',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) return;
    setSubmitted(true);
    addToast({
      title: 'Concierge Inquiry Logged (Simulated)',
      description: `Thank you, ${formData.name}. Your demo message was processed locally.`,
      variant: 'success',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5 space-y-6">
          <span className="text-xs font-mono uppercase tracking-[0.22em] text-[#B39352] dark:text-[#D6B878]">
            Client Concierge Desk
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold tracking-tight">
            Direct dialogue, 24 hours a day.
          </h1>
          <p className="text-sm text-[#4A5568] dark:text-[#929DB0] leading-relaxed">
            Reach our illustrative private client desks or dispatch a simulated inquiry using the
            interactive form.
          </p>

          <div className="space-y-3 pt-2">
            {[
              {
                icon: MapPin,
                label: 'New York Private Salon (Fictional)',
                val: '712 Fifth Avenue, Suite 3400, New York, NY',
              },
              {
                icon: MapPin,
                label: 'Zurich Treasury Desk (Fictional)',
                val: 'Bahnhofstrasse 42, 8001 Zürich, Switzerland',
              },
              {
                icon: Phone,
                label: '24/7 Client Line (Illustrative)',
                val: '+1 (212) 555-0199',
              },
              {
                icon: Mail,
                label: 'Concierge Dispatch',
                val: 'concierge@aurelion.demo',
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="flex items-start gap-3.5 p-4 rounded-2xl bg-white dark:bg-[#141D2D] border border-[#080D18]/10 dark:border-[#F5F2EA]/10"
                >
                  <Icon className="w-5 h-5 text-[#D6B878] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-[#6E7A8E] dark:text-[#929DB0]">{item.label}</p>
                    <p className="text-sm font-medium mt-0.5">{item.val}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="rounded-3xl p-8 sm:p-10 bg-white dark:bg-[#141D2D] border border-[#080D18]/10 dark:border-[#F5F2EA]/10 shadow-luxury-light dark:shadow-luxury">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#36C995]/20 text-[#36C995] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="font-serif text-3xl font-semibold">
                  Simulated Inquiry Received
                </h2>
                <p className="text-sm text-[#4A5568] dark:text-[#929DB0] max-w-md mx-auto">
                  Reference ID: <span className="font-mono text-[#D6B878]">ARL-CON-8821</span>. Your
                  message for <strong>{formData.salon}</strong> has been recorded in the local
                  demonstration session.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      name: '',
                      email: '',
                      topic: 'Private Client Onboarding (Demo)',
                      salon: 'New York Private Salon',
                      message: '',
                    });
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#D6B878] text-[#080D18] text-xs font-semibold"
                >
                  Send Another Demo Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className="font-serif text-2xl font-semibold">
                  Dispatch a Concierge Request (Demo)
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className="block text-xs font-medium mb-1.5">
                      Full Name (Fictional)
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Julian V. Sterling"
                      className="w-full px-4 py-3 rounded-xl bg-[#F5F2EA] dark:bg-[#0D1423] border border-current/15 text-sm focus:outline-none focus:border-[#D6B878]"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-medium mb-1.5">
                      Email Address (Demo)
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="j.sterling@example.demo"
                      className="w-full px-4 py-3 rounded-xl bg-[#F5F2EA] dark:bg-[#0D1423] border border-current/15 text-sm focus:outline-none focus:border-[#D6B878]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-topic" className="block text-xs font-medium mb-1.5">
                      Inquiry Subject
                    </label>
                    <select
                      id="contact-topic"
                      value={formData.topic}
                      onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#F5F2EA] dark:bg-[#0D1423] border border-current/15 text-sm focus:outline-none focus:border-[#D6B878]"
                    >
                      <option>Private Client Onboarding (Demo)</option>
                      <option>Signature Card Metal Allocation</option>
                      <option>Treasury & Vault Simulation</option>
                      <option>Technical & Accessibility Feedback</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="contact-salon" className="block text-xs font-medium mb-1.5">
                      Preferred Advisory Salon
                    </label>
                    <select
                      id="contact-salon"
                      value={formData.salon}
                      onChange={(e) => setFormData({ ...formData, salon: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#F5F2EA] dark:bg-[#0D1423] border border-current/15 text-sm focus:outline-none focus:border-[#D6B878]"
                    >
                      <option>New York Private Salon</option>
                      <option>Zurich Treasury Desk</option>
                      <option>London Mayfair Salon</option>
                      <option>Tokyo Otemachi Desk</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-xs font-medium mb-1.5">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    rows={3}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="How can our advisory desk assist you?"
                    className="w-full px-4 py-3 rounded-xl bg-[#F5F2EA] dark:bg-[#0D1423] border border-current/15 text-sm focus:outline-none focus:border-[#D6B878]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl bg-[#D6B878] hover:bg-[#E5CFA0] text-[#080D18] font-semibold text-sm transition-colors"
                >
                  Send Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
