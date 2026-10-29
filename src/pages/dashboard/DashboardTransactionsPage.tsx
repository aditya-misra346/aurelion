import React, { useState, useMemo } from 'react';
import { useBanking } from '../../contexts/BankingContext';
import { Transaction, TransactionCategory, TransactionType, TransactionStatus } from '../../types/banking';
import { formatCurrency, formatDate, exportTransactionsToCSV } from '../../utils/formatters';
import {
  Search,
  Filter,
  Download,
  ArrowUpDown,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowRightLeft,
  X,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  FileSpreadsheet,
  MapPin,
  Hash,
  Building2,
} from 'lucide-react';

const ALL_CATEGORIES: TransactionCategory[] = [
  'Dining & Gastronomy',
  'Travel & Aviation',
  'Architecture & Home',
  'Technology & Cloud',
  'Wealth & Advisory',
  'Compensation & Retainer',
  'Internal Treasury',
  'Health & Longevity',
  'Luxury Retail',
];

export const DashboardTransactionsPage: React.FC = () => {
  const { transactions, selectedAccountId, balancesMasked, profile, addToast } = useBanking();
  const cur = profile.preferredCurrency;

  // Filters
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateWindow, setDateWindow] = useState<'all' | '7d' | '15d' | '30d'>('all');

  // Sorting
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortDir, setSortDir] = useState<'desc' | 'asc'>('desc');

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 8;

  // Selected Transaction Drawer
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);

  const filteredAndSorted = useMemo(() => {
    const q = search.trim().toLowerCase();
    const refDate = new Date('2026-10-29T12:00:00');

    const filtered = transactions.filter((t) => {
      if (selectedAccountId !== 'all' && t.accountId !== selectedAccountId) return false;
      if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;
      if (typeFilter !== 'all' && t.type !== typeFilter) return false;
      if (statusFilter !== 'all' && t.status !== statusFilter) return false;

      if (dateWindow !== 'all') {
        const txnDate = new Date(t.date + 'T12:00:00');
        const diffDays = (refDate.getTime() - txnDate.getTime()) / (1000 * 3600 * 24);
        if (dateWindow === '7d' && diffDays > 7) return false;
        if (dateWindow === '15d' && diffDays > 15) return false;
        if (dateWindow === '30d' && diffDays > 30) return false;
      }

      if (q) {
        const matchMerchant = t.merchant.toLowerCase().includes(q);
        const matchDesc = t.description.toLowerCase().includes(q);
        const matchRef = t.reference.toLowerCase().includes(q);
        const matchLoc = t.merchantLocation.toLowerCase().includes(q);
        if (!matchMerchant && !matchDesc && !matchRef && !matchLoc) return false;
      }

      return true;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === 'date') {
        const cmp = a.date.localeCompare(b.date);
        return sortDir === 'desc' ? -cmp : cmp;
      } else {
        const cmp = Math.abs(a.amount) - Math.abs(b.amount);
        return sortDir === 'desc' ? -cmp : cmp;
      }
    });
  }, [
    transactions,
    selectedAccountId,
    search,
    categoryFilter,
    typeFilter,
    statusFilter,
    dateWindow,
    sortBy,
    sortDir,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredAndSorted.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedTxns = filteredAndSorted.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Live Filtered Ledger Telemetry
  const filteredMetrics = useMemo(() => {
    let inflows = 0;
    let inflowCount = 0;
    let outflows = 0;
    let outflowCount = 0;
    const catTotals: Record<string, number> = {};

    filteredAndSorted.forEach((t) => {
      if (t.status === 'Declined') return;
      if (t.amount > 0 && t.type !== 'Internal Transfer') {
        inflows += t.amount;
        inflowCount += 1;
      } else if (t.amount < 0 && t.type !== 'Internal Transfer') {
        const abs = Math.abs(t.amount);
        outflows += abs;
        outflowCount += 1;
        catTotals[t.category] = (catTotals[t.category] || 0) + abs;
      }
    });

    const palette = ['#D6B878', '#36C995', '#6395F2', '#E59866', '#A569BD', '#FF7777'];
    const topCategories = Object.entries(catTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([cat, amt], idx) => ({
        category: cat,
        amount: amt,
        pct: outflows > 0 ? Math.max(5, Math.round((amt / outflows) * 100)) : 0,
        color: palette[idx % palette.length],
      }));

    return {
      inflows,
      inflowCount,
      outflows,
      outflowCount,
      net: inflows - outflows,
      topCategories,
    };
  }, [filteredAndSorted]);

  const handleClearFilters = () => {
    setSearch('');
    setCategoryFilter('all');
    setTypeFilter('all');
    setStatusFilter('all');
    setDateWindow('all');
    setSortBy('date');
    setSortDir('desc');
    setPage(1);
  };

  const handleExportCSV = () => {
    exportTransactionsToCSV(filteredAndSorted);
    addToast({
      title: 'CSV Ledger Exported',
      description: `Exported ${filteredAndSorted.length} displayed demo transactions to CSV.`,
      variant: 'success',
    });
  };

  const toggleSort = (field: 'date' | 'amount') => {
    if (sortBy === field) {
      setSortDir((prev) => (prev === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortBy(field);
      setSortDir('desc');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Export */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#B39352] dark:text-[#D6B878]">
            Auditable Demo Ledger
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold mt-1">
            Transactions & Settlement History
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleClearFilters}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-medium bg-white dark:bg-[#141D2D] border border-current/15 hover:border-[#D6B878] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
          <button
            type="button"
            onClick={handleExportCSV}
            disabled={filteredAndSorted.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#D6B878] hover:bg-[#E5CFA0] text-[#080D18] disabled:opacity-40 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Displayed to CSV ({filteredAndSorted.length})</span>
          </button>
        </div>
      </div>

      {/* Live Filtered Ledger Telemetry Strip */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-2xl p-4 bg-white dark:bg-[#141D2D] border border-[#080D18]/10 dark:border-[#F5F2EA]/10">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#6E7A8E] dark:text-[#929DB0] block">
              Filtered Inflows ({filteredMetrics.inflowCount})
            </span>
            <span className="font-mono text-lg sm:text-xl font-semibold text-[#36C995] tabular-nums mt-1 block">
              {formatCurrency(filteredMetrics.inflows, {
                masked: balancesMasked,
                showSign: true,
                currency: cur,
              })}
            </span>
          </div>

          <div className="rounded-2xl p-4 bg-white dark:bg-[#141D2D] border border-[#080D18]/10 dark:border-[#F5F2EA]/10">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#6E7A8E] dark:text-[#929DB0] block">
              Filtered Outflows ({filteredMetrics.outflowCount})
            </span>
            <span className="font-mono text-lg sm:text-xl font-semibold text-[#D6B878] tabular-nums mt-1 block">
              {formatCurrency(-filteredMetrics.outflows, {
                masked: balancesMasked,
                showSign: true,
                currency: cur,
              })}
            </span>
          </div>

          <div className="rounded-2xl p-4 bg-white dark:bg-[#141D2D] border border-[#080D18]/10 dark:border-[#F5F2EA]/10">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#6E7A8E] dark:text-[#929DB0] block">
              Net Displayed Delta
            </span>
            <span
              className={`font-mono text-lg sm:text-xl font-semibold tabular-nums mt-1 block ${
                filteredMetrics.net >= 0 ? 'text-[#36C995]' : 'text-[#FF7777]'
              }`}
            >
              {formatCurrency(filteredMetrics.net, {
                masked: balancesMasked,
                showSign: true,
                currency: cur,
              })}
            </span>
          </div>
        </div>

        {/* Interactive Category Proportion Bar (Click to Filter) */}
        <div className="lg:col-span-5 rounded-2xl p-4 bg-white dark:bg-[#141D2D] border border-[#080D18]/10 dark:border-[#F5F2EA]/10 flex flex-col justify-between space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#6E7A8E] dark:text-[#929DB0]">
              Displayed Outflow Composition (Click Pill to Filter)
            </span>
            {categoryFilter !== 'all' && (
              <button
                type="button"
                onClick={() => setCategoryFilter('all')}
                className="text-[10px] font-mono text-[#D6B878] hover:underline"
              >
                Show All
              </button>
            )}
          </div>

          {filteredMetrics.topCategories.length > 0 ? (
            <>
              <div className="h-2.5 w-full rounded-full bg-[#F5F2EA] dark:bg-[#0D1423] overflow-hidden flex gap-0.5">
                {filteredMetrics.topCategories.map((c) => (
                  <div
                    key={c.category}
                    style={{ width: `${c.pct}%`, backgroundColor: c.color }}
                    className="h-full transition-all duration-300"
                    title={`${c.category}: ${c.pct}%`}
                  />
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {filteredMetrics.topCategories.map((c) => {
                  const active = categoryFilter === c.category;
                  return (
                    <button
                      key={c.category}
                      type="button"
                      onClick={() => {
                        setCategoryFilter(active ? 'all' : c.category);
                        setPage(1);
                      }}
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono border transition-colors ${
                        active
                          ? 'bg-[#D6B878]/20 border-[#D6B878] text-[#D6B878] font-semibold'
                          : 'border-current/10 text-[#6E7A8E] dark:text-[#929DB0] hover:border-current/30'
                      }`}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: c.color }}
                      />
                      <span>{c.category.split(' ')[0]}</span>
                      <span>{c.pct}%</span>
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <p className="text-xs text-[#6E7A8E] dark:text-[#929DB0]">
              No outgoing expenses in the current filter window.
            </p>
          )}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="rounded-3xl p-5 bg-white dark:bg-[#141D2D] border border-[#080D18]/10 dark:border-[#F5F2EA]/10 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Input */}
          <div className="sm:col-span-2 lg:col-span-2 relative">
            <Search className="w-4 h-4 text-[#6E7A8E] dark:text-[#929DB0] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search merchant, description, location, or reference..."
              aria-label="Filter by merchant or description"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs bg-[#F5F2EA] dark:bg-[#0D1423] border border-current/10 focus:outline-none focus:border-[#D6B878]"
            />
          </div>

          {/* Date Range Filter */}
          <div>
            <select
              aria-label="Filter by date range"
              value={dateWindow}
              onChange={(e) => {
                setDateWindow(e.target.value as 'all' | '7d' | '15d' | '30d');
                setPage(1);
              }}
              className="w-full px-3 py-2.5 rounded-xl text-xs bg-[#F5F2EA] dark:bg-[#0D1423] border border-current/10 focus:outline-none focus:border-[#D6B878]"
            >
              <option value="all">All Dates</option>
              <option value="7d">Last 7 Days</option>
              <option value="15d">Last 15 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              aria-label="Filter by category"
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2.5 rounded-xl text-xs bg-[#F5F2EA] dark:bg-[#0D1423] border border-current/10 focus:outline-none focus:border-[#D6B878]"
            >
              <option value="all">All Categories</option>
              {ALL_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Type & Status Combined Row */}
          <div className="grid grid-cols-2 gap-2">
            <select
              aria-label="Filter by transaction type"
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-2.5 py-2.5 rounded-xl text-xs bg-[#F5F2EA] dark:bg-[#0D1423] border border-current/10 focus:outline-none focus:border-[#D6B878]"
            >
              <option value="all">All Types</option>
              <option value="Incoming">Incoming</option>
              <option value="Outgoing">Outgoing</option>
              <option value="Internal Transfer">Internal</option>
            </select>

            <select
              aria-label="Filter by status"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-2.5 py-2.5 rounded-xl text-xs bg-[#F5F2EA] dark:bg-[#0D1423] border border-current/10 focus:outline-none focus:border-[#D6B878]"
            >
              <option value="all">All Status</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Declined">Declined</option>
            </select>
          </div>
        </div>
      </div>

      {/* Responsive Ledger Table */}
      <div className="rounded-3xl bg-white dark:bg-[#141D2D] border border-[#080D18]/10 dark:border-[#F5F2EA]/10 overflow-hidden shadow-sm">
        {filteredAndSorted.length === 0 ? (
          <div className="py-16 px-4 text-center space-y-3">
            <p className="font-serif text-2xl font-semibold">No Matching Transactions</p>
            <p className="text-xs text-[#6E7A8E] dark:text-[#929DB0] max-w-md mx-auto">
              No synthetic ledger entries matched your current search and filter criteria.
            </p>
            <button
              type="button"
              onClick={handleClearFilters}
              className="px-4 py-2 rounded-xl bg-[#D6B878] text-[#080D18] text-xs font-semibold"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#080D18]/10 dark:border-[#F5F2EA]/10 bg-[#F5F2EA]/60 dark:bg-[#0D1423] text-[11px] font-mono uppercase tracking-wider text-[#6E7A8E] dark:text-[#929DB0]">
                    <th className="py-3.5 px-5">Merchant & Description</th>
                    <th className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => toggleSort('date')}
                        className="inline-flex items-center gap-1 hover:text-[#D6B878]"
                      >
                        <span>Date</span>
                        <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </th>
                    <th className="py-3.5 px-4 hidden md:table-cell">Category</th>
                    <th className="py-3.5 px-4 hidden lg:table-cell">Account</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-5 text-right">
                      <button
                        type="button"
                        onClick={() => toggleSort('amount')}
                        className="inline-flex items-center gap-1 hover:text-[#D6B878] ml-auto"
                      >
                        <span>Amount</span>
                        <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#080D18]/10 dark:divide-[#F5F2EA]/10 text-xs sm:text-sm">
                  {paginatedTxns.map((t) => (
                    <tr
                      key={t.id}
                      onClick={() => setSelectedTxn(t)}
                      className="cursor-pointer hover:bg-[#D6B878]/[0.06] transition-colors"
                    >
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                              t.status === 'Declined'
                                ? 'bg-[#FF7777]/15 text-[#FF7777]'
                                : t.type === 'Incoming'
                                ? 'bg-[#36C995]/15 text-[#36C995]'
                                : t.type === 'Internal Transfer'
                                ? 'bg-[#929DB0]/20 text-[#929DB0]'
                                : 'bg-[#D6B878]/15 text-[#B39352] dark:text-[#D6B878]'
                            }`}
                          >
                            {t.type === 'Incoming' ? (
                              <ArrowDownLeft className="w-4 h-4" />
                            ) : t.type === 'Internal Transfer' ? (
                              <ArrowRightLeft className="w-4 h-4" />
                            ) : (
                              <ArrowUpRight className="w-4 h-4" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold truncate">{t.merchant}</p>
                            <p className="text-xs text-[#6E7A8E] dark:text-[#929DB0] truncate max-w-xs">
                              {t.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-mono text-xs whitespace-nowrap">
                        {formatDate(t.date)}
                      </td>
                      <td className="py-4 px-4 hidden md:table-cell">
                        <span className="px-2.5 py-1 rounded-full text-xs bg-[#F5F2EA] dark:bg-[#0D1423]">
                          {t.category}
                        </span>
                      </td>
                      <td className="py-4 px-4 hidden lg:table-cell text-xs text-[#6E7A8E] dark:text-[#929DB0]">
                        {t.accountName}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-block font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded ${
                            t.status === 'Completed'
                              ? 'bg-[#36C995]/15 text-[#36C995]'
                              : t.status === 'Pending'
                              ? 'bg-[#D6B878]/20 text-[#B39352] dark:text-[#D6B878]'
                              : 'bg-[#FF7777]/15 text-[#FF7777]'
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>
                      <td
                        className={`py-4 px-5 text-right font-mono font-semibold tabular-nums whitespace-nowrap ${
                          t.status === 'Declined'
                            ? 'line-through text-[#FF7777]'
                            : t.amount > 0
                            ? 'text-[#36C995]'
                            : ''
                        }`}
                      >
                        {formatCurrency(t.amount, {
                          masked: balancesMasked,
                          showSign: true,
                          currency: cur,
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="px-5 py-3.5 border-t border-[#080D18]/10 dark:border-[#F5F2EA]/10 flex items-center justify-between text-xs text-[#6E7A8E] dark:text-[#929DB0]">
              <span>
                Showing {(currentPage - 1) * pageSize + 1}–
                {Math.min(currentPage * pageSize, filteredAndSorted.length)} of{' '}
                {filteredAndSorted.length} records
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="p-1.5 rounded-lg border border-current/15 disabled:opacity-30"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-mono">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="p-1.5 rounded-lg border border-current/15 disabled:opacity-30"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Transaction Detail Slide-Over Drawer */}
      {selectedTxn && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedTxn(null)}
          />
          <div className="relative z-10 w-full max-w-md bg-white dark:bg-[#141D2D] h-full p-6 sm:p-8 flex flex-col justify-between overflow-y-auto shadow-luxury animate-in slide-in-from-right">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-current/10 pb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#B39352] dark:text-[#D6B878] block">
                    Transaction Inspection Drawer
                  </span>
                  <h2 className="font-serif text-2xl font-semibold mt-0.5">
                    Settlement Record
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedTxn(null)}
                  className="p-2 rounded-lg border border-current/15"
                  aria-label="Close transaction drawer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-[#F5F2EA] dark:bg-[#0D1423] text-center space-y-2">
                <span className="text-xs font-mono uppercase tracking-wider text-[#6E7A8E] dark:text-[#929DB0]">
                  {selectedTxn.type} • {selectedTxn.status}
                </span>
                <p
                  className={`font-mono text-3xl font-semibold tabular-nums ${
                    selectedTxn.amount > 0 ? 'text-[#36C995]' : ''
                  }`}
                >
                  {formatCurrency(selectedTxn.amount, {
                    masked: balancesMasked,
                    showSign: true,
                    currency: cur,
                  })}
                </p>
                <p className="text-sm font-semibold">{selectedTxn.merchant}</p>
                <p className="text-xs text-[#6E7A8E] dark:text-[#929DB0]">
                  {selectedTxn.merchantLocation}
                </p>
              </div>

              <div className="space-y-3 text-xs">
                {[
                  { label: 'Audit Reference', val: selectedTxn.reference },
                  { label: 'Settlement Date', val: formatDate(selectedTxn.date) },
                  { label: 'Category', val: selectedTxn.category },
                  { label: 'Associated Account', val: selectedTxn.accountName },
                  { label: 'Description', val: selectedTxn.description },
                  ...(selectedTxn.counterpartyIban
                    ? [{ label: 'Counterparty Routing', val: selectedTxn.counterpartyIban }]
                    : []),
                  ...(selectedTxn.notes
                    ? [{ label: 'Audit Notes', val: selectedTxn.notes }]
                    : []),
                ].map((row, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#F5F2EA]/60 dark:bg-[#0D1423]/60 flex items-start justify-between gap-4"
                  >
                    <span className="text-[#6E7A8E] dark:text-[#929DB0] shrink-0">
                      {row.label}
                    </span>
                    <span className="font-mono text-right font-medium">{row.val}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-current/10">
              <button
                type="button"
                onClick={() => setSelectedTxn(null)}
                className="w-full py-3 rounded-xl bg-[#D6B878] text-[#080D18] text-xs font-semibold"
              >
                Close Record Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
