import React, { useState, useEffect } from 'react';
import { useBanking } from '../../contexts/BankingContext';
import { INITIAL_CARDS } from '../../data/mockBankingData';
import { PhysicalCardPreview } from './PhysicalCardPreview';
import { RadialGauge, Sparkline } from '../charts/VisualWidgets';
import {
  RotateCw,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Check,
  Sparkles,
  Sliders,
  ArrowUpRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const CARD_SPARKLINES: Record<string, number[]> = {
  obsidian: [1800, 2400, 1950, 3120, 1450, 4280],
  champagne: [950, 1400, 1750, 1200, 2190, 3650],
  arctic: [420, 580, 640, 890, 980, 2100],
  emerald: [300, 450, 200, 600, 400, 150],
};

export const InteractiveCardShowcase: React.FC = () => {
  const { theme } = useBanking();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [revealNumbers, setRevealNumbers] = useState(false);
  const [studioLightOverride, setStudioLightOverride] = useState<'dark' | 'light' | null>(null);

  // Sync studio stage light mode with website theme changes
  useEffect(() => {
    setStudioLightOverride(null);
  }, [theme]);

  const studioLight = studioLightOverride ?? theme;
  const isDark = studioLight === 'dark';

  const activeCard = INITIAL_CARDS[selectedIndex];
  const utilPct = Math.round((activeCard.currentMonthSpend / activeCard.monthlyLimit) * 100);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      {/* Left Column: Interactive Studio Stage (7 cols) */}
      <div
        className={`lg:col-span-7 rounded-3xl p-6 sm:p-8 border transition-colors duration-500 flex flex-col justify-between relative overflow-hidden ${
          isDark
            ? 'bg-[#0D1423] border-[#D6B878]/25 text-[#F5F2EA]'
            : 'bg-gradient-to-br from-[#FCFAF6] via-[#F6F1E7] to-[#EEE5D6] border-[#D6B878]/35 text-[#0A0F1A] shadow-luxury-light ring-1 ring-[#D6B878]/20'
        }`}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-60"
          style={{
            background: isDark
              ? 'radial-gradient(circle at 50% 35%, rgba(214, 184, 120, 0.16), transparent 65%)'
              : 'radial-gradient(circle at 50% 45%, rgba(214, 184, 120, 0.22) 0%, rgba(246, 241, 231, 0.5) 45%, transparent 70%)',
          }}
          aria-hidden="true"
        />

        {/* Top Studio Toolbar */}
        <div
          className={`relative z-10 flex flex-wrap items-center justify-between gap-3 pb-4 border-b ${
            isDark ? 'border-current/10' : 'border-[#0A0F1A]/10'
          }`}
        >
          <span
            className={`inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] font-mono font-medium ${
              isDark ? 'text-[#D6B878]' : 'text-[#8C6D2B]'
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${isDark ? 'text-[#D6B878]' : 'text-[#B39352]'}`} />{' '}
            3D Card Studio
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsFlipped((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                isDark
                  ? 'border-current/15 hover:border-[#D6B878]'
                  : 'bg-white/85 hover:bg-white text-[#0A0F1A] border-[#0A0F1A]/12 hover:border-[#D6B878] shadow-xs hover:shadow-sm'
              }`}
            >
              <RotateCw
                className={`w-3.5 h-3.5 ${
                  isDark ? 'text-[#D6B878]' : 'text-[#9E7B35]'
                } transition-transform ${isFlipped ? 'rotate-180' : ''}`}
              />
              <span>{isFlipped ? 'Front' : 'Flip'}</span>
            </button>

            <button
              type="button"
              onClick={() => setRevealNumbers((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                isDark
                  ? 'border-current/15 hover:border-[#D6B878]'
                  : 'bg-white/85 hover:bg-white text-[#0A0F1A] border-[#0A0F1A]/12 hover:border-[#D6B878] shadow-xs hover:shadow-sm'
              }`}
            >
              {revealNumbers ? (
                <EyeOff
                  className={`w-3.5 h-3.5 ${isDark ? 'text-[#D6B878]' : 'text-[#9E7B35]'}`}
                />
              ) : (
                <Eye
                  className={`w-3.5 h-3.5 ${isDark ? 'text-[#D6B878]' : 'text-[#9E7B35]'}`}
                />
              )}
              <span>{revealNumbers ? 'Mask' : 'Reveal'}</span>
            </button>

            <button
              type="button"
              onClick={() =>
                setStudioLightOverride((prev) => ((prev ?? theme) === 'dark' ? 'light' : 'dark'))
              }
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                isDark
                  ? 'border-current/15 hover:border-[#D6B878]'
                  : 'bg-white/85 hover:bg-white text-[#0A0F1A] border-[#0A0F1A]/12 hover:border-[#D6B878] shadow-xs hover:shadow-sm'
              }`}
              title="Toggle studio lighting backdrop"
            >
              {isDark ? (
                <Sun className="w-3.5 h-3.5 text-[#D6B878]" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-[#8C6D2B]" />
              )}
            </button>
          </div>
        </div>

        {/* Center Card Stage */}
        <div className="relative z-10 my-8 sm:my-10 flex flex-col items-center justify-center min-h-[260px] sm:min-h-[290px]">
          <PhysicalCardPreview
            variant={activeCard.variantId}
            cardholderName={activeCard.cardholderName}
            maskedNumber={activeCard.maskedNumber}
            lastFour={activeCard.lastFour}
            expiryDate={activeCard.expiryDate}
            tierLabel={activeCard.tierLabel}
            network={activeCard.network}
            isFlipped={isFlipped}
            revealNumbers={revealNumbers}
            scale="lg"
            onClick={() => setIsFlipped((prev) => !prev)}
          />
        </div>

        {/* Bottom Variant Selector */}
        <div
          className={`relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4 border-t ${
            isDark ? 'border-current/10' : 'border-[#0A0F1A]/10'
          }`}
        >
          {INITIAL_CARDS.map((card, idx) => {
            const selected = idx === selectedIndex;
            const swatchColors: Record<string, string> = {
              obsidian: 'bg-[#121824] border-[#D6B878]',
              champagne: 'bg-[#D6B878] border-[#F5F2EA]',
              arctic: 'bg-[#CBD5E1] border-white',
              emerald: 'bg-[#0F352B] border-[#36C995]',
            };
            return (
              <button
                key={card.id}
                type="button"
                onClick={() => {
                  setSelectedIndex(idx);
                  setIsFlipped(false);
                }}
                className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all ${
                  selected
                    ? isDark
                      ? 'border-[#D6B878] bg-[#D6B878]/15 shadow-sm'
                      : 'border-[#D6B878] bg-[#D6B878]/25 shadow-sm ring-1 ring-[#D6B878]/40'
                    : isDark
                    ? 'border-current/10 hover:border-current/30 opacity-75 hover:opacity-100'
                    : 'border-[#0A0F1A]/10 bg-white/70 hover:bg-white hover:border-[#D6B878]/50 shadow-xs text-[#5A6578] hover:text-[#0A0F1A]'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full border shrink-0 ${
                    swatchColors[card.variantId]
                  }`}
                />
                <div className="min-w-0">
                  <p
                    className={`text-xs font-semibold truncate ${
                      isDark ? 'text-[#F5F2EA]' : 'text-[#0A0F1A]'
                    }`}
                  >
                    {card.name}
                  </p>
                  <p
                    className={`text-[10px] font-mono ${
                      isDark ? 'opacity-65' : 'text-[#6E7A8E]'
                    }`}
                  >
                    •••• {card.lastFour}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Column: Visual Telemetry & Specs (5 cols) */}
      <div className="lg:col-span-5 rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#141D2D] border border-[#D6B878]/25 dark:border-[#F5F2EA]/10 flex flex-col justify-between space-y-6 shadow-luxury-light dark:shadow-luxury">
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#9E7B35] dark:text-[#D6B878] block">
                {activeCard.tierLabel}
              </span>
              <h3 className="font-serif text-3xl font-semibold mt-0.5">
                {activeCard.name}
              </h3>
            </div>
            <RadialGauge
              percent={utilPct}
              size={68}
              strokeWidth={6}
              color="#D6B878"
              label={`${utilPct}%`}
              sublabel="Used"
            />
          </div>

          {/* Visual Spend Velocity Sparkline Card */}
          <div className="p-4 rounded-2xl bg-[#F8F5EE] dark:bg-[#0D1423] border border-[#D6B878]/20 dark:border-current/5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#6B778D] dark:text-[#929DB0]">6-Week Authorization Curve</span>
              <span className="font-mono font-semibold text-[#36C995]">
                ${activeCard.currentMonthSpend.toLocaleString()} / ${activeCard.monthlyLimit.toLocaleString()}
              </span>
            </div>
            <Sparkline
              data={CARD_SPARKLINES[activeCard.variantId] || CARD_SPARKLINES.obsidian}
              color="#D6B878"
              height={42}
            />
          </div>

          {/* Compact Visual Capability Chips */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {activeCard.features.map((feat, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-[#F8F5EE]/70 dark:bg-[#0D1423]/70 border border-[#D6B878]/15 dark:border-current/5 flex items-start gap-2 text-xs"
              >
                <Check className="w-3.5 h-3.5 text-[#36C995] shrink-0 mt-0.5" />
                <span className="leading-snug">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-5 border-t border-[#080D18]/10 dark:border-[#F5F2EA]/10 flex items-center gap-3">
          <Link
            to="/dashboard/cards"
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#D6B878] hover:bg-[#E5CFA0] text-[#080D18] font-semibold text-sm transition-colors"
          >
            <Sliders className="w-4 h-4" />
            <span>Live Card Controls</span>
          </Link>
          <Link
            to="/cards"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl border border-[#080D18]/15 dark:border-[#F5F2EA]/15 text-sm font-medium hover:border-[#D6B878] transition-colors"
          >
            <span>Specs</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
