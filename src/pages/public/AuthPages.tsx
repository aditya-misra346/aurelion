import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useBanking } from '../../contexts/BankingContext';
import { AccountTier } from '../../types/banking';
import {
  ShieldAlert,
  Fingerprint,
  ArrowRight,
  CheckCircle2,
  UserCheck,
  Sparkles,
  KeyRound,
} from 'lucide-react';

/* ============================================================================
   11. /login — SAFE DEMO SIGN-IN PORTAL
   ============================================================================ */
export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { profile, addToast } = useBanking();
  const [selectedPersona, setSelectedPersona] = useState<'sterling' | 'custom'>('sterling');
  const [customDemoName, setCustomDemoName] = useState('');

  const handleDemoLaunch = (e: React.FormEvent) => {
    e.preventDefault();
    addToast({
      title: 'Demo Session Authenticated',
      description: `Welcome to the Aurelion Client Portal (${profile.fullName}).`,
      variant: 'success',
    });
    navigate('/dashboard');
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
      <div className="rounded-3xl bg-white dark:bg-[#141D2D] border border-[#080D18]/10 dark:border-[#D6B878]/30 p-8 sm:p-10 shadow-luxury space-y-6">
        <div className="space-y-2 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-[0.2em] bg-[#D6B878]/15 text-[#B39352] dark:text-[#D6B878]">
            <KeyRound className="w-3.5 h-3.5" /> Sandbox Portal
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold">
            Client Sign-In
          </h1>
          <p className="text-xs sm:text-sm text-[#6E7A8E] dark:text-[#929DB0]">
            Instant 1-click access to the pre-configured private banking sandbox.
          </p>
        </div>

        {/* Compact Security Pill */}
        <div className="px-4 py-2.5 rounded-xl bg-[#F5F2EA] dark:bg-[#0D1423] border border-[#D6B878]/35 flex items-center justify-center gap-2 text-xs text-[#4A5568] dark:text-[#929DB0]">
          <ShieldAlert className="w-4 h-4 text-[#D6B878] shrink-0" />
          <span>No password required • 100% local sandbox session</span>
        </div>

        <form onSubmit={handleDemoLaunch} className="space-y-4">
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setSelectedPersona('sterling')}
              className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                selectedPersona === 'sterling'
                  ? 'border-[#D6B878] bg-[#D6B878]/10'
                  : 'border-current/10 opacity-75 hover:opacity-100'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-[#D6B878] text-[#080D18] font-serif font-bold flex items-center justify-center text-base">
                  JS
                </div>
                <div>
                  <p className="text-sm font-semibold">{profile.fullName}</p>
                  <p className="text-xs text-[#6E7A8E] dark:text-[#929DB0]">
                    Private Tier • 3 Accounts • $892,050 Liquidity
                  </p>
                </div>
              </div>
              <CheckCircle2
                className={`w-5 h-5 ${
                  selectedPersona === 'sterling' ? 'text-[#D6B878]' : 'opacity-20'
                }`}
              />
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-4 px-6 rounded-xl bg-[#D6B878] hover:bg-[#E5CFA0] text-[#080D18] font-semibold text-sm flex items-center justify-center gap-2 shadow-gold-glow transition-all"
          >
            <Fingerprint className="w-4 h-4" />
            <span>Enter Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-current/10 flex items-center justify-between text-xs text-[#6E7A8E] dark:text-[#929DB0]">
          <span>New to Aurelion?</span>
          <Link to="/signup" className="text-[#B39352] dark:text-[#D6B878] font-semibold hover:underline">
            Customize Tier & Profile →
          </Link>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   12. /signup — INTERACTIVE DEMO ACCOUNT ONBOARDING FLOW
   ============================================================================ */
export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { profile, updateProfile, addToast } = useBanking();
  const [step, setStep] = useState<1 | 2>(1);
  const [tier, setTier] = useState<AccountTier>(profile.membershipTier);
  const [fullName, setFullName] = useState(profile.fullName);
  const [title, setTitle] = useState(profile.title);
  const [currency, setCurrency] = useState<'USD' | 'EUR' | 'GBP' | 'CHF'>(profile.preferredCurrency);

  const handleCompleteOnboarding = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      fullName: fullName.trim() || 'Julian V. Sterling',
      title: title.trim() || 'Private Client',
      membershipTier: tier,
      preferredCurrency: currency,
    });
    addToast({
      title: 'Simulated Account Configured',
      description: `Welcome to Aurelion ${tier} Banking, ${fullName || 'Client'}.`,
      variant: 'success',
    });
    navigate('/dashboard');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <div className="rounded-3xl bg-white dark:bg-[#141D2D] border border-[#080D18]/10 dark:border-[#D6B878]/30 p-8 sm:p-10 shadow-luxury space-y-8">
        <div className="flex items-center justify-between border-b border-current/10 pb-5">
          <div>
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#B39352] dark:text-[#D6B878] block">
              Simulated Onboarding • Step {step} of 2
            </span>
            <h1 className="font-serif text-3xl font-semibold mt-1">
              Configure Your Aurelion Experience
            </h1>
          </div>
          <Sparkles className="w-6 h-6 text-[#D6B878]" />
        </div>

        {step === 1 ? (
          <div className="space-y-6">
            <p className="text-sm text-[#4A5568] dark:text-[#929DB0]">
              Choose your preferred account tier:
            </p>
            <div className="grid grid-cols-1 gap-3.5">
              {(
                [
                  {
                    id: 'Essential' as const,
                    desc: 'Core checking, Arctic Silver card, and smart budgets.',
                  },
                  {
                    id: 'Elevate' as const,
                    desc: 'Multi-vault routing and Champagne Reserve alloy card.',
                  },
                  {
                    id: 'Private' as const,
                    desc: 'Full operating, reserve vault, treasury, and Titanium card.',
                  },
                ]
              ).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTier(item.id)}
                  className={`p-5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                    tier === item.id
                      ? 'border-[#D6B878] bg-[#D6B878]/10'
                      : 'border-current/15 opacity-75 hover:opacity-100'
                  }`}
                >
                  <div>
                    <p className="font-serif text-xl font-semibold">{item.id} Tier</p>
                    <p className="text-xs text-[#6E7A8E] dark:text-[#929DB0] mt-1">{item.desc}</p>
                  </div>
                  <CheckCircle2
                    className={`w-5 h-5 shrink-0 ${
                      tier === item.id ? 'text-[#D6B878]' : 'opacity-20'
                    }`}
                  />
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full py-3.5 px-6 rounded-xl bg-[#D6B878] hover:bg-[#E5CFA0] text-[#080D18] font-semibold text-sm flex items-center justify-center gap-2"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleCompleteOnboarding} className="space-y-5">
            <div>
              <label htmlFor="onboard-name" className="block text-xs font-medium mb-1.5">
                Client Name
              </label>
              <input
                id="onboard-name"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#F5F2EA] dark:bg-[#0D1423] border border-current/15 text-sm focus:outline-none focus:border-[#D6B878]"
              />
            </div>

            <div>
              <label htmlFor="onboard-title" className="block text-xs font-medium mb-1.5">
                Role / Title
              </label>
              <input
                id="onboard-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#F5F2EA] dark:bg-[#0D1423] border border-current/15 text-sm focus:outline-none focus:border-[#D6B878]"
              />
            </div>

            <div>
              <label htmlFor="onboard-currency" className="block text-xs font-medium mb-1.5">
                Display Currency
              </label>
              <select
                id="onboard-currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value as 'USD' | 'EUR' | 'GBP' | 'CHF')}
                className="w-full px-4 py-3 rounded-xl bg-[#F5F2EA] dark:bg-[#0D1423] border border-current/15 text-sm focus:outline-none focus:border-[#D6B878]"
              >
                <option value="USD">USD ($) — Base Ledger</option>
                <option value="EUR">EUR (€) — Euro</option>
                <option value="GBP">GBP (£) — British Pound</option>
                <option value="CHF">CHF — Swiss Franc</option>
              </select>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-3.5 rounded-xl border border-current/15 text-sm font-medium"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 py-3.5 px-6 rounded-xl bg-[#D6B878] hover:bg-[#E5CFA0] text-[#080D18] font-semibold text-sm flex items-center justify-center gap-2"
              >
                <UserCheck className="w-4 h-4" />
                <span>Complete Setup</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
