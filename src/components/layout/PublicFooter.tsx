import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BrandMark } from '../ui/BrandMark';
import { useBanking } from '../../contexts/BankingContext';
import { ArrowRight, CheckCircle2, Info, ChevronDown } from 'lucide-react';

export const PublicFooter: React.FC = () => {
  const { addToast } = useBanking();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [showDisclosure, setShowDisclosure] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;
    setSubscribed(true);
    setEmail('');
    addToast({
      title: 'Subscribed',
      description: 'Added to quarterly briefing list (demo).',
      variant: 'success',
    });
  };

  return (
    <footer className="bg-[#FAF6EE] dark:bg-[#080D18] text-[#0A0F1A] dark:text-[#F5F2EA] border-t border-[#D6B878]/30 dark:border-[#F5F2EA]/10">
      {/* Compact Closing CTA Banner */}
      <div className="relative overflow-hidden border-b border-[#D6B878]/25 dark:border-[#F5F2EA]/10 py-14 px-4 sm:px-6 lg:px-8">
        <div
          className="absolute inset-0 bg-radial-gold pointer-events-none opacity-75"
          aria-hidden="true"
        />
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4">
          <h2 className="font-serif text-3xl sm:text-5xl font-semibold tracking-tight text-[#0A0F1A] dark:text-[#F5F2EA]">
            Ready for clearer banking?
          </h2>
          <p className="max-w-xl mx-auto text-sm sm:text-base text-[#445064] dark:text-[#929DB0]">
            Unite checking, high-yield vaults, and metal card controls in one calm interface.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#D6B878] hover:bg-[#E5CFA0] text-[#080D18] font-semibold text-sm transition-all shadow-gold-glow"
            >
              <span>Open Account</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-[#F3EFE6] dark:bg-[#141D2D] dark:hover:bg-[#1B273D] text-[#0A0F1A] dark:text-[#F5F2EA] border border-[#D6B878]/35 dark:border-[#F5F2EA]/15 font-medium text-sm transition-all shadow-sm dark:shadow-none"
            >
              <span>Live Dashboard</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 pb-10 border-b border-[#0A0F1A]/10 dark:border-[#F5F2EA]/10">
          {/* Brand & Newsletter */}
          <div className="col-span-2 space-y-4">
            <BrandMark size="md" showTagline />
            <p className="text-xs text-[#5A6679] dark:text-[#929DB0] max-w-xs">
              Private digital banking with real-time cash flow, multi-vault liquidity, and precision card controls.
            </p>

            <form onSubmit={handleSubscribe} className="max-w-xs pt-1">
              {subscribed ? (
                <div className="flex items-center gap-2 text-xs text-[#36C995] bg-[#36C995]/10 border border-[#36C995]/30 px-3 py-2 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Subscribed (local demo).</span>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    id="footer-briefing-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email for product updates"
                    aria-label="Email for product updates"
                    className="flex-1 min-w-0 px-3 py-2 rounded-lg text-xs bg-white dark:bg-[#141D2D] border border-[#D6B878]/35 dark:border-[#F5F2EA]/15 text-[#0A0F1A] dark:text-[#F5F2EA] placeholder-[#6B778D]/60 dark:placeholder-[#929DB0]/60 focus:outline-none focus:border-[#D6B878] shadow-sm dark:shadow-none"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-[#D6B878] text-[#080D18] hover:bg-[#E5CFA0] transition-colors shrink-0"
                  >
                    Join
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Products */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9E7B35] dark:text-[#D6B878]">
              Products
            </h3>
            <ul className="space-y-2 text-xs text-[#445064] dark:text-[#929DB0]">
              <li><Link to="/personal-banking" className="hover:text-[#0A0F1A] dark:hover:text-[#F5F2EA]">Personal Banking</Link></li>
              <li><Link to="/accounts" className="hover:text-[#0A0F1A] dark:hover:text-[#F5F2EA]">Accounts</Link></li>
              <li><Link to="/cards" className="hover:text-[#0A0F1A] dark:hover:text-[#F5F2EA]">Metal Cards</Link></li>
              <li><Link to="/payments" className="hover:text-[#0A0F1A] dark:hover:text-[#F5F2EA]">Global Payments</Link></li>
              <li><Link to="/loans" className="hover:text-[#0A0F1A] dark:hover:text-[#F5F2EA]">Private Credit</Link></li>
              <li><Link to="/wealth" className="hover:text-[#0A0F1A] dark:hover:text-[#F5F2EA]">Wealth</Link></li>
            </ul>
          </div>

          {/* Dashboard */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9E7B35] dark:text-[#D6B878]">
              Dashboard
            </h3>
            <ul className="space-y-2 text-xs text-[#445064] dark:text-[#929DB0]">
              <li><Link to="/dashboard" className="hover:text-[#0A0F1A] dark:hover:text-[#F5F2EA]">Overview</Link></li>
              <li><Link to="/dashboard/accounts" className="hover:text-[#0A0F1A] dark:hover:text-[#F5F2EA]">Accounts</Link></li>
              <li><Link to="/dashboard/transactions" className="hover:text-[#0A0F1A] dark:hover:text-[#F5F2EA]">Transactions</Link></li>
              <li><Link to="/dashboard/transfers" className="hover:text-[#0A0F1A] dark:hover:text-[#F5F2EA]">Transfers</Link></li>
              <li><Link to="/dashboard/cards" className="hover:text-[#0A0F1A] dark:hover:text-[#F5F2EA]">Card Controls</Link></li>
              <li><Link to="/dashboard/analytics" className="hover:text-[#0A0F1A] dark:hover:text-[#F5F2EA]">Analytics</Link></li>
            </ul>
          </div>

          {/* Company & Trust */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9E7B35] dark:text-[#D6B878]">
              Trust
            </h3>
            <ul className="space-y-2 text-xs text-[#445064] dark:text-[#929DB0]">
              <li><Link to="/security" className="hover:text-[#0A0F1A] dark:hover:text-[#F5F2EA]">Security</Link></li>
              <li><Link to="/about" className="hover:text-[#0A0F1A] dark:hover:text-[#F5F2EA]">About</Link></li>
              <li><Link to="/contact" className="hover:text-[#0A0F1A] dark:hover:text-[#F5F2EA]">Contact</Link></li>
              <li><Link to="/dashboard/settings" className="hover:text-[#0A0F1A] dark:hover:text-[#F5F2EA]">Settings</Link></li>
            </ul>
          </div>

          {/* Access */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9E7B35] dark:text-[#D6B878]">
              Access
            </h3>
            <ul className="space-y-2 text-xs text-[#445064] dark:text-[#929DB0]">
              <li><Link to="/login" className="hover:text-[#0A0F1A] dark:hover:text-[#F5F2EA]">Sign In</Link></li>
              <li><Link to="/signup" className="hover:text-[#0A0F1A] dark:hover:text-[#F5F2EA]">Open Account</Link></li>
              <li><Link to="/dashboard/profile" className="hover:text-[#0A0F1A] dark:hover:text-[#F5F2EA]">Client Profile</Link></li>
            </ul>
          </div>
        </div>

        {/* Progressive Disclosure Disclaimer & Creator Attribution */}
        <div className="pt-6 space-y-4 text-xs text-[#5A6679] dark:text-[#929DB0]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p>
              © {new Date().getFullYear()} AURELION Digital Banking. Made by{' '}
              <strong className="text-[#9E7B35] dark:text-[#D6B878] font-semibold">Aditya Misra</strong>.
            </p>

            <button
              type="button"
              onClick={() => setShowDisclosure((p) => !p)}
              className="inline-flex items-center gap-1.5 text-xs text-[#5A6679] dark:text-[#929DB0] hover:text-[#0A0F1A] dark:hover:text-[#F5F2EA] transition-colors"
            >
              <Info className="w-3.5 h-3.5 text-[#9E7B35] dark:text-[#D6B878]" />
              <span>Interactive Demo Sandbox • View Disclosure</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${showDisclosure ? 'rotate-180' : ''}`}
              />
            </button>
          </div>

          {showDisclosure && (
            <div className="p-3.5 rounded-xl bg-white/80 dark:bg-[#141D2D]/80 border border-[#D6B878]/30 dark:border-[#F5F2EA]/10 text-xs leading-relaxed shadow-sm dark:shadow-none">
              AURELION is an interactive digital banking demonstration powered by synthetic sample
              data. All balances, yields, cards, and transfers are illustrative simulations. Never
              enter real banking credentials or payment card numbers.
            </div>
          )}

          {/* Creator Signature Pill */}
          <div className="pt-3 pb-4 flex items-center justify-center">
            <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white dark:bg-[#141D2D] border border-[#D6B878]/40 shadow-sm dark:shadow-gold-glow">
              <span className="w-2 h-2 rounded-full bg-[#9E7B35] dark:bg-[#D6B878]" />
              <span className="font-serif text-sm tracking-wide text-[#0A0F1A] dark:text-[#F5F2EA]">
                Made by <strong className="text-[#9E7B35] dark:text-[#D6B878] font-semibold">Aditya Misra</strong>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
