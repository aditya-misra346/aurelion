import { Transaction } from '../types/banking';

export const CURRENCY_RATES: Record<'USD' | 'EUR' | 'GBP' | 'CHF', { symbol: string; rate: number; code: string }> = {
  USD: { symbol: '$', rate: 1, code: 'USD' },
  EUR: { symbol: '€', rate: 0.92, code: 'EUR' },
  GBP: { symbol: '£', rate: 0.79, code: 'GBP' },
  CHF: { symbol: 'CHF ', rate: 0.88, code: 'CHF' },
};

export function formatCurrency(
  amountUSD: number,
  options?: {
    masked?: boolean;
    showSign?: boolean;
    compact?: boolean;
    decimals?: number;
    currency?: 'USD' | 'EUR' | 'GBP' | 'CHF';
  }
): string {
  const {
    masked = false,
    showSign = false,
    compact = false,
    decimals = 2,
    currency = 'USD',
  } = options || {};

  if (masked) {
    return '••••••••';
  }

  const rateInfo = CURRENCY_RATES[currency] || CURRENCY_RATES.USD;
  const converted = amountUSD * rateInfo.rate;
  const absVal = Math.abs(converted);

  let formattedNumber = '';
  if (compact && absVal >= 1_000_000) {
    formattedNumber = `${(absVal / 1_000_000).toFixed(2)}M`;
  } else if (compact && absVal >= 1_000) {
    formattedNumber = `${(absVal / 1_000).toFixed(1)}k`;
  } else {
    formattedNumber = absVal.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }

  const sign =
    amountUSD < 0
      ? '-'
      : showSign && amountUSD > 0
      ? '+'
      : '';

  return `${sign}${rateInfo.symbol}${formattedNumber}`;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00');
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function exportTransactionsToCSV(transactions: Transaction[], filename = 'aurelion-demo-transactions.csv'): void {
  const headers = [
    'Reference',
    'Date',
    'Merchant',
    'Location',
    'Category',
    'Type',
    'Status',
    'Account',
    'Amount (USD)',
    'Description',
  ];

  const escapeCsvCell = (val: string | number) => {
    const str = String(val ?? '');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const rows = transactions.map((t) => [
    t.reference,
    t.date,
    t.merchant,
    t.merchantLocation,
    t.category,
    t.type,
    t.status,
    t.accountName,
    t.amount.toFixed(2),
    t.description,
  ]);

  const csvContent =
    [headers.map(escapeCsvCell).join(','), ...rows.map((r) => r.map(escapeCsvCell).join(','))].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
