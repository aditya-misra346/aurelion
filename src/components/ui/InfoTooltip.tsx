import React, { useState } from 'react';
import { Info } from 'lucide-react';

interface InfoTooltipProps {
  content: string;
  label?: string;
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({ content, label = 'More information' }) => {
  const [open, setOpen] = useState(false);

  return (
    <span
      className="relative inline-flex items-center align-middle ml-1"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen((p) => !p)}
        aria-label={label}
        className="text-[#6E7A8E] dark:text-[#929DB0] hover:text-[#D6B878] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#D6B878] rounded-full p-0.5 transition-colors"
      >
        <Info className="w-3.5 h-3.5" />
      </button>

      {open && (
        <span
          role="tooltip"
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-60 p-2.5 rounded-xl bg-[#0D1423] text-[#F5F2EA] border border-[#D6B878]/35 shadow-luxury text-[11px] font-sans font-normal leading-relaxed z-50 pointer-events-none animate-in fade-in zoom-in-95 duration-150"
        >
          {content}
        </span>
      )}
    </span>
  );
};
