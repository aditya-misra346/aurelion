import React, { useState } from 'react';
import { useBanking } from '../../contexts/BankingContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  Copy,
  Check,
  FileText,
  Download,
  Edit3,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Landmark,
  ShieldCheck,
  Target,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardAccountsPage: React.FC = () => {
  const {
    accounts,
    transactions,
    goals,
    profile,
    balancesMasked,
    renameSavingsGoal,
    createSavingsGoal,
    addToast,
  } = useBanking();

  const [activeAccId, setActiveAccId] = useState<string>(accounts[0]?.id || 'acc-checking-01');
  const [detailTab, setDetailTab] = useState<'activity' | 'goals' | 'statements'>('activity');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [goalNewName, setGoalNewName] = useState('');
  const [showNewGoalForm, setShowNewGoalForm] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState('50000');

  const activeAccount = accounts.find((a) => a.id === activeAccId) || accounts[0];
  const accountTransactions = transactions.filter((t) => t.accountId === activeAccount.id);
  const accountGoals = goals.filter((g) => g.linkedAccountId === activeAccount.id);
  const cur = profile.preferredCurrency;

  const handleCopyIdentifier = (text: string, label: string) => {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopiedId(text);
    addToast({
      title: 'Demo Identifier Copied',
      description: `${label} (${text}) copied to clipboard.`,
      variant: 'success',
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadSampleStatement = (period: string) => {
    const content = [
      `AURELION PRIVATE DIGITAL BANKING — ILLUSTRATIVE DEMO STATEMENT`,
      `Statement Period: ${period}`,
      `Account Name: ${activeAccount.name}`,
      `Account Identifier: ${activeAccount.accountIdentifier}`,
      `Available Balance: $${activeAccount.availableBalance.toFixed(2)} USD`,
      `Current Balance: $${activeAccount.currentBalance.toFixed(2)} USD`,
      `Pending Balance: $${activeAccount.pendingBalance.toFixed(2)} USD`,
      ``,
      `IMPORTANT: Synthetic demonstration document only. Not a real financial statement.`,
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Aurelion-Demo-Statement-${period.replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    addToast({
      title: 'Sample Statement Downloaded',
      description: `${period} statement summary saved.`,
      variant: 'success',
    });
  };

  const handleAddQuickGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const target = Number(newGoalTarget);
    if (!newGoalTitle.trim() || isNaN(target) || target <= 0) return;
    createSavingsGoal({
      name: newGoalTitle.trim(),
      category: 'Vault Allocation',
      targetAmount: target,
      currentAmount: 0,
      monthlyContribution: Math.round(target / 12),
      targetDate: '2027-10-01',
      linkedAccountId: activeAccount.id,
      assumptionNote: `Simulated vault goal linked to ${activeAccount.name}.`,
    });
    setNewGoalTitle('');
    setShowNewGoalForm(false);
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#B39352] dark:text-[#D6B878]">
            Multi-Account Architecture
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold mt-1">
            Accounts, Vaults & Treasury
          </h1>
        </div>
        <Link
          to="/dashboard/transfers"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D6B878] text-[#080D18] text-xs font-semibold hover:bg-[#E5CFA0] transition-colors"
        >
          <span>Transfer Between Accounts</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Account Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {accounts.map((acc) => {
          const isSelected = acc.id === activeAccount.id;
          return (
            <button
              key={acc.id}
              type="button"
              onClick={() => setActiveAccId(acc.id)}
              className={`text-left rounded-3xl p-6 border transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-pearl-card dark:bg-none text-[#0A0F1A] border-[#D6B878] shadow-luxury-light ring-1 ring-[#D6B878]/40 dark:ring-0 dark:bg-[#0D1423] dark:text-[#F5F2EA] dark:border-[#D6B878] dark:shadow-luxury'
                  : 'bg-white dark:bg-[#141D2D] border-[#0A0F1A]/10 dark:border-[#F5F2EA]/10 hover:border-[#D6B878]/50 shadow-sm dark:shadow-none'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#9E7B35] dark:text-[#D6B878]">
                    {acc.type}
                  </span>
                  <span className="text-xs font-mono opacity-75">{acc.accountNumberMasked}</span>
                </div>
                <h2 className="font-serif text-2xl font-semibold">{acc.name}</h2>
                <p className="text-xs opacity-70">{acc.subtitle}</p>
              </div>

              <div className="pt-6 mt-6 border-t border-current/10 flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider opacity-65 block">
                    Available Balance
                  </span>
                  <span className="font-mono text-2xl font-semibold tabular-nums">
                    {formatCurrency(acc.availableBalance, { masked: balancesMasked, currency: cur })}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-[#36C995]">Active</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Detailed Inspection Panel with Progressive Disclosure Tabs */}
      <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#141D2D] border border-[#080D18]/10 dark:border-[#F5F2EA]/10 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-current/10 pb-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#B39352] dark:text-[#D6B878]">
              Selected Account
            </span>
            <h3 className="font-serif text-2xl font-semibold">{activeAccount.name}</h3>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-[#D6B878]/15 text-[#B39352] dark:text-[#D6B878]">
            {activeAccount.indicativeYieldNote}
          </span>
        </div>

        {/* 3 KPI Balance Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-[#F5F2EA] dark:bg-[#0D1423]">
            <span className="text-[10px] uppercase tracking-wider text-[#6E7A8E] dark:text-[#929DB0] block">
              Available Balance
            </span>
            <span className="font-mono text-xl font-semibold text-[#36C995] tabular-nums mt-1 block">
              {formatCurrency(activeAccount.availableBalance, {
                masked: balancesMasked,
                currency: cur,
              })}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#F5F2EA] dark:bg-[#0D1423]">
            <span className="text-[10px] uppercase tracking-wider text-[#6E7A8E] dark:text-[#929DB0] block">
              Current Ledger
            </span>
            <span className="font-mono text-xl font-semibold tabular-nums mt-1 block">
              {formatCurrency(activeAccount.currentBalance, {
                masked: balancesMasked,
                currency: cur,
              })}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#F5F2EA] dark:bg-[#0D1423]">
            <span className="text-[10px] uppercase tracking-wider text-[#6E7A8E] dark:text-[#929DB0] block">
              Pending Holds
            </span>
            <span className="font-mono text-xl font-semibold text-[#D6B878] tabular-nums mt-1 block">
              {formatCurrency(activeAccount.pendingBalance, {
                masked: balancesMasked,
                showSign: true,
                currency: cur,
              })}
            </span>
          </div>
        </div>

        {/* Progressive Disclosure Sub-Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-current/10">
          <div className="inline-flex rounded-xl bg-[#F5F2EA] dark:bg-[#0D1423] p-1 border border-current/10 text-xs">
            {(
              [
                { id: 'activity', label: `Activity (${accountTransactions.length})` },
                { id: 'goals', label: `Vault Goals (${(accountGoals.length || goals.length)})` },
                { id: 'statements', label: 'Routing & Statements' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setDetailTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg font-medium transition-colors ${
                  detailTab === tab.id
                    ? 'bg-[#D6B878] text-[#080D18] font-semibold'
                    : 'text-[#6E7A8E] dark:text-[#929DB0]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {detailTab === 'activity' && (
            <Link
              to="/dashboard/transactions"
              className="text-xs font-semibold text-[#B39352] dark:text-[#D6B878] hover:underline"
            >
              Full Ledger →
            </Link>
          )}
          {detailTab === 'goals' && (
            <button
              type="button"
              onClick={() => setShowNewGoalForm((prev) => !prev)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#D6B878]/15 text-[#B39352] dark:text-[#D6B878] text-xs font-semibold"
            >
              <Plus className="w-3.5 h-3.5" /> New Goal
            </button>
          )}
        </div>

        {/* TAB 1: ACTIVITY */}
        {detailTab === 'activity' && (
          <div>
            {accountTransactions.length === 0 ? (
              <p className="text-xs text-[#6E7A8E] dark:text-[#929DB0] py-6 text-center">
                No recorded transactions for this account.
              </p>
            ) : (
              <div className="divide-y divide-current/10">
                {accountTransactions.slice(0, 6).map((t) => (
                  <div key={t.id} className="py-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold">{t.merchant}</p>
                      <p className="text-xs text-[#6E7A8E] dark:text-[#929DB0]">
                        {formatDate(t.date)} • {t.category}
                      </p>
                    </div>
                    <span
                      className={`font-mono text-sm font-semibold tabular-nums ${
                        t.amount > 0 ? 'text-[#36C995]' : ''
                      }`}
                    >
                      {formatCurrency(t.amount, {
                        masked: balancesMasked,
                        showSign: true,
                        currency: cur,
                      })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: VAULT GOALS */}
        {detailTab === 'goals' && (
          <div className="space-y-4">
            {showNewGoalForm && (
              <form
                onSubmit={handleAddQuickGoal}
                className="p-4 rounded-2xl bg-[#F5F2EA] dark:bg-[#0D1423] border border-[#D6B878]/30 grid grid-cols-1 sm:grid-cols-3 gap-3"
              >
                <input
                  type="text"
                  required
                  value={newGoalTitle}
                  onChange={(e) => setNewGoalTitle(e.target.value)}
                  placeholder="Goal title (e.g. Tax Reserve)"
                  className="px-3 py-2 rounded-lg bg-white dark:bg-[#141D2D] border border-current/15 text-xs"
                />
                <input
                  type="number"
                  required
                  min={1000}
                  value={newGoalTarget}
                  onChange={(e) => setNewGoalTarget(e.target.value)}
                  placeholder="Target USD"
                  className="px-3 py-2 rounded-lg bg-white dark:bg-[#141D2D] border border-current/15 text-xs font-mono"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-lg bg-[#D6B878] text-[#080D18] text-xs font-semibold"
                  >
                    Create Goal
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewGoalForm(false)}
                    className="px-3 py-2 rounded-lg border border-current/15 text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(accountGoals.length > 0 ? accountGoals : goals).map((g) => {
                const isEditing = editingGoalId === g.id;
                const pct = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100));
                return (
                  <div
                    key={g.id}
                    className="p-4 rounded-2xl bg-[#F5F2EA] dark:bg-[#0D1423] space-y-2.5"
                  >
                    {isEditing ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={goalNewName}
                          onChange={(e) => setGoalNewName(e.target.value)}
                          className="flex-1 px-2.5 py-1 rounded bg-white dark:bg-[#141D2D] border border-[#D6B878] text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            renameSavingsGoal(g.id, goalNewName);
                            setEditingGoalId(null);
                          }}
                          className="px-2.5 py-1 rounded bg-[#D6B878] text-[#080D18] text-xs font-semibold"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold truncate">{g.name}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingGoalId(g.id);
                            setGoalNewName(g.name);
                          }}
                          className="p-1 text-[#6E7A8E] hover:text-[#D6B878]"
                          title="Rename goal"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    <div className="w-full h-1.5 rounded-full bg-white dark:bg-[#141D2D] overflow-hidden">
                      <div
                        className="h-full bg-[#36C995] rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs font-mono text-[#6E7A8E] dark:text-[#929DB0]">
                      <span>
                        {formatCurrency(g.currentAmount, {
                          masked: balancesMasked,
                          decimals: 0,
                          currency: cur,
                        })}
                      </span>
                      <span>
                        {pct}% of{' '}
                        {formatCurrency(g.targetAmount, {
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
        )}

        {/* TAB 3: ROUTING & STATEMENTS */}
        {detailTab === 'statements' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#6E7A8E] dark:text-[#929DB0]">
                Routing & Account Identifiers
              </h4>
              <div className="space-y-2.5">
                <div className="p-3.5 rounded-xl bg-[#F5F2EA] dark:bg-[#0D1423] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#6E7A8E] dark:text-[#929DB0] block">
                      Account Identifier
                    </span>
                    <span className="font-mono text-xs font-semibold">
                      {activeAccount.accountIdentifier}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopyIdentifier(activeAccount.accountIdentifier, 'Account Identifier')
                    }
                    className="p-2 rounded-lg hover:bg-current/10 text-[#B39352] dark:text-[#D6B878]"
                  >
                    {copiedId === activeAccount.accountIdentifier ? (
                      <Check className="w-4 h-4 text-[#36C995]" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F5F2EA] dark:bg-[#0D1423] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#6E7A8E] dark:text-[#929DB0] block">
                      IBAN / Wire Reference
                    </span>
                    <span className="font-mono text-xs font-semibold">{activeAccount.iban}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyIdentifier(activeAccount.iban, 'IBAN')}
                    className="p-2 rounded-lg hover:bg-current/10 text-[#B39352] dark:text-[#D6B878]"
                  >
                    {copiedId === activeAccount.iban ? (
                      <Check className="w-4 h-4 text-[#36C995]" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#6E7A8E] dark:text-[#929DB0]">
                Periodic Statements
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  'Oct 2026 (MTD)',
                  'Sep 2026 Statement',
                  'Aug 2026 Statement',
                  'Q3 2026 Summary',
                ].map((period) => (
                  <div
                    key={period}
                    className="p-3.5 rounded-xl bg-[#F5F2EA] dark:bg-[#0D1423] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#D6B878] shrink-0" />
                      <span className="text-xs font-medium truncate">{period}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDownloadSampleStatement(period)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#B39352] dark:text-[#D6B878] hover:underline"
                    >
                      <Download className="w-3.5 h-3.5" /> TXT
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
