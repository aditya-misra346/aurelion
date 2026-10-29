import React, { useState } from 'react';
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
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [revealNumbers, setRevealNumbers] = useState(false);
  const [cardScale, setCardScale] = useState<'sm' | 'md' | 'lg'>('md');
  const [studioLight, setStudioLight] = useState<'dark' | 'light'>('dark');

  const activeCard = INITIAL_CARDS[selectedIndex];
  const utilPct = Math.round((activeCard.currentMonthSpend / activeCard.monthlyLimit) * 100);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      {/* Left Column: Interactive Studio Stage (7 cols) */}
      <div
        className={`lg:col-span-7 rounded-3xl p-6 sm:p-8 border transition-colors duration-500 flex flex-col justify-between relative overflow-hidden ${
          studioLight === 'dark'
            ? 'bg-[#0D1423] border-[#D6B878]/25 text-[#F5F2EA]'
            : 'bg-[#F5F2EA] border-[#080D18]/15 text-[#080D18]'
        }`}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-60"
          style={{
            background:
              studioLight === 'dark'
                ? 'radial-gradient(circle at 50% 35%, rgba(214, 184, 120, 0.16), transparent 65%)'
                : 'radial-gradient(circle at 50% 35%, rgba(179, 147, 82, 0.20), transparent 65%)',
          }}
          aria-hidden="true"
        />

        {/* Top Studio Toolbar */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-current/10">
          <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] font-mono text-[#D6B878]">
            <Sparkles className="w-3.5 h-3.5" /> 3D Card Studio
          </span>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsFlipped((prev) => !prev)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-current/15 hover:border-[#D6B878] transition-colors"
            >
              <RotateCw className={`w-3.5 h-3.5 transition-transform ${isFlipped ? 'rotate-180' : ''}`} />
              <span>{isFlipped ? 'Front' : 'Flip'}</span>
            </button>

            <button
              type="button"
              onClick={() => setRevealNumbers((prev) => !prev)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-current/15 hover:border-[#D6B878] transition-colors"
            >
              {revealNumbers ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{revealNumbers ? 'Mask' : 'Reveal'}</span>
            </button>

            <div
              className="inline-flex items-center rounded-lg border border-current/15 p-0.5 text-xs"
              role="group"
              aria-label="Card preview scale"
            >
              {(['sm', 'md', 'lg'] as const).map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setCardScale(sz)}
                  className={`px-2 py-1 rounded-md uppercase font-mono text-[10px] transition-colors ${
                    cardScale === sz
                      ? 'bg-[#D6B878] text-[#080D18] font-semibold'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setStudioLight((prev) => (prev === 'dark' ? 'light' : 'dark'))}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-current/15 hover:border-[#D6B878] transition-colors"
              title="Toggle studio lighting backdrop"
            >
              {studioLight === 'dark' ? (
                <Sun className="w-3.5 h-3.5 text-[#D6B878]" />
              ) : (
                <Moon className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Center Card Stage */}
        <div className="relative z-10 my-8 sm:my-10 flex flex-col items-center justify-center min-h-[240px]">
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
            scale={cardScale}
            onClick={() => setIsFlipped((prev) => !prev)}
          />
        </div>

        {/* Bottom Variant Selector */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4 border-t border-current/10">
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
                    ? 'border-[#D6B878] bg-[#D6B878]/15 shadow-sm'
                    : 'border-current/10 hover:border-current/30 opacity-75 hover:opacity-100'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full border shrink-0 ${
                    swatchColors[card.variantId]
                  }`}
                />
                <div className="min-w-0">
                  <p className="text-xs font-semibold truncate">{card.name}</p>
                  <p className="text-[10px] opacity-65 font-mono">•••• {card.lastFour}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Column: Visual Telemetry & Specs (5 cols) */}
      <div className="lg:col-span-5 rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#141D2D] border border-[#080D18]/10 dark:border-[#F5F2EA]/10 flex flex-col justify-between space-y-6 shadow-luxury-light dark:shadow-luxury">
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#B39352] dark:text-[#D6B878] block">
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
          <div className="p-4 rounded-2xl bg-[#F5F2EA] dark:bg-[#0D1423] border border-current/5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#6E7A8E] dark:text-[#929DB0]">6-Week Authorization Curve</span>
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
                className="p-3 rounded-xl bg-[#F5F2EA]/70 dark:bg-[#0D1423]/70 border border-current/5 flex items-start gap-2 text-xs"
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
