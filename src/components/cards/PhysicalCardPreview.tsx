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
  const isSm = scale === 'sm';

  const scaleClasses = {
    sm: 'w-full max-w-[290px] aspect-[1.586/1]',
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

  const isTilting = tilt.rotateX !== 0 || tilt.rotateY !== 0;

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
        className="relative w-full h-full rounded-2xl preserve-3d shadow-luxury"
        style={{
          transformStyle: 'preserve-3d',
          WebkitTransformStyle: 'preserve-3d',
          transition: isTilting
            ? 'transform 0.12s cubic-bezier(0.16, 1, 0.3, 1)'
            : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          willChange: 'transform',
          transform: `rotateX(${tilt.rotateX}deg) rotateY(${
            (isFlipped ? 180 : 0) + tilt.rotateY
          }deg)`,
        }}
      >
        {/* FRONT OF CARD */}
        <div
          className={`absolute inset-0 w-full h-full rounded-2xl ${
            isSm ? 'p-3 sm:p-3.5' : 'p-3 min-[380px]:p-3.5 sm:p-6'
          } flex flex-col justify-between backface-hidden border ${style.frontBg} ${style.border}`}
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
          <div className="relative z-10 flex items-start justify-between gap-1.5 sm:gap-2">
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span
                  className={`font-serif font-semibold ${
                    isSm
                      ? 'tracking-[0.2em] sm:tracking-[0.22em] text-[11px] sm:text-xs'
                      : 'tracking-[0.2em] sm:tracking-[0.26em] text-xs sm:text-base'
                  } ${style.textPrimary}`}
                >
                  AURELION
                </span>
              </div>
              <span
                className={`block ${
                  isSm
                    ? 'text-[7px] sm:text-[7.5px] tracking-[0.16em] sm:tracking-[0.18em]'
                    : 'text-[7.5px] sm:text-[9px] tracking-[0.18em] sm:tracking-[0.22em]'
                } uppercase mt-0.5 font-medium ${style.textSecondary}`}
              >
                {tierLabel}
              </span>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              {isLocked && (
                <span
                  className={`inline-flex items-center gap-1 ${
                    isSm
                      ? 'px-1.5 py-0.2 text-[7.5px] sm:text-[8px]'
                      : 'px-1.5 sm:px-2 py-0.2 sm:py-0.5 text-[8px] sm:text-[10px]'
                  } rounded-full font-medium bg-[#FF7777]/20 text-[#FF7777] border border-[#FF7777]/40`}
                >
                  <Lock className={isSm ? 'w-2 sm:w-2.5 h-2 sm:h-2.5' : 'w-2.5 sm:w-3 h-2.5 sm:h-3'} /> Locked
                </span>
              )}
              <Wifi
                className={`${
                  isSm ? 'w-3.5 sm:w-4 h-3.5 sm:h-4' : 'w-4 sm:w-5 h-4 sm:h-5'
                } rotate-90 opacity-75 ${style.textPrimary}`}
                aria-label="Contactless enabled"
              />
            </div>
          </div>

          {/* Middle Row: Precision EMV Chip & Number */}
          <div className={`relative z-10 my-auto ${isSm ? 'py-0' : 'py-0 sm:py-1'}`}>
            <div className={`flex items-center justify-between ${isSm ? 'mb-1 sm:mb-2' : 'mb-1.5 sm:mb-4'}`}>
              {/* Precision Metallic EMV Chip */}
              <div
                className={`${
                  isSm
                    ? 'w-7 sm:w-8 h-5 sm:h-6 rounded'
                    : 'w-7 min-[380px]:w-8 sm:w-11 h-5 min-[380px]:h-6 sm:h-8 rounded sm:rounded-md'
                } bg-gradient-to-br ${
                  style.chipColor
                } border border-black/20 shadow-inner relative overflow-hidden flex items-center justify-center`}
              >
                <div className="w-full h-[1px] bg-black/25 absolute top-1/3" />
                <div className="w-full h-[1px] bg-black/25 absolute bottom-1/3" />
                <div className="h-full w-[1px] bg-black/25 absolute left-1/3" />
                <div className="h-full w-[1px] bg-black/25 absolute right-1/3" />
                <div
                  className={`${
                    isSm
                      ? 'w-2.5 sm:w-3 h-2 rounded-[1px]'
                      : 'w-2.5 min-[380px]:w-3 sm:w-4 h-2 min-[380px]:h-2 sm:h-3 rounded-[1px] sm:rounded-[2px]'
                  } border border-black/30`}
                />
              </div>
              <span
                className={`${
                  isSm
                    ? 'text-[7px] sm:text-[8px] px-1 sm:px-1.5 py-0.5'
                    : 'text-[7.5px] min-[380px]:text-[8px] sm:text-[10px] px-1.5 sm:px-2 py-0.5'
                } font-mono uppercase tracking-widest rounded border ${style.badgeBg}`}
              >
                SAMPLE • DEMO
              </span>
            </div>

            <p
              className={`font-mono ${
                isSm
                  ? 'text-[11px] sm:text-xs tracking-[0.11em] sm:tracking-[0.14em]'
                  : 'text-[11.5px] min-[380px]:text-xs sm:text-base md:text-lg tracking-[0.11em] min-[380px]:tracking-[0.14em] sm:tracking-[0.18em]'
              } font-medium tabular-nums whitespace-nowrap overflow-hidden text-ellipsis ${style.textPrimary}`}
            >
              {displayCardNumber}
            </p>
          </div>

          {/* Bottom Row: Cardholder, Expiry, Network */}
          <div
            className={`relative z-10 flex items-end justify-between ${
              isSm
                ? 'gap-1.5 sm:gap-2 pt-1'
                : 'gap-1.5 min-[380px]:gap-2 sm:gap-4 pt-1'
            } border-t border-current/10 min-w-0`}
          >
            <div className="min-w-0">
              <span
                className={`block ${
                  isSm
                    ? 'text-[6.5px] sm:text-[7px] tracking-[0.14em] sm:tracking-[0.16em]'
                    : 'text-[6.5px] min-[380px]:text-[7px] sm:text-[8px] tracking-[0.14em] sm:tracking-[0.2em]'
                } uppercase ${style.textSecondary}`}
              >
                Cardholder
              </span>
              <span
                className={`block ${
                  isSm
                    ? 'text-[9px] min-[360px]:text-[10px] tracking-[0.08em] sm:tracking-[0.1em]'
                    : 'text-[9.5px] min-[360px]:text-[10.5px] min-[400px]:text-[11.5px] sm:text-sm tracking-[0.08em] min-[380px]:tracking-[0.1em] sm:tracking-[0.14em]'
                } font-medium uppercase whitespace-nowrap ${style.textPrimary}`}
              >
                {cardholderName}
              </span>
            </div>

            <div
              className={`flex items-end ${
                isSm ? 'gap-2 sm:gap-3' : 'gap-2 min-[380px]:gap-3 sm:gap-5'
              } shrink-0`}
            >
              <div>
                <span
                  className={`block ${
                    isSm
                      ? 'text-[6.5px] sm:text-[7px] tracking-[0.14em] sm:tracking-[0.16em]'
                      : 'text-[6.5px] min-[380px]:text-[7px] sm:text-[8px] tracking-[0.14em] sm:tracking-[0.2em]'
                  } uppercase ${style.textSecondary}`}
                >
                  Valid Thru
                </span>
                <span
                  className={`font-mono ${
                    isSm
                      ? 'text-[9px] min-[360px]:text-[10px]'
                      : 'text-[9.5px] min-[360px]:text-[10.5px] min-[400px]:text-[11.5px] sm:text-sm'
                  } tabular-nums whitespace-nowrap ${style.textPrimary}`}
                >
                  {expiryDate}
                </span>
              </div>
              <div className="text-right">
                <span
                  className={`${
                    isSm
                      ? 'text-[7.5px] min-[360px]:text-[8.5px] tracking-[0.12em] sm:tracking-[0.14em]'
                      : 'text-[7.5px] min-[360px]:text-[8.5px] min-[400px]:text-[9.5px] sm:text-[10px] tracking-[0.12em] sm:tracking-[0.18em]'
                  } font-serif font-semibold uppercase whitespace-nowrap ${style.accentColor}`}
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
            <div
              className={`w-full ${
                isSm
                  ? 'h-6 sm:h-8 mt-2 sm:mt-3'
                  : 'h-6 min-[380px]:h-7 sm:h-11 mt-2 min-[380px]:mt-3 sm:mt-5'
              } bg-[#05070C] opacity-90`}
            />
          </div>

          {/* Spacer for layout */}
          <div
            className={`w-full ${
              isSm
                ? 'h-6 sm:h-8 mt-2 sm:mt-3'
                : 'h-6 min-[380px]:h-7 sm:h-11 mt-2 min-[380px]:mt-3 sm:mt-5'
            } pointer-events-none invisible`}
            aria-hidden="true"
          />

          {/* Signature & Fictional Security Code */}
          <div
            className={`relative z-10 ${
              isSm
                ? 'px-3 sm:px-3.5 space-y-1 sm:space-y-1.5'
                : 'px-3 min-[380px]:px-4 sm:px-6 space-y-1 min-[380px]:space-y-1.5 sm:space-y-3'
            } my-auto`}
          >
            <div
              className={`flex items-center ${
                isSm ? 'gap-1.5 sm:gap-2' : 'gap-1.5 min-[380px]:gap-2 sm:gap-3'
              }`}
            >
              <div
                className={`flex-1 ${
                  isSm
                    ? 'h-5 sm:h-6.5 px-1.5 sm:px-2'
                    : 'h-5 min-[380px]:h-6 sm:h-8 px-1.5 min-[380px]:px-2 sm:px-3'
                } rounded bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-between min-w-0`}
              >
                <span
                  className={`font-serif italic ${
                    isSm
                      ? 'text-[8.5px] sm:text-[10px]'
                      : 'text-[9px] min-[380px]:text-[10px] sm:text-xs'
                  } tracking-wider opacity-75 text-white truncate`}
                >
                  Julian V. Sterling
                </span>
                <span
                  className={`${
                    isSm
                      ? 'text-[6.5px] sm:text-[7.5px]'
                      : 'text-[7px] min-[380px]:text-[7.5px] sm:text-[9px]'
                  } uppercase tracking-widest text-white/60 shrink-0 ml-1`}
                >
                  Demo Signature
                </span>
              </div>
              <div
                className={`${
                  isSm
                    ? 'px-1.5 sm:px-2.5 h-5 sm:h-6.5'
                    : 'px-1.5 min-[380px]:px-2.5 sm:px-3 h-5 min-[380px]:h-6 sm:h-8'
                } rounded bg-[#080D18]/85 border border-[#D6B878]/40 flex flex-col items-center justify-center shrink-0 leading-none`}
              >
                <span
                  className={`block uppercase font-mono font-medium tracking-[0.14em] text-[#D6B878]/70 ${
                    isSm
                      ? 'text-[5.5px] sm:text-[6.5px] mb-0.5'
                      : 'text-[5.5px] min-[380px]:text-[6px] sm:text-[7px] mb-0.5'
                  }`}
                >
                  CVV
                </span>
                <span
                  className={`font-mono text-[#D6B878] tracking-widest leading-none ${
                    isSm
                      ? 'text-[8.5px] sm:text-[10px]'
                      : 'text-[9px] min-[380px]:text-[10px] sm:text-xs'
                  }`}
                >
                  {revealNumbers ? '842' : '•••'}
                </span>
              </div>
            </div>
            <p
              className={`${
                isSm
                  ? 'text-[6.5px] sm:text-[7.5px] leading-tight line-clamp-2'
                  : 'text-[7px] min-[380px]:text-[7.5px] sm:text-[9px] leading-tight sm:leading-relaxed line-clamp-2 sm:line-clamp-none'
              } ${style.textSecondary}`}
            >
              ILLUSTRATIVE DEMONSTRATION INSTRUMENT • NOT A VALID PAYMENT CARD. Issued by Aurelion
              Fictional Private Bank Demo Environment.
            </p>
          </div>

          {/* Bottom Reverse Metadata */}
          <div
            className={`relative z-10 ${
              isSm
                ? 'px-3 sm:px-3.5 pb-2 sm:pb-2.5 text-[7px] sm:text-[8.5px]'
                : 'px-3 min-[380px]:px-4 sm:px-6 pb-2 min-[380px]:pb-2.5 sm:pb-5 text-[7.5px] min-[380px]:text-[8.5px] sm:text-[10px]'
            } flex items-center justify-between`}
          >
            <span className={`font-mono ${style.textSecondary}`}>
              ID: AURL-{lastFour}-SIM
            </span>
            <span
              className={`uppercase tracking-[0.14em] sm:tracking-[0.2em] font-serif ${style.textPrimary}`}
            >
              AURELION • ZURICH • NEW YORK
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
