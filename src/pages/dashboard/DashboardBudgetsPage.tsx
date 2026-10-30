import React, { useState, useMemo } from 'react';
import { useBanking } from '../../contexts/BankingContext';
import { TransactionCategory } from '../../types/banking';
import { formatCurrency } from '../../utils/formatters';
import { RadialGauge } from '../../components/charts/VisualWidgets';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  Plus,
  Trash2,
  Edit3,
  Target,
} from 'lucide-react';

const BUDGET_CATEGORIES: TransactionCategory[] = [
  'Travel & Aviation',
  'Architecture & Home',
  'Dining & Gastronomy',
  'Technology & Cloud',
  'Luxury Retail',
  'Health & Longevity',
  'Wealth & Advisory',
];

export const DashboardBudgetsPage: React.FC = () => {
  const {
    budgets,
    goals,
    accounts,
    createBudget,
    updateBudget,
    deleteBudget,
    createSavingsGoal,
    contributeToGoal,
    deleteSavingsGoal,
    balancesMasked,
    profile,
  } = useBanking();

  const cur = profile.preferredCurrency;

  // Create Budget State
  const [selectedCat, setSelectedCat] = useState<TransactionCategory>('Dining & Gastronomy');
  const [budgetLimitInput, setBudgetLimitInput] = useState('4500');
  const [editingBudgetId, setEditingBudgetId] = useState<string | null>(null);
  const [editBudgetLimitVal, setEditBudgetLimitVal] = useState('');

  // Create Savings Goal State
  const [goalName, setGoalName] = useState('');
  const [goalCategory, setGoalCategory] = useState('Private Reserve');
  const [goalTarget, setGoalTarget] = useState('120000');
  const [goalMonthly, setGoalMonthly] = useState('5000');

  // Contribution State per goal
  const [contribAmounts, setContribAmounts] = useState<Record<string, string>>({});

  const budgetChartData = useMemo(
    () =>
      budgets.map((b) => ({
        name: b.category.split(' ')[0],
        spent: b.spent,
        limit: b.monthlyLimit,
      })),
    [budgets]
  );

  const totalBudgetLimit = useMemo(
    () => budgets.reduce((s, b) => s + b.monthlyLimit, 0),
    [budgets]
  );
  const totalBudgetSpent = useMemo(
    () => budgets.reduce((s, b) => s + b.spent, 0),
    [budgets]
  );
  const overallUtilPct =
    totalBudgetLimit > 0 ? Math.min(100, Math.round((totalBudgetSpent / totalBudgetLimit) * 100)) : 0;

  const totalGoalSaved = useMemo(
    () => goals.reduce((s, g) => s + g.currentAmount, 0),
    [goals]
  );
  const totalGoalTarget = useMemo(
    () => goals.reduce((s, g) => s + g.targetAmount, 0),
    [goals]
  );
  const overallGoalPct =
    totalGoalTarget > 0 ? Math.min(100, Math.round((totalGoalSaved / totalGoalTarget) * 100)) : 0;

  const handleCreateBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const limit = Number(budgetLimitInput);
    if (isNaN(limit) || limit <= 0) return;
    createBudget(selectedCat, limit, 80, 'Configured in interactive budget console');
  };

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const target = Number(goalTarget);
    const monthly = Number(goalMonthly);
    if (!goalName.trim() || isNaN(target) || target <= 0) return;
    createSavingsGoal({
      name: goalName.trim(),
      category: goalCategory,
      targetAmount: target,
      currentAmount: 0,
      monthlyContribution: monthly > 0 ? monthly : 2500,
      targetDate: '2027-12-01',
      linkedAccountId: accounts[1]?.id || 'acc-vault-02',
      assumptionNote: `Projected assuming $${(monthly > 0 ? monthly : 2500).toLocaleString()}/mo steady contribution at 0% market volatility.`,
    });
    setGoalName('');
  };

  return (
    <div className="space-y-12 pb-12">
      <div>
        <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#B39352] dark:text-[#D6B878]">
          Capital Allocation & Stewardship
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold mt-1">
          Monthly Budgets & Savings Goals
        </h1>
      </div>

      {/* Visual Telemetry Overview Row: Budget vs Actual BarChart + Radial Gauges */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-7 rounded-3xl p-6 bg-white dark:bg-[#141D2D] border border-[#080D18]/10 dark:border-[#F5F2EA]/10 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-semibold">
                Category Spend vs. Monthly Limit
              </h2>
              <p className="text-xs text-[#6E7A8E] dark:text-[#929DB0]">
                Gold = Actual Spend • Slate = Monthly Limit Cap
              </p>
            </div>
            <span className="text-xs font-mono text-[#D6B878]">
              {overallUtilPct}% Aggregate Utilization
            </span>
          </div>
          <div className="h-[195px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={budgetChartData} barGap={6}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(146,157,176,0.12)" vertical={false} />
                <XAxis dataKey="name" stroke="#929DB0" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis
                  stroke="#929DB0"
                  fontSize={11}
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
                    formatCurrency(v, { masked: balancesMasked, decimals: 0, currency: cur }),
                    name === 'spent' ? 'Actual Spend' : 'Monthly Limit',
                  ]}
                />
                <Bar dataKey="spent" fill="#D6B878" radius={[6, 6, 0, 0]} maxBarSize={26} isAnimationActive={false} />
                <Bar dataKey="limit" fill="#2A364F" radius={[6, 6, 0, 0]} maxBarSize={26} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-5 grid grid-cols-2 gap-4">
          <div className="rounded-3xl p-5 bg-white dark:bg-[#141D2D] border border-[#080D18]/10 dark:border-[#F5F2EA]/10 flex flex-col items-center justify-center text-center space-y-2">
            <RadialGauge
              value={overallUtilPct}
              size={84}
              strokeWidth={7}
              color={overallUtilPct > 85 ? '#FF7777' : '#D6B878'}
              label="Budget Used"
              sublabel={`${formatCurrency(totalBudgetSpent, { masked: balancesMasked, decimals: 0, currency: cur })} / ${formatCurrency(totalBudgetLimit, { masked: balancesMasked, decimals: 0, currency: cur })}`}
            />
          </div>
          <div className="rounded-3xl p-5 bg-white dark:bg-[#141D2D] border border-[#080D18]/10 dark:border-[#F5F2EA]/10 flex flex-col items-center justify-center text-center space-y-2">
            <RadialGauge
              value={overallGoalPct}
              size={84}
              strokeWidth={7}
              color="#36C995"
              label="Goals Funded"
              sublabel={`${formatCurrency(totalGoalSaved, { masked: balancesMasked, decimals: 0, currency: cur })} saved`}
            />
          </div>
        </div>
      </div>

      {/* SECTION 1: MONTHLY CATEGORY BUDGETS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 8 Cols: Active Budgets List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-semibold">Active Category Budgets</h2>
            <span className="text-xs text-[#6E7A8E] dark:text-[#929DB0]">
              Synchronized automatically with outgoing ledger transactions
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {budgets.map((b) => {
              const pct = Math.min(100, Math.round((b.spent / b.monthlyLimit) * 100));
              const isEditing = editingBudgetId === b.id;
              const remaining = Math.max(0, b.monthlyLimit - b.spent);

              return (
                <div
                  key={b.id}
                  className="rounded-3xl p-6 bg-white dark:bg-[#141D2D] border border-[#080D18]/10 dark:border-[#F5F2EA]/10 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-base font-semibold">{b.category}</h3>
                        <span className="text-xs font-mono text-[#6E7A8E] dark:text-[#929DB0]">
                          {pct}% utilized •{' '}
                          {formatCurrency(remaining, {
                            masked: balancesMasked,
                            decimals: 0,
                            currency: cur,
                          })}{' '}
                          remaining
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingBudgetId(b.id);
                            setEditBudgetLimitVal(String(b.monthlyLimit));
                          }}
                          className="p-1.5 rounded-lg text-[#6E7A8E] hover:text-[#D6B878]"
                          title="Edit monthly limit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteBudget(b.id)}
                          className="p-1.5 rounded-lg text-[#6E7A8E] hover:text-[#FF7777]"
                          title="Delete budget"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {isEditing && (
                      <div className="flex gap-2 pt-1">
                        <input
                          type="number"
                          min={100}
                          value={editBudgetLimitVal}
                          onChange={(e) => setEditBudgetLimitVal(e.target.value)}
                          className="flex-1 px-3 py-1.5 rounded-lg bg-[#F5F2EA] dark:bg-[#0D1423] border border-[#D6B878] text-xs font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const val = Number(editBudgetLimitVal);
                            if (val > 0) updateBudget(b.id, val);
                            setEditingBudgetId(null);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-[#D6B878] text-[#080D18] text-xs font-semibold"
                        >
                          Save
                        </button>
                      </div>
                    )}

                    <div className="w-full h-2.5 rounded-full bg-[#F5F2EA] dark:bg-[#0D1423] overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          pct >= 100
                            ? 'bg-[#FF7777]'
                            : pct >= b.alertThresholdPercent
                            ? 'bg-[#D6B878]'
                            : 'bg-[#36C995]'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-current/10 flex items-center justify-between text-xs font-mono tabular-nums">
                    <span>
                      Spent:{' '}
                      <strong>
                        {formatCurrency(b.spent, {
                          masked: balancesMasked,
                          decimals: 0,
                          currency: cur,
                        })}
                      </strong>
                    </span>
                    <span>
                      Limit:{' '}
                      {formatCurrency(b.monthlyLimit, {
                        masked: balancesMasked,
                        decimals: 0,
                        currency: cur,
                      })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 4 Cols: Create or Update Category Budget Form */}
        <form
          onSubmit={handleCreateBudget}
          className="lg:col-span-4 rounded-3xl p-6 bg-white dark:bg-[#141D2D] border border-[#080D18]/10 dark:border-[#F5F2EA]/10 space-y-4"
        >
          <h3 className="font-serif text-xl font-semibold">Set Category Budget</h3>
          <p className="text-xs text-[#6E7A8E] dark:text-[#929DB0]">
            Create a new monthly category budget or update an existing category limit.
          </p>

          <div>
            <label htmlFor="budget-cat-select" className="block text-xs font-medium mb-1">
              Spending Category
            </label>
            <select
              id="budget-cat-select"
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value as TransactionCategory)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F2EA] dark:bg-[#0D1423] border border-current/15 text-xs"
            >
              {BUDGET_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="budget-limit-input" className="block text-xs font-medium mb-1">
              Monthly Limit (USD)
            </label>
            <input
              id="budget-limit-input"
              type="number"
              min={100}
              step={100}
              required
              value={budgetLimitInput}
              onChange={(e) => setBudgetLimitInput(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F2EA] dark:bg-[#0D1423] border border-current/15 text-xs font-mono"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#D6B878] hover:bg-[#E5CFA0] text-[#080D18] text-xs font-semibold flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Save Category Budget</span>
          </button>
        </form>
      </div>

      {/* SECTION 2: SAVINGS GOALS & SIMULATED CONTRIBUTIONS */}
      <div className="pt-6 border-t border-[#080D18]/10 dark:border-[#F5F2EA]/10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-4">
          <h2 className="font-serif text-2xl font-semibold">
            Capital Reserves & Savings Goals
          </h2>

          <div className="space-y-4">
            {goals.map((g) => {
              const pct = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100));
              const remainingAmt = Math.max(0, g.targetAmount - g.currentAmount);
              const monthsToComplete =
                g.monthlyContribution > 0
                  ? Math.ceil(remainingAmt / g.monthlyContribution)
                  : 0;
              const customContrib = contribAmounts[g.id] ?? '2500';

              return (
                <div
                  key={g.id}
                  className="rounded-3xl p-6 bg-white dark:bg-[#141D2D] border border-[#080D18]/10 dark:border-[#F5F2EA]/10 space-y-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-widest text-[#B39352] dark:text-[#D6B878]">
                        {g.category}
                      </span>
                      <h3 className="font-serif text-2xl font-semibold">{g.name}</h3>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-lg font-semibold text-[#36C995]">
                        {pct}% Complete
                      </span>
                      <button
                        type="button"
                        onClick={() => deleteSavingsGoal(g.id)}
                        className="p-1.5 text-[#6E7A8E] hover:text-[#FF7777]"
                        title="Archive goal"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="w-full h-3 rounded-full bg-[#F5F2EA] dark:bg-[#0D1423] overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#D6B878] to-[#36C995] rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                    <div className="p-3 rounded-xl bg-[#F5F2EA] dark:bg-[#0D1423]">
                      <span className="text-[11px] text-[#6E7A8E] dark:text-[#929DB0] block">
                        Current Saved
                      </span>
                      <span className="text-sm font-semibold tabular-nums">
                        {formatCurrency(g.currentAmount, {
                          masked: balancesMasked,
                          decimals: 0,
                          currency: cur,
                        })}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#F5F2EA] dark:bg-[#0D1423]">
                      <span className="text-[11px] text-[#6E7A8E] dark:text-[#929DB0] block">
                        Target Reserve
                      </span>
                      <span className="text-sm font-semibold tabular-nums">
                        {formatCurrency(g.targetAmount, {
                          masked: balancesMasked,
                          decimals: 0,
                          currency: cur,
                        })}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#F5F2EA] dark:bg-[#0D1423]">
                      <span className="text-[11px] text-[#6E7A8E] dark:text-[#929DB0] block">
                        Projected Completion
                      </span>
                      <span className="text-sm font-semibold text-[#B39352] dark:text-[#D6B878]">
                        {remainingAmt === 0 ? 'Goal Achieved' : `~${monthsToComplete} Months`}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-[#6E7A8E] dark:text-[#929DB0] italic">
                    Assumption: {g.assumptionNote}
                  </p>

                  {/* Simulated Contribution Bar */}
                  <div className="pt-2 flex flex-wrap items-center gap-2">
                    <input
                      type="number"
                      min={100}
                      step={500}
                      value={customContrib}
                      onChange={(e) =>
                        setContribAmounts((prev) => ({ ...prev, [g.id]: e.target.value }))
                      }
                      aria-label={`Contribution amount for ${g.name}`}
                      className="w-36 px-3 py-2 rounded-xl bg-[#F5F2EA] dark:bg-[#0D1423] border border-current/15 text-xs font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => contributeToGoal(g.id, Number(customContrib))}
                      className="px-4 py-2 rounded-xl bg-[#D6B878] hover:bg-[#E5CFA0] text-[#080D18] text-xs font-semibold transition-colors"
                    >
                      + Add Simulated Contribution
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 4 Cols: Create New Savings Goal */}
        <form
          onSubmit={handleCreateGoal}
          className="lg:col-span-4 rounded-3xl p-6 bg-white dark:bg-[#141D2D] border border-[#080D18]/10 dark:border-[#F5F2EA]/10 space-y-4"
        >
          <h3 className="font-serif text-xl font-semibold">Create Capital Goal</h3>
          <p className="text-xs text-[#6E7A8E] dark:text-[#929DB0]">
            Model a new long-term acquisition or reserve target.
          </p>

          <div>
            <label htmlFor="new-goal-name" className="block text-xs font-medium mb-1">
              Goal Title
            </label>
            <input
              id="new-goal-name"
              type="text"
              required
              value={goalName}
              onChange={(e) => setGoalName(e.target.value)}
              placeholder="e.g. Zurich Studio Acquisition"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F2EA] dark:bg-[#0D1423] border border-current/15 text-xs"
            />
          </div>

          <div>
            <label htmlFor="new-goal-target" className="block text-xs font-medium mb-1">
              Target Amount (USD)
            </label>
            <input
              id="new-goal-target"
              type="number"
              min={1000}
              required
              value={goalTarget}
              onChange={(e) => setGoalTarget(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F2EA] dark:bg-[#0D1423] border border-current/15 text-xs font-mono"
            />
          </div>

          <div>
            <label htmlFor="new-goal-monthly" className="block text-xs font-medium mb-1">
              Assumed Monthly Allocation (USD)
            </label>
            <input
              id="new-goal-monthly"
              type="number"
              min={250}
              required
              value={goalMonthly}
              onChange={(e) => setGoalMonthly(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F2EA] dark:bg-[#0D1423] border border-current/15 text-xs font-mono"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#36C995] hover:opacity-95 text-[#080D18] text-xs font-semibold flex items-center justify-center gap-1.5"
          >
            <Target className="w-4 h-4" />
            <span>Initialize Savings Goal</span>
          </button>
        </form>
      </div>
    </div>
  );
};
