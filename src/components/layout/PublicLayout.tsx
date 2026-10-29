import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { PublicNavbar } from '../navigation/PublicNavbar';
import { PublicFooter } from './PublicFooter';
import { CommandPalette } from '../navigation/CommandPalette';
import { ArrowUp, Sparkles } from 'lucide-react';

export const PublicLayout: React.FC = () => {
  const { pathname } = useLocation();
  const [cmdOpen, setCmdOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setShowBackToTop(window.scrollY > 450);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col pb-9 bg-[#F5F2EA] dark:bg-[#080D18] text-[#080D18] dark:text-[#F5F2EA] selection:bg-[#D6B878]/30">
      <PublicNavbar onOpenCommandPalette={() => setCmdOpen(true)} />
      <main className="flex-1">
        <Outlet />
      </main>
      <PublicFooter />

      {/* Floating Back-to-Top Control */}
      {showBackToTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Scroll back to top"
          className="fixed bottom-12 right-6 z-40 p-3 rounded-2xl bg-[#0D1423] text-[#D6B878] border border-[#D6B878]/35 shadow-luxury hover:bg-[#141D2D] hover:scale-105 transition-all"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}

      {/* Persistent Window-Bottom Creator Signature Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 h-9 bg-[#080D18]/95 backdrop-blur-md border-t border-[#D6B878]/30 px-4 flex items-center justify-center gap-2 text-xs text-[#F5F2EA]">
        <Sparkles className="w-3.5 h-3.5 text-[#D6B878]" />
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#929DB0] hidden sm:inline">
          AURELION Digital Banking
        </span>
        <span className="text-[#D6B878]/50 hidden sm:inline">•</span>
        <span className="font-serif text-sm tracking-wide">
          Made by <strong className="text-[#D6B878] font-semibold">Aditya Misra</strong>
        </span>
      </div>

      <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} />
    </div>
  );
};
