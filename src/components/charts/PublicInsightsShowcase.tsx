import React, { useState } from 'react';
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
import { MONTHLY_HISTORY, INITIAL_BUDGETS } from '../../data/mockBankingData';
import { AllocationDonut, RadialGauge } from './VisualWidgets';
import { BarChart3, TrendingUp, PieChart } from 'lucide-react';

type InsightTab = 'cashflow' | 'wealth' | 'categories';

const CATEGORY_COLORS = ['#D6B878', '#36C995', '#6366F1', '#F4B860', '#929DB0', '#FF7777'];

export const PublicInsightsShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<InsightTab>('cashflow');
  const [range, setRange] = useState<'3M' | '6M'>('6M');

  const chartData = range === '3M' ? MONTHLY_HISTORY.slice(-3) : MONTHLY_HISTORY;

  const donutData = INITIAL_BUDGETS.map((b, idx) => ({
    name: b.category,
    value: b.spent,
    color: CATEGORY_COLORS[idx % CATEGORY_COLORS.length],
  }));

  return (
    <div className="rounded-3xl bg-white dark:bg-[#141D2D] border border-[#080D18]/10 dark:border-[#F5F2EA]/10 p-6 sm:p-8 shadow-luxury-light dark:shadow-luxury">
      {/* Compact Visual Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#080D18]/10 dark:border-[#F5F2EA]/10">
        <div className="flex items-center gap-3">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#36C995]" />
          <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#080D18] dark:text-[#F5F2EA]">
            Live Telemetry Studio
          </h3>
          <span className="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[#D6B878]/15 text-[#B39352] dark:text-[#D6B878]">
            Sample Data
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Metric View Selector */}
          <div
            className="inline-flex rounded-xl bg-[#F5F2EA] dark:bg-[#0D1423] p-1 border border-[#080D18]/10 dark:border-[#F5F2EA]/10"
            role="tablist"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'cashflow'}
              onClick={() => setActiveTab('cashflow')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'cashflow'
                  ? 'bg-[#D6B878] text-[#080D18] font-semibold shadow-sm'
                  : 'text-[#6E7A8E] dark:text-[#929DB0]'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Cash Flow</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'wealth'}
              onClick={() => setActiveTab('wealth')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'wealth'
                  ? 'bg-[#D6B878] text-[#080D18] font-semibold shadow-sm'
                  : 'text-[#6E7A8E] dark:text-[#929DB0]'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Reserve Growth</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'categories'}
              onClick={() => setActiveTab('categories')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'categories'
                  ? 'bg-[#D6B878] text-[#080D18] font-semibold shadow-sm'
                  : 'text-[#6E7A8E] dark:text-[#929DB0]'
              }`}
            >
              <PieChart className="w-3.5 h-3.5" />
              <span>Spend Donut</span>
            </button>
          </div>

          {/* Date Range Selector */}
          {activeTab !== 'categories' && (
            <div className="inline-flex rounded-xl bg-[#F5F2EA] dark:bg-[#0D1423] p-1 border border-[#080D18]/10 dark:border-[#F5F2EA]/10">
              {(['3M', '6M'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRange(r)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                    range === r
                      ? 'bg-[#080D18] dark:bg-[#1B273D] text-[#F5F2EA] font-semibold'
                      : 'text-[#6E7A8E] dark:text-[#929DB0]'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 items-center">
        {/* Left 8 Cols: Chart Canvas */}
        <div className="lg:col-span-8 h-[280px] w-full flex flex-col justify-center" aria-label="Interactive financial chart">
          {activeTab === 'cashflow' && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barGap={8}>
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
                  cursor={{ fill: 'rgba(214, 184, 120, 0.08)' }}
                  contentStyle={{
                    backgroundColor: '#0D1423',
                    borderColor: 'rgba(214, 184, 120, 0.35)',
                    borderRadius: '12px',
                    color: '#F5F2EA',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '12px',
                  }}
                  formatter={(value: number, name: string) => [
                    `$${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
                    name === 'income' ? 'Monthly Inflow' : 'Monthly Outflow',
                  ]}
                />
                <Bar dataKey="income" name="income" fill="#36C995" radius={[6, 6, 0, 0]} isAnimationActive={false} />
                <Bar dataKey="expenses" name="expenses" fill="#D6B878" radius={[6, 6, 0, 0]} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          )}

          {activeTab === 'wealth' && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="goldAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D6B878" stopOpacity={0.4} />
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
                  domain={['dataMin - 20000', 'dataMax + 15000']}
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
                  formatter={(value: number) => [
                    `$${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
                    'Portfolio Liquidity',
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="totalBalance"
                  stroke="#D6B878"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#goldAreaGrad)"
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}

          {activeTab === 'categories' && (
            <AllocationDonut
              data={donutData}
              centerTitle="Oct Spend"
              centerValue="$21.05k"
              height={240}
            />
          )}
        </div>

        {/* Right 4 Cols: Visual Radial Ring & Stacked Liquidity Split */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-2xl bg-[#F5F2EA] dark:bg-[#0D1423] border border-[#080D18]/10 dark:border-[#F5F2EA]/10 flex items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#6E7A8E] dark:text-[#929DB0] block">
                Net Cash Flow
              </span>
              <span className="text-2xl font-mono font-semibold text-[#36C995] tabular-nums mt-1 block">
                +$20,370
              </span>
              <span className="text-xs text-[#6E7A8E] dark:text-[#929DB0] mt-1 block">
                $41.4k In • $21.0k Out
              </span>
            </div>
            <RadialGauge
              percent={49.2}
              size={84}
              strokeWidth={7}
              color="#36C995"
              label="49%"
              sublabel="Saved"
            />
          </div>

          <div className="p-5 rounded-2xl bg-[#F5F2EA] dark:bg-[#0D1423] border border-[#080D18]/10 dark:border-[#F5F2EA]/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#6E7A8E] dark:text-[#929DB0]">
                Liquidity Distribution
              </span>
              <span className="font-mono text-sm font-semibold tabular-nums">$892,050</span>
            </div>
            {/* Visual Multi-Account Stacked Bar */}
            <div className="w-full h-3 rounded-full bg-white dark:bg-[#141D2D] overflow-hidden flex">
              <div className="h-full bg-[#D6B878]" style={{ width: '10%' }} title="Checking: $84.65k" />
              <div className="h-full bg-[#36C995]" style={{ width: '35%' }} title="Reserve Vault: $312.4k" />
              <div className="h-full bg-[#6366F1]" style={{ width: '55%' }} title="Treasury: $495k" />
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono text-[#6E7A8E] dark:text-[#929DB0]">
              <span className="inline-flex items-center gap-1">
                <i className="w-2 h-2 rounded-full bg-[#D6B878]" /> 10% Chk
              </span>
              <span className="inline-flex items-center gap-1">
                <i className="w-2 h-2 rounded-full bg-[#36C995]" /> 35% Vault
              </span>
              <span className="inline-flex items-center gap-1">
                <i className="w-2 h-2 rounded-full bg-[#6366F1]" /> 55% Treasury
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
