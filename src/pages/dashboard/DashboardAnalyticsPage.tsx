import React, { useMemo, useState } from 'react';
import { useBanking } from '../../contexts/BankingContext';
import { MONTHLY_HISTORY } from '../../data/mockBankingData';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { AnimatedCurrency } from '../../components/ui/AnimatedCurrency';
import { RadialGauge, AllocationDonut } from '../../components/charts/VisualWidgets';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  Table,
  LineChart as LineChartIcon,
  BarChart3,
  Activity,
  Filter,
  Check,
} from 'lucide-react';

export const DashboardAnalyticsPage: React.FC = () => {
  const {
    theme,
    transactions,
    budgets,
    monthlyIncome,
    monthlyExpenses,
    netCashFlow,
    totalAvailableBalance,
    balancesMasked,
    profile,
  } = useBanking();

  const [showAccessibleTable, setShowAccessibleTable] = useState(false);
  const [selectedCategoryDrilldown, setSelectedCategoryDrilldown] = useState<string | null>(null);
  const [chartType, setChartType] = useState<'line' | 'bar' | 'area'>('line');
  const [timeWindow, setTimeWindow] = useState<'3M' | '6M'>('6M');
  const [visibleSeries, setVisibleSeries] = useState<{
    income: boolean;
    expenses: boolean;
    netCashFlow: boolean;
  }>({
    income: true,
    expenses: true,
    netCashFlow: true,
  });

  const cur = profile.preferredCurrency;

  const toggleSeries = (key: 'income' | 'expenses' | 'netCashFlow') => {
    setVisibleSeries((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      // Ensure at least one series remains visible
      if (!next.income && !next.expenses && !next.netCashFlow) {
        return prev;
      }
      return next;
    });
  };

  const savingsRate = useMemo(() => {
    if (monthlyIncome <= 0) return 0;
    return Number(((netCashFlow / monthlyIncome) * 100).toFixed(1));
  }, [monthlyIncome, netCashFlow]);

  // Synchronized Monthly History
  const syncedHistory = useMemo(() => {
    const full = MONTHLY_HISTORY.map((m, idx) =>
      idx === MONTHLY_HISTORY.length - 1
        ? {
            ...m,
            income: monthlyIncome,
            expenses: monthlyExpenses,
            savings: netCashFlow,
            netCashFlow,
            totalBalance: totalAvailableBalance,
          }
        : m
    );
    return timeWindow === '3M' ? full.slice(-3) : full;
  }, [monthlyIncome, monthlyExpenses, netCashFlow, totalAvailableBalance, timeWindow]);

  const [selectedMonth, setSelectedMonth] = useState<string>('Oct');

  const inspectedMonthData = useMemo(() => {
    return (
      syncedHistory.find((m) => m.month === selectedMonth) ||
      syncedHistory[syncedHistory.length - 1]
    );
  }, [syncedHistory, selectedMonth]);

  // Month-over-Month Comparison (Oct vs Sep)
  const sepMetric = MONTHLY_HISTORY[MONTHLY_HISTORY.length - 2];
  const octMetric = syncedHistory[syncedHistory.length - 1];
  const incomeMoM = (((octMetric.income - sepMetric.income) / sepMetric.income) * 100).toFixed(1);
  const expenseMoM = (
    ((octMetric.expenses - sepMetric.expenses) / sepMetric.expenses) *
    100
  ).toFixed(1);

  // Category Breakdown derived strictly from transactions
  const categoryBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    transactions
      .filter((t) => t.amount < 0 && t.status !== 'Declined' && t.type !== 'Internal Transfer')
      .forEach((t) => {
        map[t.category] = (map[t.category] || 0) + Math.abs(t.amount);
      });
    const palette = ['#D6B878', '#36C995', '#6395F2', '#E59866', '#A569BD', '#FF7777'];
    return Object.entries(map)
      .map(([category, amount], i) => ({
        category,
        amount,
        share: monthlyExpenses > 0 ? Math.round((amount / monthlyExpenses) * 100) : 0,
        color: palette[i % palette.length],
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions, monthlyExpenses]);

  const donutData = useMemo(
    () =>
      categoryBreakdown.map((c) => ({
        name: c.category.split(' ')[0],
        value: c.amount,
        color: c.color,
      })),
    [categoryBreakdown]
  );

  // Largest Outgoing Expenses (optionally filtered by category drilldown)
  const largestExpenses = useMemo(() => {
    return transactions
      .filter(
        (t) =>
          t.amount < 0 &&
          t.status !== 'Declined' &&
          t.type !== 'Internal Transfer' &&
          (!selectedCategoryDrilldown || t.category === selectedCategoryDrilldown)
      )
      .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))
      .slice(0, 5);
  }, [transactions, selectedCategoryDrilldown]);

  // Merchant-Level Breakdown
  const merchantBreakdown = useMemo(() => {
    const map: Record<string, { count: number; total: number; category: string }> = {};
    transactions
      .filter(
        (t) =>
          t.amount < 0 &&
          t.status !== 'Declined' &&
          t.type !== 'Internal Transfer' &&
          (!selectedCategoryDrilldown || t.category === selectedCategoryDrilldown)
      )
      .forEach((t) => {
        if (!map[t.merchant]) {
          map[t.merchant] = { count: 0, total: 0, category: t.category };
        }
        map[t.merchant].count += 1;
        map[t.merchant].total += Math.abs(t.amount);
      });
    return Object.entries(map)
      .map(([merchant, data]) => ({ merchant, ...data }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 6);
  }, [transactions, selectedCategoryDrilldown]);

  const totalBudgetAllocated = useMemo(
    () => budgets.reduce((s, b) => s + b.monthlyLimit, 0),
    [budgets]
  );
  const totalBudgetSpent = useMemo(
    () => budgets.reduce((s, b) => s + b.spent, 0),
    [budgets]
  );
  const adherenceRate =
    totalBudgetAllocated > 0
      ? Math.max(
          0,
          Math.round(((totalBudgetAllocated - totalBudgetSpent) / totalBudgetAllocated) * 100)
        )
      : 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#B39352] dark:text-[#D6B878]">
            Quantitative Portfolio Telemetry
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold mt-1">
            Financial Analytics & Cash Flow Intelligence
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setShowAccessibleTable((p) => !p)}
          aria-pressed={showAccessibleTable}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium bg-white dark:bg-[#141D2D] border border-current/15 hover:border-[#D6B878] transition-colors"
        >
          <Table className="w-4 h-4 text-[#D6B878]" />
          <span>
            {showAccessibleTable ? 'Hide Accessible Data Table' : 'View Tabular Chart Summary'}
          </span>
        </button>
      </div>

      {/* Top 4 Executive Analytical KPIs with Radial Gauges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl p-5 bg-white dark:bg-[#141D2D] border border-[#080D18]/10 dark:border-[#F5F2EA]/10 flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-[#6E7A8E] dark:text-[#929DB0] block">
              Net Savings Rate
            </span>
            <span className="font-mono text-2xl sm:text-3xl font-semibold text-[#36C995] tabular-nums mt-1.5 block">
              {savingsRate}%
            </span>
            <span className="text-xs text-[#6E7A8E] dark:text-[#929DB0] mt-1 block">
              <AnimatedCurrency
                amountUSD={netCashFlow}
                masked={balancesMasked}
                showSign
                currency={cur}
              />{' '}
              retained
            </span>
          </div>
          <RadialGauge value={savingsRate} size={60} strokeWidth={6} color="#36C995" />
        </div>

        <div className="rounded-2xl p-5 bg-white dark:bg-[#141D2D] border border-[#080D18]/10 dark:border-[#F5F2EA]/10">
          <span className="text-xs uppercase tracking-wider text-[#6E7A8E] dark:text-[#929DB0] block">
            Income MoM Comparison
          </span>
          <span className="font-mono text-2xl sm:text-3xl font-semibold text-[#D6B878] tabular-nums mt-1.5 block">
            +{incomeMoM}%
          </span>
          <span className="text-xs text-[#6E7A8E] dark:text-[#929DB0] mt-1 block">
            vs. {formatCurrency(sepMetric.income, { masked: balancesMasked, decimals: 0, currency: cur })} in Sep
          </span>
        </div>

        <div className="rounded-2xl p-5 bg-white dark:bg-[#141D2D] border border-[#080D18]/10 dark:border-[#F5F2EA]/10">
          <span className="text-xs uppercase tracking-wider text-[#6E7A8E] dark:text-[#929DB0] block">
            Expense MoM Delta
          </span>
          <span className="font-mono text-2xl sm:text-3xl font-semibold tabular-nums mt-1.5 block">
            {Number(expenseMoM) > 0 ? `+${expenseMoM}%` : `${expenseMoM}%`}
          </span>
          <span className="text-xs text-[#6E7A8E] dark:text-[#929DB0] mt-1 block">
            vs. {formatCurrency(sepMetric.expenses, { masked: balancesMasked, decimals: 0, currency: cur })} in Sep
          </span>
        </div>

        <div className="rounded-2xl p-5 bg-white dark:bg-[#141D2D] border border-[#080D18]/10 dark:border-[#F5F2EA]/10 flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-[#6E7A8E] dark:text-[#929DB0] block">
              Budget Headroom
            </span>
            <span className="font-mono text-2xl sm:text-3xl font-semibold text-[#36C995] tabular-nums mt-1.5 block">
              {adherenceRate}%
            </span>
            <span className="text-xs text-[#6E7A8E] dark:text-[#929DB0] mt-1 block">
              {budgets.length} tracked guardrails
            </span>
          </div>
          <RadialGauge value={adherenceRate} size={60} strokeWidth={6} color="#D6B878" />
        </div>
      </div>

      {/* Screen-Reader-Friendly & Tabular Chart Summary (WCAG 2.2 AA) */}
      {showAccessibleTable && (
        <div
          className="rounded-3xl p-6 bg-white dark:bg-[#141D2D] border border-[#D6B878]/40 overflow-x-auto"
          role="region"
          aria-label="Accessible Financial Summary Table"
        >
          <h2 className="font-serif text-xl font-semibold mb-3">
            Tabular Telemetry Summary ({timeWindow} Window)
          </h2>
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="border-b border-current/15 text-[#6E7A8E] dark:text-[#929DB0] uppercase">
                <th className="py-2.5 px-3">Month</th>
                <th className="py-2.5 px-3">Monthly Income</th>
                <th className="py-2.5 px-3">Monthly Expenses</th>
                <th className="py-2.5 px-3">Net Cash Flow</th>
                <th className="py-2.5 px-3">Portfolio Liquidity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-current/10">
              {syncedHistory.map((row) => (
                <tr key={row.month}>
                  <td className="py-2.5 px-3 font-semibold">{row.month} 2026</td>
                  <td className="py-2.5 px-3 text-[#36C995]">
                    {formatCurrency(row.income, { masked: balancesMasked, currency: cur })}
                  </td>
                  <td className="py-2.5 px-3">
                    {formatCurrency(row.expenses, { masked: balancesMasked, currency: cur })}
                  </td>
                  <td className="py-2.5 px-3 text-[#D6B878]">
                    {formatCurrency(row.netCashFlow, {
                      masked: balancesMasked,
                      showSign: true,
                      currency: cur,
                    })}
                  </td>
                  <td className="py-2.5 px-3 font-semibold">
                    {formatCurrency(row.totalBalance, { masked: balancesMasked, currency: cur })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Charts Row: Interactive Multi-Series Chart + Category Donut & Drilldown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 rounded-3xl p-6 bg-white dark:bg-[#141D2D] border border-[#080D18]/10 dark:border-[#F5F2EA]/10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-semibold">
                Income, Expense & Net Cash Flow
              </h2>
              <p className="text-xs text-[#6E7A8E] dark:text-[#929DB0]">
                Toggle series legends or switch chart mode • Click a month pill below to inspect
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Time Window Toggle */}
              <div className="inline-flex rounded-xl p-0.5 bg-[#F5F2EA] dark:bg-[#0D1423] border border-current/10">
                {(['3M', '6M'] as const).map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setTimeWindow(w)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                      timeWindow === w
                        ? 'bg-[#D6B878] text-[#080D18]'
                        : 'text-[#6E7A8E] dark:text-[#929DB0]'
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>

              {/* Chart Mode Switcher */}
              <div className="inline-flex rounded-xl p-0.5 bg-[#F5F2EA] dark:bg-[#0D1423] border border-current/10">
                {[
                  { id: 'line' as const, label: 'Line', icon: LineChartIcon },
                  { id: 'bar' as const, label: 'Bar', icon: BarChart3 },
                  { id: 'area' as const, label: 'Area', icon: Activity },
                ].map((mode) => {
                  const Icon = mode.icon;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setChartType(mode.id)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                        chartType === mode.id
                          ? 'bg-[#D6B878] text-[#080D18] font-semibold'
                          : 'text-[#6E7A8E] dark:text-[#929DB0]'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{mode.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Interactive Legend Series Toggles */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {[
              { key: 'income' as const, label: 'Monthly Income', color: '#36C995' },
              { key: 'expenses' as const, label: 'Monthly Expenses', color: '#D6B878' },
              { key: 'netCashFlow' as const, label: 'Net Retained Cash', color: '#6395F2' },
            ].map((s) => {
              const active = visibleSeries[s.key];
              return (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => toggleSeries(s.key)}
                  aria-pressed={active}
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                    active
                      ? 'bg-[#F5F2EA] dark:bg-[#0D1423] border-current/20 opacity-100'
                      : 'border-current/10 opacity-40'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: s.color }}
                  >
                    {active && <Check className="w-2 h-2 text-[#080D18]" />}
                  </span>
                  <span>{s.label}</span>
                </button>
              );
            })}
          </div>

          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'bar' ? (
                <BarChart data={syncedHistory} barGap={6}>
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
                    formatter={(v: number, name: string) => [
                      formatCurrency(v, { masked: balancesMasked, currency: cur }),
                      name === 'income'
                        ? 'Monthly Income'
                        : name === 'expenses'
                        ? 'Monthly Expenses'
                        : 'Net Cash Flow',
                    ]}
                  />
                  {visibleSeries.income && (
                    <Bar dataKey="income" fill="#36C995" radius={[6, 6, 0, 0]} maxBarSize={28} isAnimationActive={false} />
                  )}
                  {visibleSeries.expenses && (
                    <Bar dataKey="expenses" fill="#D6B878" radius={[6, 6, 0, 0]} maxBarSize={28} isAnimationActive={false} />
                  )}
                  {visibleSeries.netCashFlow && (
                    <Bar dataKey="netCashFlow" fill="#6395F2" radius={[6, 6, 0, 0]} maxBarSize={28} isAnimationActive={false} />
                  )}
                </BarChart>
              ) : chartType === 'area' ? (
                <AreaChart data={syncedHistory}>
                  <defs>
                    <linearGradient id="anaIncGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#36C995" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#36C995" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="anaExpGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D6B878" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#D6B878" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
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
                    formatter={(v: number, name: string) => [
                      formatCurrency(v, { masked: balancesMasked, currency: cur }),
                      name === 'income'
                        ? 'Monthly Income'
                        : name === 'expenses'
                        ? 'Monthly Expenses'
                        : 'Net Cash Flow',
                    ]}
                  />
                  {visibleSeries.income && (
                    <Area type="monotone" dataKey="income" stroke="#36C995" strokeWidth={2.5} fill="url(#anaIncGrad)" isAnimationActive={false} />
                  )}
                  {visibleSeries.expenses && (
                    <Area type="monotone" dataKey="expenses" stroke="#D6B878" strokeWidth={2.5} fill="url(#anaExpGrad)" isAnimationActive={false} />
                  )}
                  {visibleSeries.netCashFlow && (
                    <Area type="monotone" dataKey="netCashFlow" stroke="#6395F2" strokeWidth={2} fillOpacity={0} isAnimationActive={false} />
                  )}
                </AreaChart>
              ) : (
                <LineChart data={syncedHistory}>
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
                    formatter={(v: number, name: string) => [
                      formatCurrency(v, { masked: balancesMasked, currency: cur }),
                      name === 'income'
                        ? 'Monthly Income'
                        : name === 'expenses'
                        ? 'Monthly Expenses'
                        : 'Net Cash Flow',
                    ]}
                  />
                  {visibleSeries.income && (
                    <Line type="monotone" dataKey="income" stroke="#36C995" strokeWidth={2.5} dot={{ r: 4 }} isAnimationActive={false} />
                  )}
                  {visibleSeries.expenses && (
                    <Line type="monotone" dataKey="expenses" stroke="#D6B878" strokeWidth={2.5} dot={{ r: 4 }} isAnimationActive={false} />
                  )}
                  {visibleSeries.netCashFlow && (
                    <Line type="monotone" dataKey="netCashFlow" stroke="#6395F2" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3 }} isAnimationActive={false} />
                  )}
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Clickable Month Inspector Bar */}
          <div className="pt-2 border-t border-current/10 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#6E7A8E] dark:text-[#929DB0] mr-1">
                Inspect Month:
              </span>
              {syncedHistory.map((m) => (
                <button
                  key={m.month}
                  type="button"
                  onClick={() => setSelectedMonth(m.month)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                    inspectedMonthData.month === m.month
                      ? 'bg-[#D6B878] text-[#080D18] font-semibold'
                      : 'bg-[#F5F2EA] dark:bg-[#0D1423] text-[#6E7A8E] dark:text-[#929DB0]'
                  }`}
                >
                  {m.month}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="text-[#36C995]">
                In: {formatCurrency(inspectedMonthData.income, { masked: balancesMasked, decimals: 0, currency: cur })}
              </span>
              <span className="text-[#D6B878]">
                Out: {formatCurrency(inspectedMonthData.expenses, { masked: balancesMasked, decimals: 0, currency: cur })}
              </span>
              <span className="text-[#6395F2] font-semibold">
                Net: {formatCurrency(inspectedMonthData.netCashFlow, { masked: balancesMasked, showSign: true, decimals: 0, currency: cur })}
              </span>
            </div>
          </div>
        </div>

        {/* Category Share Distribution with Donut + Interactive Drilldown (5 Cols) */}
        <div className="lg:col-span-5 rounded-3xl p-6 bg-white dark:bg-[#141D2D] border border-[#080D18]/10 dark:border-[#F5F2EA]/10 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-semibold">Spending by Category</h2>
              <p className="text-xs text-[#6E7A8E] dark:text-[#929DB0]">
                Click any category below to filter ledger tables
              </p>
            </div>
            {selectedCategoryDrilldown && (
              <button
                type="button"
                onClick={() => setSelectedCategoryDrilldown(null)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#D6B878]/15 text-xs font-mono text-[#D6B878] hover:bg-[#D6B878]/25"
              >
                <Filter className="w-3 h-3" /> Clear Filter
              </button>
            )}
          </div>

          <AllocationDonut
            data={donutData}
            centerLabel="Oct Outflow"
            centerValue={
              balancesMasked
                ? '••••••'
                : formatCurrency(monthlyExpenses, { decimals: 0, currency: cur })
            }
            height={175}
          />

          <div className="space-y-2 pt-2 border-t border-current/10">
            {categoryBreakdown.map((item) => {
              const isSelected = selectedCategoryDrilldown === item.category;
              return (
                <button
                  key={item.category}
                  type="button"
                  onClick={() =>
                    setSelectedCategoryDrilldown(isSelected ? null : item.category)
                  }
                  className={`w-full text-left p-2 rounded-xl border transition-all space-y-1 ${
                    isSelected
                      ? 'border-[#D6B878] bg-[#D6B878]/15'
                      : 'border-transparent hover:bg-current/5'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      {item.category}
                    </span>
                    <span className="font-mono tabular-nums">
                      {formatCurrency(item.amount, { masked: balancesMasked, currency: cur })} (
                      {item.share}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#F5F2EA] dark:bg-[#0D1423] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${item.share}%`, backgroundColor: item.color }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Row: Largest Expenses & Merchant-Level Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Largest Outgoing Expenses */}
        <div className="rounded-3xl p-6 bg-white dark:bg-[#141D2D] border border-[#080D18]/10 dark:border-[#F5F2EA]/10 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-semibold">Largest Individual Expenses</h2>
            {selectedCategoryDrilldown && (
              <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-[#D6B878]/15 text-[#D6B878]">
                Filtered: {selectedCategoryDrilldown}
              </span>
            )}
          </div>
          <div className="divide-y divide-current/10">
            {largestExpenses.map((t, i) => (
              <div key={t.id} className="py-3 flex items-center justify-between gap-4 text-xs sm:text-sm">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-6 h-6 rounded-full bg-[#D6B878]/15 text-[#B39352] dark:text-[#D6B878] font-mono text-xs flex items-center justify-center shrink-0">
                    0{i + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold truncate">{t.merchant}</p>
                    <p className="text-xs text-[#6E7A8E] dark:text-[#929DB0] truncate">
                      {formatDate(t.date)} • {t.category}
                    </p>
                  </div>
                </div>
                <span className="font-mono font-semibold tabular-nums shrink-0">
                  {formatCurrency(Math.abs(t.amount), { masked: balancesMasked, currency: cur })}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Merchant-Level Breakdown */}
        <div className="rounded-3xl p-6 bg-white dark:bg-[#141D2D] border border-[#080D18]/10 dark:border-[#F5F2EA]/10 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-semibold">Merchant-Level Telemetry</h2>
            {selectedCategoryDrilldown && (
              <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-[#D6B878]/15 text-[#D6B878]">
                Filtered: {selectedCategoryDrilldown}
              </span>
            )}
          </div>
          <div className="divide-y divide-current/10">
            {merchantBreakdown.map((m) => (
              <div key={m.merchant} className="py-3 flex items-center justify-between gap-4 text-xs sm:text-sm">
                <div className="min-w-0">
                  <p className="font-semibold truncate">{m.merchant}</p>
                  <p className="text-xs text-[#6E7A8E] dark:text-[#929DB0]">
                    {m.category} • {m.count} {m.count === 1 ? 'settlement' : 'settlements'}
                  </p>
                </div>
                <span className="font-mono font-semibold text-[#B39352] dark:text-[#D6B878] tabular-nums shrink-0">
                  {formatCurrency(m.total, { masked: balancesMasked, currency: cur })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
