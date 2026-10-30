import React, { useState, useEffect } from 'react';
import { useBanking } from '../../contexts/BankingContext';
import { PhysicalCardPreview } from '../../components/cards/PhysicalCardPreview';
import { formatCurrency, formatDate } from '../../utils/formatters';
import {
  Lock,
  Unlock,
  Globe,
  Wifi,
  ShoppingCart,
  RotateCw,
  Eye,
  EyeOff,
  Sliders,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export const DashboardCardsPage: React.FC = () => {
  const {
    cards,
    transactions,
    toggleCardLock,
    updateCardControl,
    updateCardLimits,
    balancesMasked,
    profile,
  } = useBanking();

  const [selectedCardIdx, setSelectedCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [revealNumbers, setRevealNumbers] = useState(false);

  const activeCard = cards[selectedCardIdx] || cards[0];
  const cur = profile.preferredCurrency;

  const [monthlyLimitInput, setMonthlyLimitInput] = useState(activeCard.monthlyLimit);
  const [singleLimitInput, setSingleLimitInput] = useState(activeCard.singleTransactionLimit);

  useEffect(() => {
    setMonthlyLimitInput(activeCard.monthlyLimit);
    setSingleLimitInput(activeCard.singleTransactionLimit);
    setIsFlipped(false);
  }, [activeCard.id, activeCard.monthlyLimit, activeCard.singleTransactionLimit]);

  const cardTransactions = transactions.filter((t) => t.cardId === activeCard.id);
  const spendRatio = Math.min(
    100,
    Math.round((activeCard.currentMonthSpend / activeCard.monthlyLimit) * 100)
  );

  const handleSaveLimits = (e: React.FormEvent) => {
    e.preventDefault();
    updateCardLimits(activeCard.id, monthlyLimitInput, singleLimitInput);
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#B39352] dark:text-[#D6B878]">
            Instrument Governance Console
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold mt-1">
            Payment Cards & Authorization Controls
          </h1>
        </div>
        <div className="text-xs font-mono text-[#6E7A8E] dark:text-[#929DB0]">
          Fictional card credentials only • Instant demo state updates
        </div>
      </div>

      {/* Card Carousel Selector Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {cards.map((card, idx) => {
          const isSelected = idx === selectedCardIdx;
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => setSelectedCardIdx(idx)}
              className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-pearl-card dark:bg-none text-[#0A0F1A] border-[#D6B878] shadow-luxury-light ring-1 ring-[#D6B878]/40 dark:ring-0 dark:bg-[#0D1423] dark:text-[#F5F2EA] dark:border-[#D6B878] dark:shadow-md'
                  : 'bg-white dark:bg-[#141D2D] border-[#0A0F1A]/10 dark:border-[#F5F2EA]/10 opacity-80 hover:opacity-100 shadow-sm dark:shadow-none'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold">{card.name}</span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                    card.status === 'Active'
                      ? 'bg-[#36C995]/20 text-[#36C995]'
                      : 'bg-[#FF7777]/20 text-[#FF7777]'
                  }`}
                >
                  {card.status}
                </span>
              </div>
              <p className="font-mono text-xs opacity-70 mt-2">{card.maskedNumber}</p>
            </button>
          );
        })}
      </div>

      {/* Main Card Console Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 5 Cols: 3D Card Stage & Spend Progress */}
        <div className="lg:col-span-5 rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#141D2D] border border-[#080D18]/10 dark:border-[#F5F2EA]/10 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setSelectedCardIdx((prev) => (prev - 1 + cards.length) % cards.length)
                }
                className="p-1.5 rounded-lg border border-current/15"
                aria-label="Previous card"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setSelectedCardIdx((prev) => (prev + 1) % cards.length)}
                className="p-1.5 rounded-lg border border-current/15"
                aria-label="Next card"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsFlipped((p) => !p)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border border-current/15 hover:border-[#D6B878]"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Flip</span>
              </button>
              <button
                type="button"
                onClick={() => setRevealNumbers((p) => !p)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border border-current/15 hover:border-[#D6B878]"
              >
                {revealNumbers ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{revealNumbers ? 'Mask' : 'Sample Details'}</span>
              </button>
            </div>
          </div>

          <div className="py-2">
            <PhysicalCardPreview
              variant={activeCard.variantId}
              cardholderName={activeCard.cardholderName}
              maskedNumber={activeCard.maskedNumber}
              lastFour={activeCard.lastFour}
              expiryDate={activeCard.expiryDate}
              tierLabel={activeCard.tierLabel}
              network={activeCard.network}
              isFlipped={isFlipped}
              isLocked={activeCard.status === 'Locked'}
              revealNumbers={revealNumbers}
              scale="md"
              onClick={() => setIsFlipped((p) => !p)}
            />
          </div>

          {/* Lock / Unlock Action Button */}
          <button
            type="button"
            onClick={() => toggleCardLock(activeCard.id)}
            className={`w-full py-3.5 px-5 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors ${
              activeCard.status === 'Active'
                ? 'bg-[#FF7777]/15 text-[#FF7777] border border-[#FF7777]/40 hover:bg-[#FF7777]/25'
                : 'bg-[#36C995] text-[#080D18] hover:opacity-95'
            }`}
          >
            {activeCard.status === 'Active' ? (
              <>
                <Lock className="w-4 h-4" />
                <span>Lock {activeCard.name}</span>
              </>
            ) : (
              <>
                <Unlock className="w-4 h-4" />
                <span>Unlock {activeCard.name}</span>
              </>
            )}
          </button>

          {/* Monthly Spend Meter */}
          <div className="p-4 rounded-2xl bg-[#F5F2EA] dark:bg-[#0D1423] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#6E7A8E] dark:text-[#929DB0]">October Card Utilization</span>
              <span className="font-mono font-semibold tabular-nums">
                {formatCurrency(activeCard.currentMonthSpend, {
                  masked: balancesMasked,
                  decimals: 0,
                  currency: cur,
                })}{' '}
                /{' '}
                {formatCurrency(activeCard.monthlyLimit, {
                  masked: balancesMasked,
                  decimals: 0,
                  currency: cur,
                })}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-white dark:bg-[#141D2D] overflow-hidden">
              <div
                className="h-full bg-[#D6B878] rounded-full transition-all duration-300"
                style={{ width: `${spendRatio}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right 7 Cols: Security Toggles, Velocity Limits, and Card Transactions */}
        <div className="lg:col-span-7 space-y-6">
          {/* Channel Authorization Toggles */}
          <div className="rounded-3xl p-6 bg-white dark:bg-[#141D2D] border border-[#080D18]/10 dark:border-[#F5F2EA]/10 space-y-4">
            <h2 className="font-serif text-xl font-semibold">
              Channel & Geographic Controls — {activeCard.name}
            </h2>

            <div className="space-y-3">
              {[
                {
                  field: 'onlinePayments' as const,
                  icon: ShoppingCart,
                  label: 'Online Payments',
                  desc: 'E-commerce and recurring subscriptions.',
                },
                {
                  field: 'contactlessPayments' as const,
                  icon: Wifi,
                  label: 'Contactless Tap',
                  desc: 'NFC point-of-sale terminals.',
                },
                {
                  field: 'internationalUsage' as const,
                  icon: Globe,
                  label: 'International Roaming',
                  desc: 'Cross-border and foreign currency charges.',
                },
              ].map((ctrl) => {
                const Icon = ctrl.icon;
                const enabled = activeCard[ctrl.field];
                return (
                  <div
                    key={ctrl.field}
                    className="p-4 rounded-2xl bg-[#F5F2EA] dark:bg-[#0D1423] flex items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3">
                      <Icon className="w-5 h-5 text-[#D6B878] shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold">{ctrl.label}</p>
                        <p className="text-xs text-[#6E7A8E] dark:text-[#929DB0]">{ctrl.desc}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={enabled}
                      onClick={() => updateCardControl(activeCard.id, ctrl.field, !enabled)}
                      className={`w-11 h-6 rounded-full transition-colors p-0.5 shrink-0 ${
                        enabled ? 'bg-[#36C995]' : 'bg-[#929DB0]/35'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-[#080D18] transition-transform ${
                          enabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Transaction Limit Settings */}
          <form
            onSubmit={handleSaveLimits}
            className="rounded-3xl p-6 bg-white dark:bg-[#141D2D] border border-[#080D18]/10 dark:border-[#F5F2EA]/10 space-y-5"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl font-semibold">Velocity & Spending Limits</h2>
              <Sliders className="w-4 h-4 text-[#D6B878]" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <label htmlFor="card-monthly-limit">Monthly Spend Limit</label>
                  <span className="font-mono font-semibold tabular-nums">
                    ${monthlyLimitInput.toLocaleString()}
                  </span>
                </div>
                <input
                  id="card-monthly-limit"
                  type="range"
                  min={5000}
                  max={100000}
                  step={2500}
                  value={monthlyLimitInput}
                  onChange={(e) => setMonthlyLimitInput(Number(e.target.value))}
                  className="w-full accent-[#D6B878]"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <label htmlFor="card-single-limit">Single Transaction Cap</label>
                  <span className="font-mono font-semibold tabular-nums">
                    ${singleLimitInput.toLocaleString()}
                  </span>
                </div>
                <input
                  id="card-single-limit"
                  type="range"
                  min={1000}
                  max={50000}
                  step={1000}
                  value={singleLimitInput}
                  onChange={(e) => setSingleLimitInput(Number(e.target.value))}
                  className="w-full accent-[#D6B878]"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#D6B878] hover:bg-[#E5CFA0] text-[#080D18] text-xs font-semibold transition-colors"
              >
                Apply Updated Card Limits
              </button>
            </div>
          </form>

          {/* Recent Card Transactions */}
          <div className="rounded-3xl p-6 bg-white dark:bg-[#141D2D] border border-[#080D18]/10 dark:border-[#F5F2EA]/10 space-y-4">
            <h2 className="font-serif text-xl font-semibold">
              Recent {activeCard.name} Authorizations ({cardTransactions.length})
            </h2>
            {cardTransactions.length === 0 ? (
              <p className="text-xs text-[#6E7A8E] dark:text-[#929DB0]">
                No recent charges recorded on this instrument.
              </p>
            ) : (
              <div className="divide-y divide-current/10">
                {cardTransactions.map((t) => (
                  <div key={t.id} className="py-3 flex items-center justify-between text-xs sm:text-sm">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{t.merchant}</span>
                        {t.status !== 'Completed' && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#FF7777]/15 text-[#FF7777]">
                            {t.status}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#6E7A8E] dark:text-[#929DB0]">
                        {formatDate(t.date)} • {t.merchantLocation}
                      </p>
                    </div>
                    <span className="font-mono font-semibold tabular-nums">
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
        </div>
      </div>
    </div>
  );
};
