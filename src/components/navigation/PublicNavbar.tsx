import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { BrandMark } from '../ui/BrandMark';
import { useBanking } from '../../contexts/BankingContext';
import {
  ChevronDown,
  Menu,
  X,
  Sun,
  Moon,
  ShieldCheck,
  CreditCard,
  Landmark,
  ArrowRightLeft,
  Compass,
  Briefcase,
  Sparkles,
  ArrowUpRight,
  Search,
} from 'lucide-react';

const MEGA_MENU_ITEMS = [
  {
    title: 'Personal Banking',
    description: 'Automated inflow sweeps & multi-vault liquidity.',
    to: '/personal-banking',
    icon: Landmark,
    badge: 'Core',
  },
  {
    title: 'Signature Accounts',
    description: 'Essential, Elevate, and Private account tiers.',
    to: '/accounts',
    icon: Sparkles,
    badge: '3 Tiers',
  },
  {
    title: 'Precision Metal Cards',
    description: 'Obsidian, Champagne, Arctic, and Emerald studio.',
    to: '/cards',
    icon: CreditCard,
    badge: '3D Studio',
  },
  {
    title: 'Global Payments',
    description: 'Instant internal sweeps & FX corridor estimator.',
    to: '/payments',
    icon: ArrowRightLeft,
  },
  {
    title: 'Private Credit',
    description: 'Portfolio credit lines & amortization visualizer.',
    to: '/loans',
    icon: Briefcase,
  },
  {
    title: 'Wealth & Treasury',
    description: 'Mandate archetypes & compound reserve growth.',
    to: '/wealth',
    icon: Compass,
  },
];

interface PublicNavbarProps {
  onOpenCommandPalette?: () => void;
}

export const PublicNavbar: React.FC<PublicNavbarProps> = ({ onOpenCommandPalette }) => {
  const { theme, toggleTheme } = useBanking();
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 16);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMegaOpen(false);
    setMobileOpen(false);
  }, [location.pathname]);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B878] ${
      isActive
        ? 'text-[#B39352] dark:text-[#D6B878]'
        : 'text-[#080D18]/80 dark:text-[#F5F2EA]/80 hover:text-[#080D18] dark:hover:text-[#F5F2EA]'
    }`;

  return (
    <header
      className={`public-navbar sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-[#F5F2EA]/90 dark:bg-[#080D18]/90 backdrop-blur-xl border-b border-[#080D18]/10 dark:border-[#F5F2EA]/10 shadow-sm'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <nav
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between"
        aria-label="Primary Navigation"
      >
        <div className="flex items-center gap-3">
          <BrandMark size="md" />
          <span className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest bg-[#36C995]/15 text-[#36C995] border border-[#36C995]/30">
            <i className="w-1.5 h-1.5 rounded-full bg-[#36C995]" /> Interactive Demo
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-1">
          <div
            className="relative"
            onMouseEnter={() => setMegaOpen(true)}
            onMouseLeave={() => setMegaOpen(false)}
          >
            <button
              type="button"
              onClick={() => setMegaOpen((prev) => !prev)}
              aria-expanded={megaOpen}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#080D18]/80 dark:text-[#F5F2EA]/80 hover:text-[#080D18] dark:hover:text-[#F5F2EA] rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B878]"
            >
              <span>Personal Banking</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  megaOpen ? 'rotate-180 text-[#D6B878]' : ''
                }`}
              />
            </button>

            {megaOpen && (
              <div className="absolute left-0 top-full pt-2 w-[620px] z-50 animate-in fade-in slide-in-from-top-2 duration-200 ease-out">
                <div className="rounded-2xl bg-white dark:bg-[#141D2D] border border-[#080D18]/10 dark:border-[#D6B878]/25 shadow-luxury p-5 grid grid-cols-2 gap-3">
                  {MEGA_MENU_ITEMS.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        className="group flex items-start gap-3.5 p-3 rounded-xl hover:bg-[#080D18]/[0.04] dark:hover:bg-[#F5F2EA]/[0.04] transition-colors"
                      >
                        <div className="p-2.5 rounded-lg bg-[#D6B878]/15 text-[#B39352] dark:text-[#D6B878] group-hover:bg-[#D6B878] group-hover:text-[#080D18] transition-colors">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-[#080D18] dark:text-[#F5F2EA] group-hover:text-[#B39352] dark:group-hover:text-[#D6B878] transition-colors">
                              {item.title}
                            </span>
                            {item.badge && (
                              <span className="text-[11px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#D6B878]/15 text-[#B39352] dark:text-[#D6B878]">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#6E7A8E] dark:text-[#929DB0] mt-0.5">
                            {item.description}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                  <div className="col-span-2 mt-1 pt-3 border-t border-[#080D18]/10 dark:border-[#F5F2EA]/10 flex items-center justify-between px-2">
                    <div className="flex items-center gap-2 text-xs text-[#6E7A8E] dark:text-[#929DB0]">
                      <ShieldCheck className="w-4 h-4 text-[#36C995]" />
                      <span>Synthetic portfolio sandbox ready</span>
                    </div>
                    <Link
                      to="/dashboard"
                      className="text-xs font-semibold text-[#B39352] dark:text-[#D6B878] hover:underline inline-flex items-center gap-1"
                    >
                      Launch Client Portal <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          <NavLink to="/accounts" className={navLinkClass}>
            Accounts
          </NavLink>
          <NavLink to="/cards" className={navLinkClass}>
            Cards
          </NavLink>
          <NavLink to="/wealth" className={navLinkClass}>
            Wealth
          </NavLink>
          <NavLink to="/security" className={navLinkClass}>
            Security
          </NavLink>
          <NavLink to="/about" className={navLinkClass}>
            About
          </NavLink>
        </div>

        {/* Right Actions */}
        <div className="hidden lg:flex items-center gap-2.5">
          {onOpenCommandPalette && (
            <button
              type="button"
              onClick={onOpenCommandPalette}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[#080D18]/10 dark:border-[#F5F2EA]/10 bg-white/50 dark:bg-[#141D2D]/60 text-xs text-[#6E7A8E] dark:text-[#929DB0] hover:border-[#D6B878]/50 hover:text-[#080D18] dark:hover:text-[#F5F2EA] transition-colors"
              aria-label="Open Quick Command Palette"
            >
              <Search className="w-3.5 h-3.5 text-[#D6B878]" />
              <span>Quick Jump</span>
              <kbd className="px-1.5 py-0.5 text-[11px] font-mono rounded bg-[#080D18]/5 dark:bg-[#0D1423] border border-current/15">
                ⌘K
              </kbd>
            </button>
          )}

          <button
            type="button"
            onClick={toggleTheme}
            className="p-2.5 rounded-lg border border-[#080D18]/10 dark:border-[#F5F2EA]/10 text-[#080D18]/80 dark:text-[#F5F2EA]/80 hover:border-[#D6B878]/50 transition-colors"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-[#D6B878]" /> : <Moon className="w-4 h-4" />}
          </button>

          <Link
            to="/dashboard"
            className="px-3.5 py-2 rounded-lg text-xs font-mono uppercase tracking-wider border border-[#D6B878]/40 text-[#B39352] dark:text-[#D6B878] hover:bg-[#D6B878]/15 transition-colors inline-flex items-center gap-1"
          >
            <span>Client Portal</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>

          <Link
            to="/login"
            className="px-3.5 py-2 text-sm font-medium text-[#080D18] dark:text-[#F5F2EA] hover:text-[#B39352] dark:hover:text-[#D6B878] transition-colors"
          >
            Log In
          </Link>

          <Link
            to="/signup"
            className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-[#D6B878] hover:bg-[#E5CFA0] text-[#080D18] shadow-sm transition-all duration-200 active:scale-[0.98]"
          >
            Open an Account
          </Link>
        </div>

        {/* Mobile Menu Controls */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-[#080D18]/10 dark:border-[#F5F2EA]/10 text-[#080D18] dark:text-[#F5F2EA]"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-[#D6B878]" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="p-2.5 rounded-lg border border-[#080D18]/10 dark:border-[#F5F2EA]/15 text-[#080D18] dark:text-[#F5F2EA]"
            aria-label="Toggle Menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#F5F2EA] dark:bg-[#0D1423] border-b border-[#080D18]/10 dark:border-[#F5F2EA]/10 px-4 pt-3 pb-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200 ease-out">
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { label: 'Personal Banking', to: '/personal-banking' },
              { label: 'Accounts', to: '/accounts' },
              { label: 'Cards Studio', to: '/cards' },
              { label: 'Payments', to: '/payments' },
              { label: 'Private Credit', to: '/loans' },
              { label: 'Wealth', to: '/wealth' },
              { label: 'Security', to: '/security' },
              { label: 'About', to: '/about' },
              { label: 'Contact', to: '/contact' },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="px-3 py-2 rounded-lg text-xs font-medium text-[#080D18] dark:text-[#F5F2EA] hover:bg-[#D6B878]/15"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="pt-3 border-t border-[#080D18]/10 dark:border-[#F5F2EA]/10 flex flex-col gap-2">
            <Link
              to="/dashboard"
              className="w-full py-2.5 px-4 rounded-lg text-center text-xs font-semibold border border-[#D6B878]/50 text-[#B39352] dark:text-[#D6B878]"
            >
              Launch Live Client Dashboard
            </Link>
            <div className="grid grid-cols-2 gap-2">
              <Link
                to="/login"
                className="py-2.5 px-4 rounded-lg text-center text-xs font-medium bg-[#080D18]/5 dark:bg-[#141D2D]"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="py-2.5 px-4 rounded-lg text-center text-xs font-semibold bg-[#D6B878] text-[#080D18]"
              >
                Open an Account
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
