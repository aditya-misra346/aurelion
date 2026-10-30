import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBanking } from '../../contexts/BankingContext';
import {
  Sun,
  Moon,
  RotateCcw,
  LogOut,
  Laptop,
  Smartphone,
} from 'lucide-react';

/* ============================================================================
   20. /dashboard/profile — CLIENT PROFILE PAGE
   ============================================================================ */
export const DashboardProfilePage: React.FC = () => {
  const { profile, updateProfile } = useBanking();
  const [fullName, setFullName] = useState(profile.fullName);
  const [title, setTitle] = useState(profile.title);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [residency, setResidency] = useState(profile.residency);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      fullName: fullName.trim() || profile.fullName,
      title: title.trim() || profile.title,
      email: email.trim() || profile.email,
      phone: phone.trim() || profile.phone,
      residency: residency.trim() || profile.residency,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#B39352] dark:text-[#D6B878]">
          Client Dossier
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold mt-1">
          Profile & Private Advisor
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 5 Cols: Client Crest & Advisor Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl p-6 bg-gradient-to-br from-[#FFFFFF] via-[#FDFBF7] to-[#F5EFE4] dark:bg-[#0D1423] text-[#0A0F1A] dark:text-[#F5F2EA] border border-[#D6B878]/35 shadow-luxury-light dark:shadow-none space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#E5CFA0] to-[#B39352] text-[#080D18] font-serif font-bold text-2xl flex items-center justify-center shadow-sm">
                JS
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#9E7B35] dark:text-[#D6B878]">
                  {profile.membershipTier} Client Tier
                </span>
                <h2 className="font-serif text-2xl font-semibold">{profile.fullName}</h2>
                <p className="text-xs text-[#6B778D] dark:text-[#929DB0]">ID: {profile.clientId}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#0A0F1A]/10 dark:border-[#F5F2EA]/10 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-[#6B778D] dark:text-[#929DB0]">Member Since</span>
                <span className="font-mono">{profile.memberSince}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B778D] dark:text-[#929DB0]">Primary Jurisdiction</span>
                <span>{profile.residency}</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl p-6 bg-white dark:bg-[#141D2D] border border-[#080D18]/10 dark:border-[#F5F2EA]/10 space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#B39352] dark:text-[#D6B878]">
              Assigned Private Desk (Fictional)
            </span>
            <h3 className="font-serif text-xl font-semibold">{profile.privateAdvisorName}</h3>
            <p className="text-xs text-[#6E7A8E] dark:text-[#929DB0]">{profile.privateAdvisorTitle}</p>
            <p className="text-xs text-[#6E7A8E] dark:text-[#929DB0] pt-2">
              Direct Desk: +1 (212) 555-0199 • Zurich / New York Corridor
            </p>
          </div>
        </div>

        {/* Right 7 Cols: Editable Fictional Profile Form */}
        <form
          onSubmit={handleSave}
          className="lg:col-span-7 rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#141D2D] border border-[#080D18]/10 dark:border-[#F5F2EA]/10 space-y-5"
        >
          <h2 className="font-serif text-2xl font-semibold">
            Client Details
          </h2>
          <p className="text-xs text-[#6E7A8E] dark:text-[#929DB0]">
            Changes persist across your local sandbox session.
          </p>

          <div className="space-y-4">
            <div>
              <label htmlFor="prof-name" className="block text-xs font-medium mb-1">
                Full Name
              </label>
              <input
                id="prof-name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#F5F2EA] dark:bg-[#0D1423] border border-current/15 text-sm"
              />
            </div>

            <div>
              <label htmlFor="prof-title" className="block text-xs font-medium mb-1">
                Role / Title
              </label>
              <input
                id="prof-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#F5F2EA] dark:bg-[#0D1423] border border-current/15 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="prof-email" className="block text-xs font-medium mb-1">
                  Email
                </label>
                <input
                  id="prof-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F5F2EA] dark:bg-[#0D1423] border border-current/15 text-sm"
                />
              </div>
              <div>
                <label htmlFor="prof-phone" className="block text-xs font-medium mb-1">
                  Telephone
                </label>
                <input
                  id="prof-phone"
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F5F2EA] dark:bg-[#0D1423] border border-current/15 text-sm font-mono"
                />
              </div>
            </div>

            <div>
              <label htmlFor="prof-residency" className="block text-xs font-medium mb-1">
                Primary Jurisdiction
              </label>
              <input
                id="prof-residency"
                type="text"
                value={residency}
                onChange={(e) => setResidency(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#F5F2EA] dark:bg-[#0D1423] border border-current/15 text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-[#D6B878] hover:bg-[#E5CFA0] text-[#080D18] text-xs font-semibold transition-colors"
          >
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
};

/* ============================================================================
   21. /dashboard/settings — SETTINGS, APPEARANCE, ACCESSIBILITY & SECURITY PAGE
   ============================================================================ */
export const DashboardSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    theme,
    setTheme,
    profile,
    updateProfile,
    balancesMasked,
    toggleBalancesMasked,
    resetDemoData,
    addToast,
  } = useBanking();

  const [activeDevices, setActiveDevices] = useState([
    {
      id: 'dev-1',
      name: 'MacBook Pro 16" — macOS Safari / Chrome',
      location: 'New York, United States',
      lastActive: 'Current Active Terminal',
      current: true,
    },
    {
      id: 'dev-2',
      name: 'iPhone 17 Pro — Aurelion Mobile Passkey',
      location: 'New York, United States',
      lastActive: 'Active 18 minutes ago',
      current: false,
    },
    {
      id: 'dev-3',
      name: 'iPad Pro 13" — Zurich Private Lounge',
      location: 'Zürich, Switzerland',
      lastActive: 'Active 3 days ago',
      current: false,
    },
  ]);

  const handleRevokeDevice = (id: string, name: string) => {
    setActiveDevices((prev) => prev.filter((d) => d.id !== id));
    addToast({
      title: 'Simulated Device Session Revoked',
      description: `Terminated session token for ${name}.`,
      variant: 'warning',
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#B39352] dark:text-[#D6B878]">
          Terminal Configuration
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold mt-1">
          Appearance, Security & Accessibility Settings
        </h1>
      </div>

      {/* Appearance & Currency Display */}
      <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#141D2D] border border-[#080D18]/10 dark:border-[#F5F2EA]/10 space-y-6">
        <h2 className="font-serif text-2xl font-semibold">
          Appearance & Display Currency
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-2xl border text-left flex items-center justify-between ${
              theme === 'dark'
                ? 'border-[#D6B878] bg-[#D6B878]/15'
                : 'border-current/15 opacity-70'
            }`}
          >
            <div className="flex items-center gap-3">
              <Moon className="w-5 h-5 text-[#D6B878]" />
              <div>
                <p className="text-sm font-semibold">Midnight Navy (Primary Dark)</p>
                <p className="text-xs text-[#6E7A8E] dark:text-[#929DB0]">
                  Signature private banking aesthetic
                </p>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`p-4 rounded-2xl border text-left flex items-center justify-between ${
              theme === 'light'
                ? 'border-[#D6B878] bg-[#D6B878]/15'
                : 'border-current/15 opacity-70'
            }`}
          >
            <div className="flex items-center gap-3">
              <Sun className="w-5 h-5 text-[#B39352]" />
              <div>
                <p className="text-sm font-semibold">Soft Ivory (Editorial Light)</p>
                <p className="text-xs text-[#6E7A8E] dark:text-[#929DB0]">
                  High-ambient daylight surface palette
                </p>
              </div>
            </div>
          </button>
        </div>

        <div className="pt-4 border-t border-current/10 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col justify-between">
            <div>
              <p className="text-sm font-semibold">Display Currency Preference</p>
              <p className="text-xs text-[#6E7A8E] dark:text-[#929DB0]">
                Converts base USD figures using transparent illustrative reference rates
              </p>
            </div>
            <select
              aria-label="Select preferred display currency"
              value={profile.preferredCurrency}
              onChange={(e) =>
                updateProfile({
                  preferredCurrency: e.target.value as 'USD' | 'EUR' | 'GBP' | 'CHF',
                })
              }
              className="mt-2 px-4 py-2.5 rounded-xl bg-[#F5F2EA] dark:bg-[#0D1423] border border-current/15 text-xs font-mono"
            >
              <option value="USD">USD ($) — Base Currency</option>
              <option value="EUR">EUR (€) — 0.92 Illustrative Rate</option>
              <option value="GBP">GBP (£) — 0.79 Illustrative Rate</option>
              <option value="CHF">CHF — 0.88 Illustrative Rate</option>
            </select>
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <p className="text-sm font-semibold">Idle Session Timeout (Simulated)</p>
              <p className="text-xs text-[#6E7A8E] dark:text-[#929DB0]">
                Automatic terminal lock duration for unattended sessions
              </p>
            </div>
            <select
              aria-label="Select session timeout duration"
              value={profile.sessionTimeoutMinutes}
              onChange={(e) =>
                updateProfile({ sessionTimeoutMinutes: Number(e.target.value) })
              }
              className="mt-2 px-4 py-2.5 rounded-xl bg-[#F5F2EA] dark:bg-[#0D1423] border border-current/15 text-xs font-mono"
            >
              <option value={5}>5 Minutes (Strict Vault Mode)</option>
              <option value={15}>15 Minutes (Recommended Private Default)</option>
              <option value={30}>30 Minutes (Extended Executive Desk)</option>
              <option value={60}>60 Minutes</option>
            </select>
          </div>
        </div>
      </div>

      {/* Security, Privacy & Accessibility Controls */}
      <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#141D2D] border border-[#080D18]/10 dark:border-[#F5F2EA]/10 space-y-4">
        <h2 className="font-serif text-2xl font-semibold">
          Security, Privacy & Accessibility
        </h2>

        {[
          {
            label: 'Mask Balances Globally',
            desc: 'Hide account totals across all views.',
            checked: balancesMasked,
            onToggle: toggleBalancesMasked,
          },
          {
            label: 'Biometric Passkey Challenge',
            desc: 'Step-up verification for high-value wires.',
            checked: profile.biometricEnabled,
            onToggle: () => updateProfile({ biometricEnabled: !profile.biometricEnabled }),
          },
          {
            label: 'Hardware Key Enforcement',
            desc: 'Require FIDO2 token for profile changes.',
            checked: profile.mfaEnabled,
            onToggle: () => updateProfile({ mfaEnabled: !profile.mfaEnabled }),
          },
          {
            label: 'Budget & Wire Alerts',
            desc: 'Notify when category budgets exceed 80%.',
            checked: profile.highValueTransferAlerts,
            onToggle: () =>
              updateProfile({ highValueTransferAlerts: !profile.highValueTransferAlerts }),
          },
          {
            label: 'Reduced Motion',
            desc: 'Minimize animations and number interpolation.',
            checked: profile.reducedMotionPreference,
            onToggle: () =>
              updateProfile({ reducedMotionPreference: !profile.reducedMotionPreference }),
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-[#F5F2EA] dark:bg-[#0D1423] flex items-center justify-between gap-4"
          >
            <div>
              <p className="text-sm font-semibold">{item.label}</p>
              <p className="text-xs text-[#6E7A8E] dark:text-[#929DB0]">{item.desc}</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={item.checked}
              onClick={item.onToggle}
              className={`w-11 h-6 rounded-full transition-colors p-0.5 shrink-0 ${
                item.checked ? 'bg-[#36C995]' : 'bg-[#929DB0]/35'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-[#080D18] transition-transform ${
                  item.checked ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        ))}
      </div>

      {/* Active Device & Session Management */}
      <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#141D2D] border border-[#080D18]/10 dark:border-[#F5F2EA]/10 space-y-4">
        <h2 className="font-serif text-2xl font-semibold">
          Authorized Devices & Active Sessions (Simulated)
        </h2>
        <div className="divide-y divide-current/10">
          {activeDevices.map((dev) => (
            <div key={dev.id} className="py-3.5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#D6B878]/15 text-[#B39352] dark:text-[#D6B878] flex items-center justify-center">
                  {dev.name.includes('MacBook') ? (
                    <Laptop className="w-4 h-4" />
                  ) : (
                    <Smartphone className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold">{dev.name}</p>
                  <p className="text-xs text-[#6E7A8E] dark:text-[#929DB0]">
                    {dev.location} • <span className="font-mono text-[#36C995]">{dev.lastActive}</span>
                  </p>
                </div>
              </div>
              {!dev.current && (
                <button
                  type="button"
                  onClick={() => handleRevokeDevice(dev.id, dev.name)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#FF7777]/15 text-[#FF7777] hover:bg-[#FF7777]/25 transition-colors"
                >
                  Revoke Session
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Session & Demo Environment Management */}
      <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#141D2D] border border-[#080D18]/10 dark:border-[#F5F2EA]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-xl font-semibold">Reset or Exit Demo Environment</h2>
          <p className="text-xs text-[#6E7A8E] dark:text-[#929DB0]">
            Restore all synthetic accounts, transactions, cards, and budgets to baseline.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={resetDemoData}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D6B878] text-[#080D18] text-xs font-semibold"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Demo Data</span>
          </button>
          <button
            type="button"
            onClick={() => {
              addToast({
                title: 'Signed Out of Demo Session',
                description: 'Returned to public homepage.',
              });
              navigate('/');
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#FF7777]/40 text-[#FF7777] text-xs font-semibold"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Simulation</span>
          </button>
        </div>
      </div>
    </div>
  );
};
