import React from 'react';
import { Link } from 'react-router-dom';

interface BrandMarkProps {
  to?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
}

export const BrandMark: React.FC<BrandMarkProps> = ({
  to = '/',
  size = 'md',
  showTagline = false,
  className = '',
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const textSizes = {
    sm: 'text-lg tracking-[0.26em]',
    md: 'text-xl tracking-[0.28em]',
    lg: 'text-2xl tracking-[0.3em]',
  };

  const content = (
    <div className={`inline-flex items-center gap-3 group select-none ${className}`}>
      <div
        className={`${iconSizes[size]} relative flex items-center justify-center rounded-lg bg-gradient-to-br from-[#D6B878]/25 via-[#D6B878]/10 to-transparent border border-[#D6B878]/45 shadow-sm transition-transform duration-300 group-hover:scale-105`}
      >
        <svg
          viewBox="0 0 32 32"
          fill="none"
          className="w-5 h-5 text-[#D6B878]"
          aria-hidden="true"
        >
          <path
            d="M16 3L27 26H22.2L16 12.4L9.8 26H5L16 3Z"
            fill="currentColor"
            fillOpacity="0.92"
          />
          <path
            d="M16 16.5L20.2 26H11.8L16 16.5Z"
            fill="currentColor"
            fillOpacity="0.35"
          />
          <circle cx="16" cy="9.5" r="1.3" fill="#080D18" />
        </svg>
      </div>
      <div className="flex flex-col">
        <span
          className={`font-serif font-semibold uppercase text-[#080D18] dark:text-[#F5F2EA] ${textSizes[size]} leading-none`}
        >
          AURELION
        </span>
        {showTagline && (
          <span className="text-[11px] uppercase tracking-[0.22em] text-[#6E7A8E] dark:text-[#929DB0] mt-1">
            Private Digital Banking
          </span>
        )}
      </div>
    </div>
  );

  if (to) {
    return (
      <Link
        to={to}
        className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B878] rounded-md"
        aria-label="Aurelion Home"
      >
        {content}
      </Link>
    );
  }

  return content;
};
