import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBanking } from '../../contexts/BankingContext';
import { formatCurrency, exportTransactionsToCSV } from '../../utils/formatters';
import {
  Search,
  ArrowRight,
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  Send,
  CreditCard,
  PieChart,
  LineChart,
  UserCheck,
  Settings,
  Globe,
  ShieldCheck,
  Sparkles,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Download,
  RotateCcw,
  X,
  Command,
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CommandItem {
  id: string;
  group: 'Quick Actions' | 'Authenticated Terminal' | 'Public Pages' | 'Recent Transactions';
  label: string;
  sublabel: string;
  icon: React.ElementType;
  badge?: string;
  onSelect: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const {
    transactions,
    balancesMasked,
    toggleBalancesMasked,
    theme,
    toggleTheme,
    resetDemoData,
    profile,
    addToast,
  } = useBanking();

  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 20);
    }
  }, [isOpen]);

  const allItems: CommandItem[] = useMemo(() => {
    const go = (path: string) => {
      navigate(path);
      onClose();
    };

    const actions: CommandItem[] = [
      {
        id: 'act-transfer',
        group: 'Quick Actions',
        label: 'Initiate Capital Transfer',
        sublabel: 'Launch 6-step internal or external wire terminal',
        icon: Send,
        badge: 'Action',
        onSelect: () => go('/dashboard/transfers'),
      },
      {
        id: 'act-mask',
        group: 'Quick Actions',
        label: balancesMasked ? 'Reveal Portfolio Balances' : 'Mask Portfolio Balances (Privacy Mode)',
        sublabel: 'Toggle cryptographic balance masking across all views',
        icon: balancesMasked ? Eye : EyeOff,
        badge: 'Shortcut',
        onSelect: () => {
          toggleBalancesMasked();
          onClose();
        },
      },
      {
        id: 'act-theme',
        group: 'Quick Actions',
        label: `Switch to ${theme === 'dark' ? 'Editorial Ivory (Light)' : 'Midnight Obsidian (Dark)'} Mode`,
        sublabel: 'Toggle ambient surface color palette',
        icon: theme === 'dark' ? Sun : Moon,
        badge: 'Theme',
        onSelect: () => {
          toggleTheme();
          onClose();
        },
      },
      {
        id: 'act-csv',
        group: 'Quick Actions',
        label: 'Export Full Ledger to CSV',
        sublabel: `Download all ${transactions.length} synthetic ledger records`,
        icon: Download,
        badge: 'Export',
        onSelect: () => {
          exportTransactionsToCSV(transactions);
          addToast({
            title: 'CSV Ledger Exported',
            description: `Downloaded ${transactions.length} transactions via Command Palette.`,
            variant: 'success',
          });
          onClose();
        },
      },
      {
        id: 'act-reset',
        group: 'Quick Actions',
        label: 'Reset Demo Dataset to Baseline',
        sublabel: 'Restore initial accounts, cards, budgets, and transactions',
        icon: RotateCcw,
        badge: 'Sandbox',
        onSelect: () => {
          resetDemoData();
          onClose();
        },
      },
    ];

    const dashboardRoutes: CommandItem[] = [
      {
        id: 'nav-dash',
        group: 'Authenticated Terminal',
        label: 'Executive Command Center',
        sublabel: '/dashboard • Portfolio overview, cash flow & radial telemetry',
        icon: LayoutDashboard,
        onSelect: () => go('/dashboard'),
      },
      {
        id: 'nav-accounts',
        group: 'Authenticated Terminal',
        label: 'Accounts & Multi-Currency Vaults',
        sublabel: '/dashboard/accounts • Checking, Reserve, Treasury & CHF Custody',
        icon: Wallet,
        onSelect: () => go('/dashboard/accounts'),
      },
      {
        id: 'nav-txns',
        group: 'Authenticated Terminal',
        label: 'Transactions & Settlement Ledger',
        sublabel: '/dashboard/transactions • Multi-facet search, filters & CSV export',
        icon: ArrowLeftRight,
        onSelect: () => go('/dashboard/transactions'),
      },
      {
        id: 'nav-transfers',
        group: 'Authenticated Terminal',
        label: 'Capital Transfers & Wires',
        sublabel: '/dashboard/transfers • Internal sweeps & international corridors',
        icon: Send,
        onSelect: () => go('/dashboard/transfers'),
      },
      {
        id: 'nav-cards',
        group: 'Authenticated Terminal',
        label: 'Card Studio & Velocity Controls',
        sublabel: '/dashboard/cards • 3D card flip, instant freeze & spending limits',
        icon: CreditCard,
        onSelect: () => go('/dashboard/cards'),
      },
      {
        id: 'nav-budgets',
        group: 'Authenticated Terminal',
        label: 'Budgets & Capital Goals',
        sublabel: '/dashboard/budgets • Category guardrails & custom target vaults',
        icon: PieChart,
        onSelect: () => go('/dashboard/budgets'),
      },
      {
        id: 'nav-analytics',
        group: 'Authenticated Terminal',
        label: 'Financial Analytics & Telemetry',
        sublabel: '/dashboard/analytics • Interactive multi-series charts & drilldowns',
        icon: LineChart,
        onSelect: () => go('/dashboard/analytics'),
      },
      {
        id: 'nav-profile',
        group: 'Authenticated Terminal',
        label: 'Client Profile & Security Posture',
        sublabel: '/dashboard/profile • Identity, passkeys & authorized devices',
        icon: UserCheck,
        onSelect: () => go('/dashboard/profile'),
      },
      {
        id: 'nav-settings',
        group: 'Authenticated Terminal',
        label: 'Preferences & Terminal Settings',
        sublabel: '/dashboard/settings • Base currency, notifications & accessibility',
        icon: Settings,
        onSelect: () => go('/dashboard/settings'),
      },
    ];

    const publicRoutes: CommandItem[] = [
      {
        id: 'pub-home',
        group: 'Public Pages',
        label: 'Aurelion Public Home',
        sublabel: '/ • Hero card stack, tier showcase & live telemetry preview',
        icon: Sparkles,
        onSelect: () => go('/'),
      },
      {
        id: 'pub-personal',
        group: 'Public Pages',
        label: 'Personal Banking & Inflow Sweep Simulator',
        sublabel: '/personal-banking • Automated liquidity routing studio',
        icon: Globe,
        onSelect: () => go('/personal-banking'),
      },
      {
        id: 'pub-accounts',
        group: 'Public Pages',
        label: 'Signature Accounts & Yield Simulator',
        sublabel: '/accounts • Essential, Elevate & Private tier comparison',
        icon: Wallet,
        onSelect: () => go('/accounts'),
      },
      {
        id: 'pub-cards',
        group: 'Public Pages',
        label: 'Interactive 3D Card Atelier',
        sublabel: '/cards • Obsidian, Champagne, Arctic & Emerald metallurgy',
        icon: CreditCard,
        onSelect: () => go('/cards'),
      },
      {
        id: 'pub-payments',
        group: 'Public Pages',
        label: 'Global Payments & FX Corridor Estimator',
        sublabel: '/payments • Multi-currency conversion & settlement rails',
        icon: Send,
        onSelect: () => go('/payments'),
      },
      {
        id: 'pub-loans',
        group: 'Public Pages',
        label: 'Private Credit & Amortization Simulator',
        sublabel: '/loans • Portfolio credit lines & architectural financing',
        icon: LineChart,
        onSelect: () => go('/loans'),
      },
      {
        id: 'pub-wealth',
        group: 'Public Pages',
        label: 'Private Wealth & Multi-Year Horizon Projector',
        sublabel: '/wealth • Endowment archetypes & interactive compounding chart',
        icon: PieChart,
        onSelect: () => go('/wealth'),
      },
      {
        id: 'pub-security',
        group: 'Public Pages',
        label: 'Security & Cryptographic Governance',
        sublabel: '/security • Defense-in-depth architecture & session controls',
        icon: ShieldCheck,
        onSelect: () => go('/security'),
      },
    ];

    const txnItems: CommandItem[] = transactions.slice(0, 8).map((t) => ({
      id: `txn-${t.id}`,
      group: 'Recent Transactions',
      label: `${t.merchant} (${formatCurrency(t.amount, {
        masked: balancesMasked,
        showSign: true,
        currency: profile.preferredCurrency,
      })})`,
      sublabel: `${t.category} • ${t.accountName} • ${t.reference}`,
      icon: ArrowLeftRight,
      badge: t.status,
      onSelect: () => go('/dashboard/transactions'),
    }));

    return [...actions, ...dashboardRoutes, ...publicRoutes, ...txnItems];
  }, [
    navigate,
    onClose,
    balancesMasked,
    toggleBalancesMasked,
    theme,
    toggleTheme,
    transactions,
    addToast,
    resetDemoData,
    profile.preferredCurrency,
  ]);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allItems.slice(0, 14);
    return allItems.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.sublabel.toLowerCase().includes(q) ||
        item.group.toLowerCase().includes(q)
    );
  }, [allItems, query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prev) => (filteredItems.length > 0 ? (prev + 1) % filteredItems.length : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((prev) =>
          filteredItems.length > 0 ? (prev - 1 + filteredItems.length) % filteredItems.length : 0
        );
      } else if (e.key === 'Enter' && filteredItems[activeIndex]) {
        e.preventDefault();
        filteredItems[activeIndex].onSelect();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, activeIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-16 sm:pt-24 px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Aurelion Command Palette"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#080D18]/75 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative z-10 w-full max-w-2xl rounded-3xl bg-white dark:bg-[#141D2D] border border-[#D6B878]/30 dark:border-[#D6B878]/35 shadow-luxury-light dark:shadow-luxury overflow-hidden animate-in fade-in zoom-in-95 duration-200 ease-out">
        {/* Search Input Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#080D18]/10 dark:border-[#F5F2EA]/10">
          <Search className="w-5 h-5 text-[#B39352] dark:text-[#D6B878] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Jump to any page, search transactions, or trigger an action..."
            aria-label="Command palette search"
            className="w-full bg-transparent text-sm sm:text-base text-[#080D18] dark:text-[#F5F2EA] placeholder-[#6E7A8E] dark:placeholder-[#929DB0] focus:outline-none"
          />
          <div className="flex items-center gap-1.5 shrink-0">
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-mono rounded bg-[#F5F2EA] dark:bg-[#0D1423] text-[#6E7A8E] dark:text-[#929DB0] border border-current/15">
              ESC
            </kbd>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close command palette"
              className="p-1.5 rounded-lg text-[#6E7A8E] dark:text-[#929DB0] hover:text-[#080D18] dark:hover:text-[#F5F2EA]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2.5 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <p className="font-serif text-xl font-semibold">No matching commands or records</p>
              <p className="text-xs text-[#6E7A8E] dark:text-[#929DB0]">
                Try searching for &ldquo;transfers&rdquo;, &ldquo;cards&rdquo;, &ldquo;analytics&rdquo;, or a merchant name.
              </p>
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === activeIndex;
              const showGroupHeader =
                idx === 0 || filteredItems[idx - 1].group !== item.group;

              return (
                <React.Fragment key={item.id}>
                  {showGroupHeader && (
                    <div className="px-3 pt-3 pb-1 text-[11px] font-mono uppercase tracking-[0.2em] text-[#B39352] dark:text-[#D6B878]">
                      {item.group}
                    </div>
                  )}
                  <button
                    type="button"
                    onMouseEnter={() => setActiveIndex(idx)}
                    onClick={item.onSelect}
                    className={`w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-2xl text-left transition-colors ${
                      isSelected
                        ? 'bg-[#D6B878]/15 dark:bg-[#D6B878]/20 text-[#080D18] dark:text-[#F5F2EA]'
                        : 'hover:bg-[#080D18]/5 dark:hover:bg-[#F5F2EA]/5'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                          isSelected
                            ? 'bg-[#D6B878] text-[#080D18] border-[#D6B878]'
                            : 'bg-[#F5F2EA] dark:bg-[#0D1423] text-[#B39352] dark:text-[#D6B878] border-current/10'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-semibold truncate">{item.label}</p>
                        <p className="text-xs text-[#6E7A8E] dark:text-[#929DB0] truncate">
                          {item.sublabel}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {item.badge && (
                        <span className="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[#080D18]/5 dark:bg-[#0D1423] text-[#B39352] dark:text-[#D6B878]">
                          {item.badge}
                        </span>
                      )}
                      <ArrowRight
                        className={`w-4 h-4 transition-transform ${
                          isSelected ? 'text-[#D6B878] translate-x-0.5' : 'opacity-30'
                        }`}
                      />
                    </div>
                  </button>
                </React.Fragment>
              );
            })
          )}
        </div>

        {/* Footer Hints */}
        <div className="px-5 py-3 bg-[#F5F2EA]/70 dark:bg-[#0D1423] border-t border-[#080D18]/10 dark:border-[#F5F2EA]/10 flex flex-wrap items-center justify-between gap-2 text-xs text-[#6E7A8E] dark:text-[#929DB0]">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <Command className="w-3.5 h-3.5 text-[#D6B878]" />
              <span>Aurelion Instant Navigation</span>
            </span>
          </div>
          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Dismiss</span>
          </div>
        </div>
      </div>
    </div>
  );
};
