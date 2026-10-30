import React, { useState } from 'react';
import { CardVariantId } from '../../types/banking';
import { Lock, Wifi } from 'lucide-react';

interface PhysicalCardPreviewProps {
  variant: CardVariantId;
  cardholderName: string;
  maskedNumber: string;
  lastFour: string;
  expiryDate: string;
  tierLabel: string;
  network?: string;
  isFlipped?: boolean;
  isLocked?: boolean;
  revealNumbers?: boolean;
  scale?: 'sm' | 'md' | 'lg';
  interactiveTilt?: boolean;
  onClick?: () => void;
}

const VARIANT_STYLES: Record<
  CardVariantId,
  {
    frontBg: string;
    backBg: string;
    border: string;
    textPrimary: string;
    textSecondary: string;
    accentColor: string;
    chipColor: string;
    badgeBg: string;
  }
> = {
  obsidian: {
    frontBg:
      'bg-[radial-gradient(ellipse_at_top_right,_rgba(214,184,120,0.18),_transparent_60%),linear-gradient(135deg,#151C2C_0%,#070B12_55%,#121A2A_100%)]',
    backBg: 'bg-[linear-gradient(135deg,#0B101B_0%,#141D2D_100%)]',
    border: 'border-[#D6B878]/35',
    textPrimary: 'text-[#F5F2EA]',
    textSecondary: 'text-[#929DB0]',
    accentColor: 'text-[#D6B878]',
    chipColor: 'from-[#E5CFA0] via-[#D6B878] to-[#9E7F43]',
    badgeBg: 'bg-[#D6B878]/15 text-[#D6B878] border-[#D6B878]/30',
  },
  champagne: {
    frontBg:
      'bg-[radial-gradient(ellipse_at_top_left,_rgba(255,255,255,0.35),_transparent_55%),linear-gradient(135deg,#E2C992_0%,#C4A466_48%,#8F7037_100%)]',
    backBg: 'bg-[linear-gradient(135deg,#B89758_0%,#7D602B_100%)]',
    border: 'border-[#F5F2EA]/45',
    textPrimary: 'text-[#080D18]',
    textSecondary: 'text-[#080D18]/75',
    accentColor: 'text-[#080D18]',
    chipColor: 'from-[#F5F2EA] via-[#D8DDE6] to-[#9AA5B4]',
    badgeBg: 'bg-[#080D18]/15 text-[#080D18] border-[#080D18]/25',
  },
  arctic: {
    frontBg:
      'bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.7),_transparent_60%),linear-gradient(135deg,#EEF2F7_0%,#CBD5E1_52%,#94A3B8_100%)]',
    backBg: 'bg-[linear-gradient(135deg,#CBD5E1_0%,#94A3B8_100%)]',
    border: 'border-white/70',
    textPrimary: 'text-[#080D18]',
    textSecondary: 'text-[#1E293B]/75',
    accentColor: 'text-[#0D1423]',
    chipColor: 'from-[#E5CFA0] via-[#D6B878] to-[#A6894C]',
    badgeBg: 'bg-[#080D18]/10 text-[#080D18] border-[#080D18]/20',
  },
  emerald: {
    frontBg:
      'bg-[radial-gradient(ellipse_at_top_right,_rgba(54,201,149,0.22),_transparent_60%),linear-gradient(135deg,#0F352B_0%,#061914_55%,#0D2B23_100%)]',
    backBg: 'bg-[linear-gradient(135deg,#071C16_0%,#0F352B_100%)]',
    border: 'border-[#36C995]/35',
    textPrimary: 'text-[#F5F2EA]',
    textSecondary: 'text-[#A7F3D0]/75',
    accentColor: 'text-[#D6B878]',
    chipColor: 'from-[#E5CFA0] via-[#D6B878] to-[#9E7F43]',
    badgeBg: 'bg-[#36C995]/15 text-[#36C995] border-[#36C995]/30',
  },
};

const FULL_SAMPLE_NUMBERS: Record<CardVariantId, string> = {
  obsidian: '4819  7402  3318  9042',
  champagne: '5291  8830  1049  3188',
  arctic: '4532  1190  7823  6410',
  emerald: '4916  6024  8519  1127',
};

export const PhysicalCardPreview: React.FC<PhysicalCardPreviewProps> = ({
  variant,
  cardholderName,
  maskedNumber,
  lastFour,
  expiryDate,
  tierLabel,
  network = 'AURELION PRIVATE',
  isFlipped = false,
  isLocked = false,
  revealNumbers = false,
  scale = 'md',
  interactiveTilt = true,
  onClick,
}) => {
  const style = VARIANT_STYLES[variant] || VARIANT_STYLES.obsidian;
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  const scaleClasses = {
    sm: 'w-[290px] h-[182px]',
    md: 'w-full max-w-[380px] aspect-[1.586/1]',
    lg: 'w-full max-w-[430px] aspect-[1.586/1]',
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactiveTilt) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;
    setTilt({ rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  const displayCardNumber = revealNumbers
    ? FULL_SAMPLE_NUMBERS[variant] || maskedNumber
    : maskedNumber;

  return (
    <div
      className={`perspective-1000 select-none ${scaleClasses[scale]} mx-auto cursor-pointer`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        perspective: '1200px',
        WebkitPerspective: '1200px',
      }}
    >
      <div
        className="relative w-full h-full rounded-2xl transition-transform duration-500 preserve-3d shadow-luxury"
        style={{
          transformStyle: 'preserve-3d',
          WebkitTransformStyle: 'preserve-3d',
          transform: `rotateX(${tilt.rotateX}deg) rotateY(${
            (isFlipped ? 180 : 0) + tilt.rotateY
          }deg)`,
        }}
      >
        {/* FRONT OF CARD */}
        <div
          className={`absolute inset-0 w-full h-full rounded-2xl p-6 flex flex-col justify-between backface-hidden border ${style.frontBg} ${style.border}`}
          style={{
            transform: 'rotateY(0deg) translateZ(1px)',
            WebkitTransform: 'rotateY(0deg) translateZ(1px)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transformStyle: 'preserve-3d',
            WebkitTransformStyle: 'preserve-3d',
          }}
        >
          {/* Subtle architectural engraving rings */}
          <div
            className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none"
            aria-hidden="true"
          >
            <div
              className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full border border-current opacity-[0.06]"
            />
            <div
              className="absolute -right-8 -bottom-8 w-48 h-48 rounded-full border border-current opacity-[0.06]"
            />
          </div>

          {/* Top Row: Brand & Tier */}
          <div className="relative z-10 flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`font-serif font-semibold tracking-[0.26em] text-sm sm:text-base ${style.textPrimary}`}
                >
                  AURELION
                </span>
              </div>
              <span
                className={`block text-[9px] tracking-[0.22em] uppercase mt-0.5 font-medium ${style.textSecondary}`}
              >
                {tierLabel}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {isLocked && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#FF7777]/20 text-[#FF7777] border border-[#FF7777]/40">
                  <Lock className="w-3 h-3" /> Locked
                </span>
              )}
              <Wifi
                className={`w-5 h-5 rotate-90 opacity-75 ${style.textPrimary}`}
                aria-label="Contactless enabled"
              />
            </div>
          </div>

          {/* Middle Row: Precision EMV Chip & Number */}
          <div className="relative z-10 my-auto py-1">
            <div className="flex items-center justify-between mb-4">
              {/* Precision Metallic EMV Chip */}
              <div
                className={`w-11 h-8 rounded-md bg-gradient-to-br ${style.chipColor} border border-black/20 shadow-inner relative overflow-hidden flex items-center justify-center`}
              >
                <div className="w-full h-[1px] bg-black/25 absolute top-1/3" />
                <div className="w-full h-[1px] bg-black/25 absolute bottom-1/3" />
                <div className="h-full w-[1px] bg-black/25 absolute left-1/3" />
                <div className="h-full w-[1px] bg-black/25 absolute right-1/3" />
                <div className="w-4 h-3 rounded-[2px] border border-black/30" />
              </div>
              <span
                className={`text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded border ${style.badgeBg}`}
              >
                SAMPLE • DEMO
              </span>
            </div>

            <p
              className={`font-mono text-sm sm:text-base md:text-lg tracking-[0.18em] font-medium tabular-nums ${style.textPrimary}`}
            >
              {displayCardNumber}
            </p>
          </div>

          {/* Bottom Row: Cardholder, Expiry, Network */}
          <div className="relative z-10 flex items-end justify-between gap-4 pt-1 border-t border-current/10">
            <div>
              <span
                className={`block text-[8px] uppercase tracking-[0.2em] ${style.textSecondary}`}
              >
                Cardholder
              </span>
              <span
                className={`text-xs sm:text-sm font-medium tracking-[0.14em] uppercase ${style.textPrimary}`}
              >
                {cardholderName}
              </span>
            </div>

            <div className="flex items-end gap-5">
              <div>
                <span
                  className={`block text-[8px] uppercase tracking-[0.2em] ${style.textSecondary}`}
                >
                  Valid Thru
                </span>
                <span
                  className={`font-mono text-xs sm:text-sm tabular-nums ${style.textPrimary}`}
                >
                  {expiryDate}
                </span>
              </div>
              <div className="text-right">
                <span
                  className={`text-[10px] font-serif font-semibold tracking-[0.18em] uppercase ${style.accentColor}`}
                >
                  {network === 'AURELION PRIVATE' ? 'PRIVATE' : 'INFINITE'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* REVERSE SIDE OF CARD */}
        <div
          className={`absolute inset-0 w-full h-full rounded-2xl flex flex-col justify-between backface-hidden rotate-y-180 border ${style.backBg} ${style.border}`}
          style={{
            transform: 'rotateY(180deg) translateZ(1px)',
            WebkitTransform: 'rotateY(180deg) translateZ(1px)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transformStyle: 'preserve-3d',
            WebkitTransformStyle: 'preserve-3d',
          }}
        >
          {/* Magnetic Stripe container */}
          <div
            className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none"
            aria-hidden="true"
          >
            <div className="w-full h-11 bg-[#05070C] mt-5 opacity-90" />
          </div>

          {/* Spacer for layout */}
          <div className="w-full h-11 mt-5 pointer-events-none invisible" aria-hidden="true" />

          {/* Signature & Fictional Security Code */}
          <div className="relative z-10 px-6 my-auto space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-8 rounded bg-white/15 backdrop-blur-sm border border-white/20 px-3 flex items-center justify-between">
                <span className="font-serif italic text-xs tracking-wider opacity-75 text-white">
                  Julian V. Sterling
                </span>
                <span className="text-[9px] uppercase tracking-widest text-white/60">
                  Authorized Signature (Demo)
                </span>
              </div>
              <div className="px-3 h-8 rounded bg-[#080D18]/80 border border-[#D6B878]/40 flex items-center justify-center">
                <span className="font-mono text-xs text-[#D6B878] tracking-widest">
                  {revealNumbers ? '842' : '•••'}
                </span>
              </div>
            </div>
            <p className={`text-[9px] leading-relaxed ${style.textSecondary}`}>
              ILLUSTRATIVE DEMONSTRATION INSTRUMENT • NOT A VALID PAYMENT CARD. Issued by Aurelion
              Fictional Private Bank Demo Environment. End-to-end simulated controls active.
            </p>
          </div>

          {/* Bottom Reverse Metadata */}
          <div className="relative z-10 px-6 pb-5 flex items-center justify-between text-[10px]">
            <span className={`font-mono ${style.textSecondary}`}>
              ID: AURL-{lastFour}-SIM
            </span>
            <span className={`uppercase tracking-[0.2em] font-serif ${style.textPrimary}`}>
              AURELION • ZURICH • NEW YORK
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
