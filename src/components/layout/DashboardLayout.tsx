import React, { useState, useMemo } from 'react';
import { NavLink, Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { BrandMark } from '../ui/BrandMark';
import { CommandPalette } from '../navigation/CommandPalette';
import { useBanking } from '../../contexts/BankingContext';
import { formatCurrency, CURRENCY_RATES } from '../../utils/formatters';
import {
  LayoutDashboard,
  Landmark,
  ReceiptText,
  ArrowRightLeft,
  CreditCard,
  Target,
  BarChart3,
  UserCircle,
  Settings,
  Bell,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Search,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  RotateCcw,
  LogOut,
  CheckCheck,
  Trash2,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Overview', to: '/dashboard', icon: LayoutDashboard, end: true },
  { label: 'Accounts & Vaults', to: '/dashboard/accounts', icon: Landmark },
  { label: 'Transactions', to: '/dashboard/transactions', icon: ReceiptText },
  { label: 'Transfers & Wires', to: '/dashboard/transfers', icon: ArrowRightLeft },
  { label: 'Cards & Controls', to: '/dashboard/cards', icon: CreditCard },
  { label: 'Budgets & Goals', to: '/dashboard/budgets', icon: Target },
  { label: 'Analytics', to: '/dashboard/analytics', icon: BarChart3 },
  { label: 'Client Profile', to: '/dashboard/profile', icon: UserCircle },
  { label: 'Settings & Security', to: '/dashboard/settings', icon: Settings },
];

export const DashboardLayout: React.FC = () => {
  const {
    theme,
    toggleTheme,
    balancesMasked,
    toggleBalancesMasked,
    selectedAccountId,
    setSelectedAccountId,
    accounts,
    transactions,
    notifications,
    profile,
    totalAvailableBalance,
    markNotificationRead,
    markAllNotificationsRead,
    dismissNotification,
    resetDemoData,
    addToast,
  } = useBanking();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return transactions
      .filter(
        (t) =>
          t.merchant.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.reference.toLowerCase().includes(q)
      )
      .slice(0, 5);
  }, [searchQuery, transactions]);

  const handleSignOut = () => {
    addToast({
      title: 'Signed Out of Demo Session',
      description: 'Returned to public Aurelion experience.',
      variant: 'default',
    });
    navigate('/');
  };

  return (
    <div className="min-h-screen flex bg-[#FAF8F5] dark:bg-[#080D18] text-[#0A0F1A] dark:text-[#F5F2EA]">
      {/* DESKTOP SIDEBAR */}
      <aside
        aria-label="Client Portal Sidebar"
        className={`hidden lg:flex flex-col justify-between shrink-0 bg-white dark:bg-[#0D1423] border-r border-[#D6B878]/25 dark:border-[#F5F2EA]/10 transition-all duration-300 ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Top Brand & Collapse Toggle */}
        <div className="p-4 flex flex-col gap-6">
          <div className="h-12 flex items-center justify-between px-1">
            {!sidebarCollapsed ? (
              <BrandMark to="/" size="sm" />
            ) : (
              <Link
                to="/"
                className="mx-auto w-9 h-9 rounded-lg bg-[#D6B878]/20 border border-[#D6B878]/40 flex items-center justify-center font-serif font-bold text-[#D6B878]"
                title="Aurelion Home"
              >
                A
              </Link>
            )}
            <button
              type="button"
              onClick={() => setSidebarCollapsed((prev) => !prev)}
              className="p-1.5 rounded-lg text-[#6E7A8E] dark:text-[#929DB0] hover:text-[#080D18] dark:hover:text-[#F5F2EA] hover:bg-current/5"
              aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1" aria-label="Dashboard Navigation">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  title={sidebarCollapsed ? item.label : undefined}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-[#D6B878] text-[#080D18] font-semibold shadow-sm'
                        : 'text-[#4A5568] dark:text-[#929DB0] hover:text-[#080D18] dark:hover:text-[#F5F2EA] hover:bg-[#080D18]/5 dark:hover:bg-[#F5F2EA]/5'
                    } ${sidebarCollapsed ? 'justify-center' : ''}`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Client Tier Card & Sign Out */}
        <div className="p-4 border-t border-[#080D18]/10 dark:border-[#F5F2EA]/10 space-y-3">
          {!sidebarCollapsed && (
            <div className="p-3.5 rounded-xl bg-[#F5F2EA] dark:bg-[#141D2D] border border-[#D6B878]/25 space-y-1">
              <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-[#B39352] dark:text-[#D6B878]">
                <span>{profile.membershipTier} Client</span>
                <Sparkles className="w-3 h-3" />
              </div>
              <p className="text-xs font-semibold truncate">{profile.fullName}</p>
              <p className="text-[11px] text-[#6E7A8E] dark:text-[#929DB0] truncate">
                Advisor: {profile.privateAdvisorName}
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={handleSignOut}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#6E7A8E] dark:text-[#929DB0] hover:text-[#FF7777] hover:bg-[#FF7777]/10 transition-colors ${
              sidebarCollapsed ? 'justify-center' : ''
            }`}
            title="Exit Demo Portal"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!sidebarCollapsed && <span>Exit Demo to Public Site</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT SHELL */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOP HEADER BAR */}
        <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 dark:bg-[#080D18]/90 backdrop-blur-xl border-b border-[#D6B878]/25 dark:border-[#F5F2EA]/10 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          {/* Left: Mobile Menu Button + Account Switcher */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg border border-current/15"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Account Switcher */}
            <div className="flex items-center gap-2">
              <label htmlFor="global-account-switcher" className="sr-only">
                Select Account Scope
              </label>
              <select
                id="global-account-switcher"
                value={selectedAccountId}
                onChange={(e) => setSelectedAccountId(e.target.value)}
                className="px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium bg-white dark:bg-[#141D2D] border border-[#D6B878]/30 dark:border-[#D6B878]/30 text-[#0A0F1A] dark:text-[#F5F2EA] focus:outline-none focus:border-[#D6B878] max-w-[210px] sm:max-w-xs truncate shadow-sm dark:shadow-none"
              >
                <option value="all">
                  All Accounts ({formatCurrency(totalAvailableBalance, { masked: balancesMasked, currency: profile.preferredCurrency })})
                </option>
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name} ({formatCurrency(acc.availableBalance, { masked: balancesMasked, currency: profile.preferredCurrency })})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Center: Global Search Input + Command Palette Trigger */}
          <div className="hidden md:block relative flex-1 max-w-md">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-[#6E7A8E] dark:text-[#929DB0] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                value={searchQuery}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 180)}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search merchants, categories, or press ⌘K..."
                aria-label="Search transactions"
                className="w-full pl-9 pr-14 py-1.5 rounded-xl text-xs bg-white dark:bg-[#141D2D] border border-[#D6B878]/30 dark:border-[#F5F2EA]/10 focus:outline-none focus:border-[#D6B878] shadow-sm dark:shadow-none"
              />
              <button
                type="button"
                onClick={() => setCmdOpen(true)}
                className="absolute right-2 px-1.5 py-0.5 text-[10px] font-mono rounded bg-[#F8F5EE] dark:bg-[#0D1423] text-[#9E7B35] dark:text-[#D6B878] border border-current/15 hover:border-[#D6B878]"
                title="Open Command Palette (⌘K)"
              >
                ⌘K
              </button>
            </div>

            {searchFocused && searchQuery.trim().length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 rounded-2xl bg-white dark:bg-[#141D2D] border border-[#D6B878]/30 dark:border-[#D6B878]/30 shadow-luxury-light dark:shadow-luxury p-3 z-50 space-y-2">
                <div className="flex items-center justify-between px-2 text-[10px] font-mono uppercase tracking-wider text-[#6E7A8E] dark:text-[#929DB0]">
                  <span>Matching Ledger Records</span>
                  <span>{searchResults.length} found</span>
                </div>
                {searchResults.length === 0 ? (
                  <p className="text-xs text-[#6E7A8E] dark:text-[#929DB0] px-2 py-2">
                    No matching transactions for “{searchQuery}”.
                  </p>
                ) : (
                  <div className="divide-y divide-current/5">
                    {searchResults.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          setSearchQuery('');
                          navigate('/dashboard/transactions');
                        }}
                        className="w-full px-2 py-2 text-left flex items-center justify-between hover:bg-current/5 rounded-lg transition-colors"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-semibold truncate">{t.merchant}</p>
                          <p className="text-[10px] text-[#6E7A8E] dark:text-[#929DB0] truncate">
                            {t.date} • {t.category}
                          </p>
                        </div>
                        <span
                          className={`font-mono text-xs font-semibold tabular-nums ml-2 ${
                            t.amount > 0 ? 'text-[#36C995]' : ''
                          }`}
                        >
                          {formatCurrency(t.amount, {
                            masked: balancesMasked,
                            showSign: true,
                            currency: profile.preferredCurrency,
                          })}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Controls: Mask Toggle, Reset Demo, Notifications, Theme, Profile */}
          <div className="flex items-center gap-2">
            {/* Balance Visibility Mask Toggle */}
            <button
              type="button"
              onClick={toggleBalancesMasked}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                balancesMasked
                  ? 'bg-[#D6B878]/20 border-[#D6B878] text-[#B39352] dark:text-[#D6B878]'
                  : 'bg-white dark:bg-[#141D2D] border-current/15 text-[#080D18] dark:text-[#F5F2EA]'
              }`}
              title={balancesMasked ? 'Reveal demo balances' : 'Mask demo balances for privacy'}
            >
              {balancesMasked ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{balancesMasked ? 'Masked' : 'Balances'}</span>
            </button>

            {/* Reset Demo State Action */}
            <button
              type="button"
              onClick={resetDemoData}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-white dark:bg-[#141D2D] border border-current/15 hover:border-[#D6B878] transition-colors"
              title="Restore all demo balances, transactions, and cards to initial baseline"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#D6B878]" />
              <span className="hidden xl:inline">Reset Demo</span>
            </button>

            {/* Interactive Notification Center Trigger */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotifOpen((prev) => !prev)}
                className="relative p-2 rounded-xl bg-white dark:bg-[#141D2D] border border-current/15 hover:border-[#D6B878] transition-colors"
                aria-label="Notifications"
                aria-expanded={notifOpen}
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#D6B878] text-[#080D18] font-mono text-[10px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-[#141D2D] border border-[#080D18]/15 dark:border-[#D6B878]/35 shadow-luxury z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 ease-out">
                  <div className="p-4 border-b border-current/10 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold">Client Alert Center</h3>
                      <p className="text-[11px] text-[#6E7A8E] dark:text-[#929DB0]">
                        {unreadCount} unread simulated notifications
                      </p>
                    </div>
                    {notifications.length > 0 && (
                      <button
                        type="button"
                        onClick={markAllNotificationsRead}
                        className="inline-flex items-center gap-1 text-xs text-[#B39352] dark:text-[#D6B878] hover:underline"
                      >
                        <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-current/10">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-[#6E7A8E] dark:text-[#929DB0]">
                        No active notifications in your demo inbox.
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`p-3.5 transition-colors flex items-start justify-between gap-3 ${
                            !n.read ? 'bg-[#D6B878]/[0.07]' : ''
                          }`}
                        >
                          <div
                            className="flex-1 min-w-0 cursor-pointer"
                            onClick={() => {
                              markNotificationRead(n.id);
                              setNotifOpen(false);
                              if (n.actionRoute) navigate(n.actionRoute);
                            }}
                          >
                            <div className="flex items-center gap-2">
                              {!n.read && (
                                <span className="w-2 h-2 rounded-full bg-[#D6B878] shrink-0" />
                              )}
                              <span className="text-xs font-semibold truncate">{n.title}</span>
                            </div>
                            <p className="text-xs text-[#4A5568] dark:text-[#929DB0] mt-1 leading-relaxed">
                              {n.message}
                            </p>
                            <span className="text-[10px] font-mono text-[#6E7A8E] dark:text-[#929DB0] mt-1 block">
                              {n.timestamp} • {n.category}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => dismissNotification(n.id)}
                            className="p-1 text-[#6E7A8E] hover:text-[#FF7777] rounded"
                            aria-label="Dismiss notification"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-white dark:bg-[#141D2D] border border-current/15 hover:border-[#D6B878] transition-colors"
              aria-label="Toggle color theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-[#D6B878]" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>

            {/* Profile Avatar Link */}
            <Link
              to="/dashboard/profile"
              className="w-8 h-8 rounded-xl bg-[#D6B878] text-[#080D18] font-serif font-bold text-xs flex items-center justify-center shrink-0"
              title={profile.fullName}
            >
              JS
            </Link>
          </div>
        </header>

        {/* Explicit Currency Conversion Banner when non-USD display preference is active */}
        {profile.preferredCurrency !== 'USD' && (
          <div className="bg-[#D6B878]/15 border-b border-[#D6B878]/30 px-4 sm:px-8 py-2 text-xs flex items-center justify-between">
            <span>
              <strong>Currency Conversion Notice:</strong> Base accounts are denominated in{' '}
              <strong>USD</strong>. Values are displayed in{' '}
              <strong>{profile.preferredCurrency}</strong> using the illustrative fixed conversion
              rate of{' '}
              <span className="font-mono">
                1 USD = {CURRENCY_RATES[profile.preferredCurrency].rate} {profile.preferredCurrency}
              </span>
              .
            </span>
            <Link to="/dashboard/settings" className="text-[#B39352] dark:text-[#D6B878] underline ml-2">
              Change Currency
            </Link>
          </div>
        )}

        {/* MOBILE DRAWER */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative w-72 max-w-[85vw] bg-white dark:bg-[#0D1423] h-full p-5 flex flex-col justify-between z-10">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <BrandMark to="/" size="sm" />
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-lg border border-current/15"
                    aria-label="Close navigation"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <nav className="space-y-1">
                  {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.end}
                        onClick={() => setMobileMenuOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium ${
                            isActive
                              ? 'bg-[#D6B878] text-[#080D18] font-semibold'
                              : 'text-[#4A5568] dark:text-[#929DB0]'
                          }`
                        }
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </NavLink>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-4 border-t border-current/10 space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    resetDemoData();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 px-3 rounded-xl border border-[#D6B878]/40 text-xs font-semibold text-[#B39352] dark:text-[#D6B878] flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset Demo Data
                </button>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full py-2.5 px-3 rounded-xl text-xs font-medium text-[#FF7777] flex items-center justify-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" /> Exit to Public Site
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PAGE CONTENT */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-16 max-w-7xl w-full mx-auto">
          <div key={location.pathname} className="page-transition-enter">
            <Outlet />
          </div>

          {/* Dashboard Page Bottom Footer */}
          <footer className="mt-12 pt-6 border-t border-[#D6B878]/20 dark:border-[#F5F2EA]/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#6B778D] dark:text-[#929DB0]">
            <span>© {new Date().getFullYear()} AURELION Private Client Terminal (Demo Sandbox)</span>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-[#141D2D] border border-[#D6B878]/35 font-serif text-sm text-[#0A0F1A] dark:text-[#F5F2EA] shadow-sm dark:shadow-none">
              <Sparkles className="w-3.5 h-3.5 text-[#9E7B35] dark:text-[#D6B878]" />
              <span>
                Made by <strong className="text-[#9E7B35] dark:text-[#D6B878] font-semibold">Aditya Misra</strong>
              </span>
            </span>
          </footer>
        </main>
      </div>

      {/* Persistent Window-Bottom Creator Signature Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 h-9 bg-[#FAF8F5]/95 dark:bg-[#080D18]/95 backdrop-blur-md border-t border-[#D6B878]/25 dark:border-[#D6B878]/30 px-4 flex items-center justify-center gap-2 text-xs text-[#0A0F1A] dark:text-[#F5F2EA]">
        <Sparkles className="w-3.5 h-3.5 text-[#9E7B35] dark:text-[#D6B878]" />
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#6B778D] dark:text-[#929DB0] hidden sm:inline">
          AURELION Client Terminal
        </span>
        <span className="text-[#9E7B35]/50 dark:text-[#D6B878]/50 hidden sm:inline">•</span>
        <span className="font-serif text-sm tracking-wide">
          Made by <strong className="text-[#9E7B35] dark:text-[#D6B878] font-semibold">Aditya Misra</strong>
        </span>
      </div>

      <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} />
    </div>
  );
};
