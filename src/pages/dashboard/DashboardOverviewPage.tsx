import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useBanking } from '../../contexts/BankingContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { MONTHLY_HISTORY } from '../../data/mockBankingData';
import { AnimatedCurrency } from '../../components/ui/AnimatedCurrency';
import { InfoTooltip } from '../../components/ui/InfoTooltip';
import { PageSkeleton } from '../../components/ui/PageSkeleton';
import {
  Sparkline,
  RadialGauge,
  AllocationDonut,
} from '../../components/charts/VisualWidgets';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  ArrowUpRight,
  ArrowDownLeft,
  ArrowRightLeft,
  Eye,
  EyeOff,
  Calendar,
  Clock,
  RefreshCw,
  Pause,
  Play,
} from 'lucide-react';

const ACCOUNT_SPARK_SERIES: Record<string, number[]> = {
  'acc-checking-01': [68200, 71500, 74900, 79200, 81400, 84650],
  'acc-vault-02': [265000, 278000, 286000, 295000, 304000, 312400],
  'acc-treasury-03': [440000, 452000, 465000, 478000, 486000, 495000],
};

const DONUT_COLORS = ['#D6B878', '#36C995', '#6366F1', '#F4B860', '#929DB0', '#FF7777'];

export const DashboardOverviewPage: React.FC = () => {
  const {
    theme,
    accounts,
    transactions,
    budgets,
    goals,
    recurringPayments,
    profile,
    balancesMasked,
    toggleBalancesMasked,
    selectedAccountId,
    setSelectedAccountId,
    totalAvailableBalance,
    totalCurrentBalance,
    monthlyIncome,
    monthlyExpenses,
    netCashFlow,
    toggleRecurringPaymentStatus,
    addToast,
  } = useBanking();

  const [dateRange, setDateRange] = useState<'3M' | '6M'>('6M');
  const [chartType, setChartType] = useState<'area' | 'bar'>('area');
  const [budgetView, setBudgetView] = useState<'donut' | 'bars'>('donut');
  const [rightPanelTab, setRightPanelTab] = useState<'goals' | 'recurring'>('goals');
  const [isSyncing, setIsSyncing] = useState(false);

  const cur = profile.preferredCurrency;

  const filteredTransactions = useMemo(() => {
    if (selectedAccountId === 'all') return transactions.slice(0, 6);
    return transactions.filter((t) => t.accountId === selectedAccountId).slice(0, 6);
  }, [transactions, selectedAccountId]);

  const chartData = useMemo(() => {
    const base = dateRange === '3M' ? MONTHLY_HISTORY.slice(-3) : MONTHLY_HISTORY;
    return base.map((item, idx) =>
      idx === base.length - 1
        ? {
            ...item,
            income: monthlyIncome,
            expenses: monthlyExpenses,
            netCashFlow,
            totalBalance: totalAvailableBalance,
          }
        : item
    );
  }, [dateRange, monthlyIncome, monthlyExpenses, netCashFlow, totalAvailableBalance]);

  const totalGoalTarget = useMemo(
    () => goals.reduce((s, g) => s + g.targetAmount, 0),
    [goals]
  );
  const totalGoalSaved = useMemo(
    () => goals.reduce((s, g) => s + g.currentAmount, 0),
    [goals]
  );
  const overallGoalPercent =
    totalGoalTarget > 0 ? Math.round((totalGoalSaved / totalGoalTarget) * 100) : 0;

  const budgetDonutData = useMemo(
    () =>
      budgets.map((b, idx) => ({
        name: b.category,
        value: Math.max(100, b.spent),
        color: DONUT_COLORS[idx % DONUT_COLORS.length],
      })),
    [budgets]
  );

  const handleSimulatedSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      addToast({
        title: 'Ledger Telemetry Synchronized',
        description: 'All synthetic accounts, budgets, and analytics verified.',
        variant: 'success',
      });
    }, 500);
  };

  if (isSyncing) {
    return <PageSkeleton variant="dashboard" />;
  }

  return (
    <div className="space-y-7 pb-12 animate-in fade-in duration-300">
      {/* Top Greeting & Executive Toolbar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[#B39352] dark:text-[#D6B878]">
            <Calendar className="w-3.5 h-3.5" />
            <span>October 29, 2026 • Interactive Demo Session</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold mt-1">
            Good morning, {profile.fullName.split(' ')[0]}.
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleSimulatedSync}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-medium bg-white dark:bg-[#141D2D] border border-current/15 hover:border-[#D6B878] transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#D6B878]" />
            <span>Sync</span>
          </button>

          <button
            type="button"
            onClick={toggleBalancesMasked}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium bg-white dark:bg-[#141D2D] border border-current/15 hover:border-[#D6B878] transition-colors"
          >
            {balancesMasked ? (
              <EyeOff className="w-4 h-4 text-[#D6B878]" />
            ) : (
              <Eye className="w-4 h-4 text-[#D6B878]" />
            )}
            <span>{balancesMasked ? 'Reveal' : 'Mask'}</span>
          </button>

          <Link
            to="/dashboard/transfers"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#D6B878] hover:bg-[#E5CFA0] text-[#080D18] transition-colors shadow-sm"
          >
            <ArrowRightLeft className="w-4 h-4" />
            <span>New Transfer</span>
          </Link>
        </div>
      </div>

      {/* Primary KPI Strip with Visual Sparklines & Radial Gauge */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Available Liquidity */}
        <div className="sm:col-span-2 lg:col-span-2 rounded-2xl p-6 bg-[#0D1423] text-[#F5F2EA] border border-[#D6B878]/35 shadow-luxury flex items-center justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-[0.18em] text-[#D6B878] inline-flex items-center">
              Total Available Liquidity
              <InfoTooltip content="Combined available liquidity across Checking, Reserve Vault, and Treasury." />
            </span>
            <AnimatedCurrency
              amountUSD={totalAvailableBalance}
              masked={balancesMasked}
              currency={cur}
              className="font-mono text-3xl sm:text-4xl font-semibold tracking-tight block"
            />
            <span className="text-xs text-[#929DB0] block font-mono">
              Ledger:{' '}
              <AnimatedCurrency
                amountUSD={totalCurrentBalance}
                masked={balancesMasked}
                currency={cur}
              />
            </span>
          </div>
          <div className="w-28 shrink-0 hidden sm:block">
            <Sparkline data={[812, 830, 848, 868, 871, 892]} color="#D6B878" height={52} />
            <span className="block text-right text-[10px] font-mono text-[#36C995] mt-1">
              +4.6% MoM
            </span>
          </div>
        </div>

        {/* Monthly Income */}
        <div className="rounded-2xl p-5 bg-white dark:bg-[#141D2D] border border-[#080D18]/10 dark:border-[#F5F2EA]/10 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-[#6E7A8E] dark:text-[#929DB0]">
              Inflow (Oct)
            </span>
            <ArrowDownLeft className="w-4 h-4 text-[#36C995]" />
          </div>
          <AnimatedCurrency
            amountUSD={monthlyIncome}
            masked={balancesMasked}
            showSign
            currency={cur}
            className="font-mono text-xl sm:text-2xl font-semibold text-[#36C995] my-1"
          />
          <Sparkline data={[36.2, 39.5, 37.8, 42.1, 38.9, 41.4]} color="#36C995" height={24} />
        </div>

        {/* Monthly Expenses */}
        <div className="rounded-2xl p-5 bg-white dark:bg-[#141D2D] border border-[#080D18]/10 dark:border-[#F5F2EA]/10 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-[#6E7A8E] dark:text-[#929DB0]">
              Outflow (Oct)
            </span>
            <ArrowUpRight className="w-4 h-4 text-[#D6B878]" />
          </div>
          <AnimatedCurrency
            amountUSD={monthlyExpenses}
            masked={balancesMasked}
            currency={cur}
            className="font-mono text-xl sm:text-2xl font-semibold my-1"
          />
          <Sparkline data={[18.4, 21.1, 19.2, 22.8, 19.4, 21.05]} color="#D6B878" height={24} />
        </div>

        {/* Net Cash Flow + Goal Radial Gauge */}
        <div className="rounded-2xl p-5 bg-white dark:bg-[#141D2D] border border-[#080D18]/10 dark:border-[#F5F2EA]/10 flex items-center justify-between gap-2">
          <div>
            <span className="text-xs uppercase tracking-wider text-[#6E7A8E] dark:text-[#929DB0] block">
              Net Retained
            </span>
            <AnimatedCurrency
              amountUSD={netCashFlow}
              masked={balancesMasked}
              showSign
              compact
              currency={cur}
              className="font-mono text-xl font-semibold text-[#36C995] mt-1 block"
            />
            <span className="text-[10px] font-mono text-[#6E7A8E] dark:text-[#929DB0] mt-1 block">
              Goals Funded
            </span>
          </div>
          <RadialGauge
            percent={overallGoalPercent}
            size={64}
            strokeWidth={6}
            color="#36C995"
            label={`${overallGoalPercent}%`}
          />
        </div>
      </div>

      {/* Individual Accounts Strip with Live Sparklines */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {accounts.map((acc) => {
          const isSelected = selectedAccountId === acc.id;
          const spark = ACCOUNT_SPARK_SERIES[acc.id] || [70, 75, 80, 85];
          return (
            <div
              key={acc.id}
              onClick={() => setSelectedAccountId(isSelected ? 'all' : acc.id)}
              className={`cursor-pointer rounded-2xl p-5 border transition-all ${
                isSelected
                  ? 'bg-[#D6B878]/10 border-[#D6B878] shadow-sm'
                  : 'bg-white dark:bg-[#141D2D] border-[#080D18]/10 dark:border-[#F5F2EA]/10 hover:border-[#D6B878]/50'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#B39352] dark:text-[#D6B878]">
                    {acc.type}
                  </span>
                  <h2 className="text-sm font-semibold mt-0.5">{acc.name}</h2>
                </div>
                <span className="font-mono text-xs text-[#36C995]">+{acc.monthlyChangePercent}%</span>
              </div>

              <div className="mt-4 flex items-end justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#6E7A8E] dark:text-[#929DB0] block">
                    Available
                  </span>
                  <AnimatedCurrency
                    amountUSD={acc.availableBalance}
                    masked={balancesMasked}
                    currency={cur}
                    className="font-mono text-xl font-semibold"
                  />
                </div>
                <div className="w-24">
                  <Sparkline data={spark} color={acc.colorAccent || '#D6B878'} height={30} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Chart + Interactive Spend Donut / Bars Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Cash Flow & Balance Chart (7 Cols) */}
        <div className="lg:col-span-7 rounded-3xl p-6 bg-white dark:bg-[#141D2D] border border-[#080D18]/10 dark:border-[#F5F2EA]/10 flex flex-col justify-between space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-serif text-2xl font-semibold">
              Liquidity & Cash Flow Curve
            </h2>

            <div className="flex items-center gap-2">
              <div className="inline-flex rounded-xl bg-[#F5F2EA] dark:bg-[#0D1423] p-1 border border-current/10 text-xs">
                <button
                  type="button"
                  onClick={() => setChartType('area')}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                    chartType === 'area'
                      ? 'bg-[#D6B878] text-[#080D18] font-semibold'
                      : 'text-[#6E7A8E] dark:text-[#929DB0]'
                  }`}
                >
                  Curve
                </button>
                <button
                  type="button"
                  onClick={() => setChartType('bar')}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                    chartType === 'bar'
                      ? 'bg-[#D6B878] text-[#080D18] font-semibold'
                      : 'text-[#6E7A8E] dark:text-[#929DB0]'
                  }`}
                >
                  Bars
                </button>
              </div>

              <div className="inline-flex rounded-xl bg-[#F5F2EA] dark:bg-[#0D1423] p-1 border border-current/10 text-xs font-mono">
                {(['3M', '6M'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setDateRange(r)}
                    className={`px-2.5 py-1 rounded-lg ${
                      dateRange === r
                        ? 'bg-[#080D18] dark:bg-[#1B273D] text-[#F5F2EA] font-semibold'
                        : 'text-[#6E7A8E] dark:text-[#929DB0]'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div
            className="h-[260px] w-full"
            role="region"
            aria-label="Portfolio liquidity and cash flow chart"
          >
            {chartType === 'area' ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="dashGoldArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D6B878" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#D6B878" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(146,157,176,0.12)" vertical={false} />
                  <XAxis dataKey="month" stroke="#929DB0" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis
                    stroke="#929DB0"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    domain={['dataMin - 25000', 'dataMax + 15000']}
                    tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0D1423',
                      borderColor: 'rgba(214, 184, 120, 0.35)',
                      borderRadius: '12px',
                      color: '#F5F2EA',
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '12px',
                    }}
                    formatter={(val: number) => [
                      formatCurrency(val, { masked: balancesMasked, currency: cur }),
                      'Portfolio Liquidity',
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="totalBalance"
                    stroke="#D6B878"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#dashGoldArea)"
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barGap={6}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(146,157,176,0.12)" vertical={false} />
                  <XAxis dataKey="month" stroke="#929DB0" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis
                    stroke="#929DB0"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `$${v / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0D1423',
                      borderColor: 'rgba(214, 184, 120, 0.35)',
                      borderRadius: '12px',
                      color: '#F5F2EA',
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '12px',
                    }}
                    formatter={(val: number, name: string) => [
                      formatCurrency(val, { masked: balancesMasked, currency: cur }),
                      name === 'income' ? 'Monthly Inflow' : 'Monthly Outflow',
                    ]}
                  />
                  <Bar dataKey="income" fill="#36C995" radius={[6, 6, 0, 0]} isAnimationActive={false} />
                  <Bar dataKey="expenses" fill="#D6B878" radius={[6, 6, 0, 0]} isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Category Spend Donut & Budget Status (5 Cols) */}
        <div className="lg:col-span-5 rounded-3xl p-6 bg-white dark:bg-[#141D2D] border border-[#080D18]/10 dark:border-[#F5F2EA]/10 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-semibold">Category Allocation</h2>
            <div className="inline-flex rounded-xl bg-[#F5F2EA] dark:bg-[#0D1423] p-1 border border-current/10 text-xs">
              <button
                type="button"
                onClick={() => setBudgetView('donut')}
                className={`px-2.5 py-1 rounded-lg font-medium ${
                  budgetView === 'donut'
                    ? 'bg-[#D6B878] text-[#080D18] font-semibold'
                    : 'text-[#6E7A8E] dark:text-[#929DB0]'
                }`}
              >
                Donut
              </button>
              <button
                type="button"
                onClick={() => setBudgetView('bars')}
                className={`px-2.5 py-1 rounded-lg font-medium ${
                  budgetView === 'bars'
                    ? 'bg-[#D6B878] text-[#080D18] font-semibold'
                    : 'text-[#6E7A8E] dark:text-[#929DB0]'
                }`}
              >
                Limits
              </button>
            </div>
          </div>

          {budgetView === 'donut' ? (
            <AllocationDonut
              data={budgetDonutData}
              centerTitle="Oct Spend"
              centerValue={formatCurrency(monthlyExpenses, {
                masked: balancesMasked,
                compact: true,
                currency: cur,
              })}
              height={220}
            />
          ) : (
            <div className="space-y-3.5 py-2">
              {budgets.slice(0, 5).map((b) => {
                const pct = Math.min(100, Math.round((b.spent / b.monthlyLimit) * 100));
                const isHigh = pct >= b.alertThresholdPercent;
                return (
                  <div key={b.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium truncate">{b.category}</span>
                      <span className="font-mono tabular-nums text-[#6E7A8E] dark:text-[#929DB0]">
                        <strong className="text-[#080D18] dark:text-[#F5F2EA]">
                          {formatCurrency(b.spent, { masked: balancesMasked, decimals: 0, currency: cur })}
                        </strong>{' '}
                        / {formatCurrency(b.monthlyLimit, { masked: balancesMasked, decimals: 0, currency: cur })}
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#F5F2EA] dark:bg-[#0D1423] overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          pct >= 100
                            ? 'bg-[#FF7777]'
                            : isHigh
                            ? 'bg-[#D6B878]'
                            : 'bg-[#36C995]'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-current/10 text-xs">
            <Link to="/dashboard/budgets" className="text-[#B39352] dark:text-[#D6B878] font-semibold hover:underline">
              Configure Budgets →
            </Link>
            <Link to="/dashboard/analytics" className="text-[#6E7A8E] dark:text-[#929DB0] hover:underline">
              Full Telemetry →
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Transactions, Capital Goals Rings, & Recurring Commitments */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Transactions (7 Cols) */}
        <div className="lg:col-span-7 rounded-3xl p-6 bg-white dark:bg-[#141D2D] border border-[#080D18]/10 dark:border-[#F5F2EA]/10 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-semibold">Recent Ledger Activity</h2>
            <Link
              to="/dashboard/transactions"
              className="text-xs font-semibold text-[#B39352] dark:text-[#D6B878] hover:underline"
            >
              Full Ledger & CSV →
            </Link>
          </div>

          <div className="divide-y divide-[#080D18]/10 dark:divide-[#F5F2EA]/10">
            {filteredTransactions.map((t) => (
              <div
                key={t.id}
                className="py-3 flex items-center justify-between gap-4 hover:bg-current/[0.02] px-2 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      t.status === 'Declined'
                        ? 'bg-[#FF7777]/15 text-[#FF7777]'
                        : t.amount > 0
                        ? 'bg-[#36C995]/15 text-[#36C995]'
                        : 'bg-[#D6B878]/15 text-[#B39352] dark:text-[#D6B878]'
                    }`}
                  >
                    {t.amount > 0 ? (
                      <ArrowDownLeft className="w-4 h-4" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold truncate">{t.merchant}</p>
                      {t.status !== 'Completed' && (
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                            t.status === 'Pending'
                              ? 'bg-[#D6B878]/20 text-[#D6B878]'
                              : 'bg-[#FF7777]/20 text-[#FF7777]'
                          }`}
                        >
                          {t.status}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#6E7A8E] dark:text-[#929DB0] truncate">
                      {formatDate(t.date)} • {t.category}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <AnimatedCurrency
                    amountUSD={t.amount}
                    masked={balancesMasked}
                    showSign
                    currency={cur}
                    className={`font-mono text-sm font-semibold block ${
                      t.status === 'Declined'
                        ? 'line-through text-[#FF7777]'
                        : t.amount > 0
                        ? 'text-[#36C995]'
                        : ''
                    }`}
                  />
                  <span className="text-[10px] text-[#6E7A8E] dark:text-[#929DB0] block">
                    {t.accountName.split(' ')[0]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 5 Cols: Progressive Disclosure Tabbed Card (Capital Goals | Recurring) */}
        <div className="lg:col-span-5 rounded-3xl p-6 bg-white dark:bg-[#141D2D] border border-[#080D18]/10 dark:border-[#F5F2EA]/10 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="inline-flex rounded-xl bg-[#F5F2EA] dark:bg-[#0D1423] p-1 border border-current/10 text-xs">
              <button
                type="button"
                onClick={() => setRightPanelTab('goals')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  rightPanelTab === 'goals'
                    ? 'bg-[#D6B878] text-[#080D18] font-semibold'
                    : 'text-[#6E7A8E] dark:text-[#929DB0]'
                }`}
              >
                Goals ({goals.length})
              </button>
              <button
                type="button"
                onClick={() => setRightPanelTab('recurring')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  rightPanelTab === 'recurring'
                    ? 'bg-[#D6B878] text-[#080D18] font-semibold'
                    : 'text-[#6E7A8E] dark:text-[#929DB0]'
                }`}
              >
                Recurring ({recurringPayments.length})
              </button>
            </div>

            {rightPanelTab === 'goals' ? (
              <Link
                to="/dashboard/budgets"
                className="text-xs font-semibold text-[#B39352] dark:text-[#D6B878] hover:underline"
              >
                Manage →
              </Link>
            ) : (
              <Clock className="w-4 h-4 text-[#D6B878]" />
            )}
          </div>

          {rightPanelTab === 'goals' ? (
            <div className="space-y-3">
              {goals.map((g) => {
                const pct = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100));
                return (
                  <div
                    key={g.id}
                    className="p-3.5 rounded-2xl bg-[#F5F2EA] dark:bg-[#0D1423] flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-semibold truncate">{g.name}</p>
                      <p className="text-xs font-mono text-[#6E7A8E] dark:text-[#929DB0] tabular-nums mt-1">
                        {formatCurrency(g.currentAmount, {
                          masked: balancesMasked,
                          decimals: 0,
                          currency: cur,
                        })}{' '}
                        /{' '}
                        {formatCurrency(g.targetAmount, {
                          masked: balancesMasked,
                          decimals: 0,
                          currency: cur,
                        })}
                      </p>
                    </div>
                    <RadialGauge
                      percent={pct}
                      size={52}
                      strokeWidth={5}
                      color="#D6B878"
                      label={`${pct}%`}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-2.5">
              {recurringPayments.map((rec) => {
                const isPaused = rec.status === 'Paused';
                return (
                  <div
                    key={rec.id}
                    className={`p-3 rounded-xl bg-[#F5F2EA] dark:bg-[#0D1423] flex items-center justify-between gap-2 text-xs transition-opacity ${
                      isPaused ? 'opacity-60' : ''
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="font-semibold truncate">{rec.merchant}</p>
                      <p className="text-[11px] text-[#6E7A8E] dark:text-[#929DB0]">
                        {formatDate(rec.nextDate)} • {rec.status}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-mono font-semibold tabular-nums">
                        {formatCurrency(rec.amount, { masked: balancesMasked, currency: cur })}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleRecurringPaymentStatus(rec.id)}
                        className="p-1.5 rounded-lg border border-current/15 hover:border-[#D6B878] transition-colors"
                        title={isPaused ? 'Resume recurring payment' : 'Pause recurring payment'}
                      >
                        {isPaused ? (
                          <Play className="w-3 h-3 text-[#36C995]" />
                        ) : (
                          <Pause className="w-3 h-3 text-[#D6B878]" />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
