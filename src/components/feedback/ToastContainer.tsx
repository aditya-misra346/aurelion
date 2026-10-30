import React from 'react';
import { useBanking } from '../../contexts/BankingContext';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useBanking();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2.5 max-w-md w-full pointer-events-none px-4 sm:px-0"
      role="region"
      aria-label="System notifications"
    >
      {toasts.map((toast) => {
        const iconMap = {
          success: <CheckCircle2 className="w-5 h-5 text-[#36C995] shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-[#D6B878] shrink-0" />,
          error: <XCircle className="w-5 h-5 text-[#FF7777] shrink-0" />,
          default: <Info className="w-5 h-5 text-[#D6B878] shrink-0" />,
        };
        const variant = toast.variant || 'default';

        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start gap-3.5 p-4 rounded-xl bg-white dark:bg-[#141D2D] border border-[#D6B878]/35 dark:border-[#D6B878]/30 shadow-luxury-light dark:shadow-luxury text-[#0A0F1A] dark:text-[#F5F2EA] transition-all duration-300 animate-in fade-in slide-in-from-bottom-3"
          >
            <div className="mt-0.5">{iconMap[variant]}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold tracking-tight">{toast.title}</p>
              {toast.description && (
                <p className="text-xs text-[#4A5568] dark:text-[#929DB0] mt-1 leading-relaxed">
                  {toast.description}
                </p>
              )}
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-[#929DB0] hover:text-[#080D18] dark:hover:text-[#F5F2EA] p-1 rounded-md transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
