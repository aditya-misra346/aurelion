import React, { useEffect, useState, useRef } from 'react';
import { formatCurrency } from '../../utils/formatters';

interface AnimatedCurrencyProps {
  amountUSD: number;
  masked?: boolean;
  showSign?: boolean;
  compact?: boolean;
  decimals?: number;
  currency?: 'USD' | 'EUR' | 'GBP' | 'CHF';
  className?: string;
}

export const AnimatedCurrency: React.FC<AnimatedCurrencyProps> = ({
  amountUSD,
  masked = false,
  showSign = false,
  compact = false,
  decimals = 2,
  currency = 'USD',
  className = '',
}) => {
  const [displayValue, setDisplayValue] = useState(amountUSD);
  const prevValueRef = useRef(amountUSD);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || masked) {
      setDisplayValue(amountUSD);
      prevValueRef.current = amountUSD;
      return;
    }

    const startValue = prevValueRef.current;
    const endValue = amountUSD;
    if (startValue === endValue) return;

    const duration = 550;
    const startTime = performance.now();
    let rafId: number;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Cubic ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (endValue - startValue) * eased;
      setDisplayValue(current);

      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        setDisplayValue(endValue);
        prevValueRef.current = endValue;
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [amountUSD, masked]);

  return (
    <span className={`tabular-nums ${className}`}>
      {formatCurrency(displayValue, {
        masked,
        showSign,
        compact,
        decimals,
        currency,
      })}
    </span>
  );
};
