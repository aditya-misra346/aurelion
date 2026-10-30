import React, { useState } from 'react';
import { useBanking } from '../../contexts/BankingContext';
import { DEMO_RECIPIENTS } from '../../data/mockBankingData';
import { Transaction, TransactionCategory } from '../../types/banking';
import { formatCurrency } from '../../utils/formatters';
import {
  ArrowRight,
  CheckCircle2,
  ShieldAlert,
  RotateCcw,
  AlertTriangle,
  Landmark,
  UserCheck,
  FileText,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardTransfersPage: React.FC = () => {
  const { accounts, executeDemoTransfer, balancesMasked, profile } = useBanking();
  const cur = profile.preferredCurrency;

  // Step 1: Source account
  const [sourceAccountId, setSourceAccountId] = useState<string>(accounts[0]?.id || 'acc-checking-01');
  // Step 2: Recipient selection or custom entry
  const [recipientMode, setRecipientMode] = useState<'saved' | 'custom'>('saved');
  const [selectedRecipientId, setSelectedRecipientId] = useState<string>(DEMO_RECIPIENTS[0].id);
  const [customRecipientName, setCustomRecipientName] = useState('');
  const [customRecipientIban, setCustomRecipientIban] = useState('US77 DEMO •••• 5519');
  const [customCategory, setCustomCategory] = useState<TransactionCategory>('Wealth & Advisory');

  // Step 3: Amount
  const [amountInput, setAmountInput] = useState<string>('2500');
  // Step 4: Optional description
  const [description, setDescription] = useState<string>('Quarterly retainer & capital allocation');

  // UI state: 'compose' | 'review' | 'confirmed'
  const [stage, setStage] = useState<'compose' | 'review' | 'confirmed'>('compose');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [completedTxn, setCompletedTxn] = useState<Transaction | null>(null);

  const sourceAccount = accounts.find((a) => a.id === sourceAccountId) || accounts[0];
  const savedRecipient =
    DEMO_RECIPIENTS.find((r) => r.id === selectedRecipientId) || DEMO_RECIPIENTS[0];

  const finalRecipientName =
    recipientMode === 'saved' ? savedRecipient.name : customRecipientName.trim();
  const finalRecipientMasked =
    recipientMode === 'saved' ? savedRecipient.accountMasked : customRecipientIban.trim();
  const finalCategory: TransactionCategory =
    recipientMode === 'saved' ? savedRecipient.category : customCategory;
  const targetInternalAccountId =
    recipientMode === 'saved' ? savedRecipient.internalAccountId : undefined;

  const numericAmount = Number(amountInput);

  const handleProceedToReview = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!sourceAccount) {
      setValidationError('Please select a valid source account.');
      return;
    }
    if (!finalRecipientName) {
      setValidationError('Please enter or select a fictional recipient name.');
      return;
    }
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setValidationError('Transfer amount must be a positive number greater than $0.00.');
      return;
    }
    if (numericAmount > sourceAccount.availableBalance) {
      setValidationError(
        `Insufficient available demo balance in ${sourceAccount.name} (${formatCurrency(
          sourceAccount.availableBalance
        )} available).`
      );
      return;
    }
    if (targetInternalAccountId && targetInternalAccountId === sourceAccount.id) {
      setValidationError('Source and destination internal accounts cannot be identical.');
      return;
    }

    setStage('review');
  };

  const handleConfirmTransfer = () => {
    const res = executeDemoTransfer({
      sourceAccountId: sourceAccount.id,
      recipientName: finalRecipientName,
      recipientAccountMasked: finalRecipientMasked,
      targetInternalAccountId,
      amount: numericAmount,
      category: finalCategory,
      description,
    });

    if (!res.success) {
      setValidationError(res.error || 'Simulated transfer could not be completed.');
      setStage('compose');
      return;
    }

    setCompletedTxn(res.transaction || null);
    setStage('confirmed');
  };

  const handleResetWizard = () => {
    setStage('compose');
    setValidationError(null);
    setCompletedTxn(null);
    setAmountInput('1500');
    setDescription('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header + Compact Sandbox Pill + 3-Step Visual Progress */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#B39352] dark:text-[#D6B878]">
            Settlement Terminal
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold mt-1">
            New Transfer
          </h1>
        </div>
        <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#D6B878]/15 border border-[#D6B878]/40 text-xs">
          <ShieldAlert className="w-4 h-4 text-[#B39352] dark:text-[#D6B878] shrink-0" />
          <span>Sandbox Mode • Instant ledger updates</span>
        </div>
      </div>

      {/* Visual Step Progress Bar */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { key: 'compose', label: '1. Transfer Details' },
          { key: 'review', label: '2. Review Summary' },
          { key: 'confirmed', label: '3. Settlement Confirmed' },
        ].map((item) => {
          const active = stage === item.key;
          return (
            <div
              key={item.key}
              className={`px-4 py-2.5 rounded-xl text-xs font-mono text-center border transition-all ${
                active
                  ? 'bg-[#D6B878] text-[#080D18] border-[#D6B878] font-semibold'
                  : 'bg-white dark:bg-[#141D2D] border-current/10 text-[#6E7A8E] dark:text-[#929DB0]'
              }`}
            >
              {item.label}
            </div>
          );
        })}
      </div>

      {validationError && (
        <div
          role="alert"
          className="p-4 rounded-2xl bg-[#FF7777]/15 border border-[#FF7777]/40 text-[#FF7777] flex items-center gap-3 text-xs sm:text-sm font-medium"
        >
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {stage === 'compose' && (
        <form
          onSubmit={handleProceedToReview}
          className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#141D2D] border border-[#080D18]/10 dark:border-[#F5F2EA]/10 shadow-luxury-light dark:shadow-luxury space-y-8"
        >
          {/* STEP 1: SELECT SOURCE ACCOUNT */}
          <div className="space-y-3">
            <label className="block text-xs font-mono uppercase tracking-wider text-[#B39352] dark:text-[#D6B878]">
              From Account
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {accounts.map((acc) => {
                const selected = acc.id === sourceAccountId;
                return (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => setSourceAccountId(acc.id)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      selected
                        ? 'border-[#D6B878] bg-[#D6B878]/15'
                        : 'border-current/15 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <p className="text-xs font-semibold truncate">{acc.name}</p>
                    <p className="font-mono text-xs opacity-65 mt-0.5">{acc.accountNumberMasked}</p>
                    <p className="font-mono text-sm font-semibold text-[#36C995] tabular-nums mt-2">
                      {formatCurrency(acc.availableBalance, {
                        masked: balancesMasked,
                        currency: cur,
                      })}{' '}
                      avail.
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2: SELECT OR ENTER RECIPIENT */}
          <div className="space-y-3 pt-4 border-t border-current/10">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-mono uppercase tracking-wider text-[#B39352] dark:text-[#D6B878]">
                Recipient
              </label>
              <div className="inline-flex rounded-lg bg-[#F5F2EA] dark:bg-[#0D1423] p-0.5 border border-current/10 text-xs">
                <button
                  type="button"
                  onClick={() => setRecipientMode('saved')}
                  className={`px-3 py-1 rounded-md ${
                    recipientMode === 'saved'
                      ? 'bg-[#D6B878] text-[#080D18] font-semibold'
                      : 'opacity-70'
                  }`}
                >
                  Saved
                </button>
                <button
                  type="button"
                  onClick={() => setRecipientMode('custom')}
                  className={`px-3 py-1 rounded-md ${
                    recipientMode === 'custom'
                      ? 'bg-[#D6B878] text-[#080D18] font-semibold'
                      : 'opacity-70'
                  }`}
                >
                  Custom
                </button>
              </div>
            </div>

            {recipientMode === 'saved' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {DEMO_RECIPIENTS.map((rcp) => {
                  const selected = rcp.id === selectedRecipientId;
                  return (
                    <button
                      key={rcp.id}
                      type="button"
                      onClick={() => setSelectedRecipientId(rcp.id)}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        selected
                          ? 'border-[#D6B878] bg-[#D6B878]/15'
                          : 'border-current/15 opacity-75 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold">{rcp.name}</span>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-current/10">
                          {rcp.tag}
                        </span>
                      </div>
                      <p className="text-xs opacity-70 mt-1">{rcp.bankName}</p>
                      <p className="font-mono text-xs text-[#B39352] dark:text-[#D6B878] mt-1">
                        {rcp.accountMasked}
                      </p>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label htmlFor="custom-rcp-name" className="block text-xs mb-1">
                    Recipient Name
                  </label>
                  <input
                    id="custom-rcp-name"
                    type="text"
                    required
                    value={customRecipientName}
                    onChange={(e) => setCustomRecipientName(e.target.value)}
                    placeholder="e.g. Studio Zurich Escrow"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F2EA] dark:bg-[#0D1423] border border-current/15 text-xs"
                  />
                </div>
                <div>
                  <label htmlFor="custom-rcp-iban" className="block text-xs mb-1">
                    Routing / IBAN
                  </label>
                  <input
                    id="custom-rcp-iban"
                    type="text"
                    value={customRecipientIban}
                    onChange={(e) => setCustomRecipientIban(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F2EA] dark:bg-[#0D1423] border border-current/15 text-xs font-mono"
                  />
                </div>
                <div>
                  <label htmlFor="custom-rcp-cat" className="block text-xs mb-1">
                    Category
                  </label>
                  <select
                    id="custom-rcp-cat"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value as TransactionCategory)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F2EA] dark:bg-[#0D1423] border border-current/15 text-xs"
                  >
                    <option value="Wealth & Advisory">Wealth & Advisory</option>
                    <option value="Architecture & Home">Architecture & Home</option>
                    <option value="Travel & Aviation">Travel & Aviation</option>
                    <option value="Dining & Gastronomy">Dining & Gastronomy</option>
                    <option value="Technology & Cloud">Technology & Cloud</option>
                    <option value="Luxury Retail">Luxury Retail</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* STEP 3 & STEP 4: AMOUNT & OPTIONAL DESCRIPTION */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-current/10">
            <div className="space-y-2">
              <label
                htmlFor="transfer-amount-input"
                className="block text-xs font-mono uppercase tracking-wider text-[#B39352] dark:text-[#D6B878]"
              >
                Amount (USD)
              </label>
              <input
                id="transfer-amount-input"
                type="number"
                step="0.01"
                min="1"
                required
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#F5F2EA] dark:bg-[#0D1423] border border-current/15 font-mono text-xl font-semibold tabular-nums focus:outline-none focus:border-[#D6B878]"
              />
              <div className="flex items-center gap-2 pt-1">
                {[500, 2500, 10000, 25000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAmountInput(String(preset))}
                    className="px-2.5 py-1 rounded-lg bg-[#F5F2EA] dark:bg-[#0D1423] hover:border-[#D6B878] border border-current/10 font-mono text-xs"
                  >
                    ${preset.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="transfer-memo-input"
                className="block text-xs font-mono uppercase tracking-wider text-[#B39352] dark:text-[#D6B878]"
              >
                Reference Note
              </label>
              <input
                id="transfer-memo-input"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional memo..."
                className="w-full px-4 py-3 rounded-xl bg-[#F5F2EA] dark:bg-[#0D1423] border border-current/15 text-sm focus:outline-none focus:border-[#D6B878]"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-current/10 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#D6B878] hover:bg-[#E5CFA0] text-[#080D18] font-semibold text-sm transition-colors"
            >
              <span>Review Transfer</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* STEP 5: REVIEW TRANSFER SUMMARY */}
      {stage === 'review' && (
        <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#141D2D] border border-[#D6B878]/40 shadow-luxury space-y-6">
          <div className="border-b border-current/10 pb-4">
            <span className="text-xs font-mono uppercase tracking-wider text-[#B39352] dark:text-[#D6B878]">
              Step 5 of 6 — Pre-Settlement Verification
            </span>
            <h2 className="font-serif text-2xl font-semibold mt-1">
              Review Simulated Transfer Summary
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="p-4 rounded-2xl bg-[#F5F2EA] dark:bg-[#0D1423] space-y-1">
              <span className="text-[11px] font-mono uppercase text-[#6E7A8E] dark:text-[#929DB0]">
                From Source Account
              </span>
              <p className="font-semibold">{sourceAccount.name}</p>
              <p className="font-mono text-xs text-[#6E7A8E] dark:text-[#929DB0]">
                Available Before: ${sourceAccount.availableBalance.toLocaleString()} USD
              </p>
              <p className="font-mono text-xs text-[#36C995]">
                Available After: ${(sourceAccount.availableBalance - numericAmount).toLocaleString()} USD
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F5F2EA] dark:bg-[#0D1423] space-y-1">
              <span className="text-[11px] font-mono uppercase text-[#6E7A8E] dark:text-[#929DB0]">
                To Fictional Counterparty
              </span>
              <p className="font-semibold">{finalRecipientName}</p>
              <p className="font-mono text-xs text-[#B39352] dark:text-[#D6B878]">
                {finalRecipientMasked}
              </p>
              <p className="text-xs text-[#6E7A8E] dark:text-[#929DB0]">
                Category: {finalCategory}
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-pearl-card dark:bg-none dark:bg-[#0D1423] text-[#0A0F1A] dark:text-[#F5F2EA] border border-[#D6B878]/35 dark:border-[#D6B878]/30 shadow-luxury-light dark:shadow-none flex items-center justify-between">
            <div>
              <span className="text-xs text-[#6B778D] dark:text-[#929DB0] block">Simulated Settlement Amount</span>
              <span className="text-xs text-[#9E7B35] dark:text-[#D6B878]">
                Memo: {description || 'Simulated transfer'}
              </span>
            </div>
            <span className="font-mono text-2xl sm:text-3xl font-semibold text-[#9E7B35] dark:text-[#D6B878] tabular-nums">
              ${numericAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => setStage('compose')}
              className="px-5 py-3 rounded-xl border border-current/15 text-xs sm:text-sm font-medium"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleConfirmTransfer}
              className="px-7 py-3.5 rounded-xl bg-[#36C995] hover:opacity-95 text-[#080D18] font-semibold text-xs sm:text-sm inline-flex items-center gap-2 shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm & Send</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 6: CONFIRMATION SCREEN */}
      {stage === 'confirmed' && completedTxn && (
        <div className="rounded-3xl p-8 bg-white dark:bg-[#141D2D] border border-[#36C995]/50 shadow-luxury text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#36C995]/15 text-[#36C995] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#36C995]">
              Simulated Settlement Confirmed
            </span>
            <h2 className="font-serif text-3xl font-semibold">
              ${Math.abs(completedTxn.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}{' '}
              Dispatched
            </h2>
            <p className="text-xs sm:text-sm text-[#6E7A8E] dark:text-[#929DB0] max-w-md mx-auto">
              Unique Demo Reference:{' '}
              <strong className="font-mono text-[#B39352] dark:text-[#D6B878]">
                {completedTxn.reference}
              </strong>
              . Your demo account balance and transaction history have been updated.
            </p>
          </div>

          <div className="max-w-md mx-auto p-4 rounded-2xl bg-[#F5F2EA] dark:bg-[#0D1423] text-xs space-y-2 text-left font-mono">
            <div className="flex justify-between">
              <span className="text-[#6E7A8E] dark:text-[#929DB0]">Recipient:</span>
              <span>{completedTxn.merchant}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6E7A8E] dark:text-[#929DB0]">Source Account:</span>
              <span>{completedTxn.accountName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6E7A8E] dark:text-[#929DB0]">Updated Available:</span>
              <span className="text-[#36C995]">
                ${sourceAccount.availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleResetWizard}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#D6B878] text-[#080D18] text-xs font-semibold"
            >
              <RotateCcw className="w-4 h-4" />
              <span>New Simulated Transfer</span>
            </button>
            <Link
              to="/dashboard/transactions"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-current/15 text-xs font-medium"
            >
              <span>Inspect in Transaction Ledger →</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
