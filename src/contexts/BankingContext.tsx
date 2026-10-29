import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  BankAccount,
  Transaction,
  PaymentCard,
  BudgetItem,
  SavingsGoal,
  RecurringPayment,
  NotificationItem,
  UserProfile,
  TransactionCategory,
} from '../types/banking';
import {
  INITIAL_ACCOUNTS,
  INITIAL_TRANSACTIONS,
  INITIAL_CARDS,
  INITIAL_BUDGETS,
  INITIAL_GOALS,
  INITIAL_RECURRING,
  INITIAL_NOTIFICATIONS,
  INITIAL_PROFILE,
} from '../data/mockBankingData';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'success' | 'warning' | 'error';
}

interface TransferInput {
  sourceAccountId: string;
  recipientName: string;
  recipientAccountMasked: string;
  targetInternalAccountId?: string;
  amount: number;
  category: TransactionCategory;
  description: string;
}

interface BankingContextType {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
  balancesMasked: boolean;
  toggleBalancesMasked: () => void;
  selectedAccountId: string; // 'all' or account.id
  setSelectedAccountId: (id: string) => void;
  accounts: BankAccount[];
  transactions: Transaction[];
  cards: PaymentCard[];
  budgets: BudgetItem[];
  goals: SavingsGoal[];
  recurringPayments: RecurringPayment[];
  notifications: NotificationItem[];
  profile: UserProfile;
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  dismissToast: (id: string) => void;
  // Computed totals
  totalAvailableBalance: number;
  totalCurrentBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  netCashFlow: number;
  // Actions
  executeDemoTransfer: (input: TransferInput) => { success: boolean; error?: string; transaction?: Transaction };
  toggleCardLock: (cardId: string) => void;
  updateCardControl: (cardId: string, field: 'onlinePayments' | 'contactlessPayments' | 'internationalUsage', value: boolean) => void;
  updateCardLimits: (cardId: string, monthlyLimit: number, singleTransactionLimit: number) => void;
  createBudget: (category: TransactionCategory, monthlyLimit: number, alertThresholdPercent?: number, notes?: string) => void;
  updateBudget: (id: string, monthlyLimit: number, notes?: string) => void;
  deleteBudget: (id: string) => void;
  createSavingsGoal: (goal: Omit<SavingsGoal, 'id'>) => void;
  renameSavingsGoal: (id: string, newName: string) => void;
  contributeToGoal: (id: string, amount: number) => { success: boolean; error?: string };
  deleteSavingsGoal: (id: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  dismissNotification: (id: string) => void;
  toggleRecurringPaymentStatus: (id: string) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  resetDemoData: () => void;
}

const STORAGE_KEY = 'aurelion_demo_state_v1';

const BankingContext = createContext<BankingContextType | undefined>(undefined);

export const BankingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('aurelion_theme');
    return saved === 'light' ? 'light' : 'dark';
  });

  const [balancesMasked, setBalancesMasked] = useState<boolean>(false);
  const [selectedAccountId, setSelectedAccountId] = useState<string>('all');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const loadInitialState = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          accounts: parsed.accounts || INITIAL_ACCOUNTS,
          transactions: parsed.transactions || INITIAL_TRANSACTIONS,
          cards: parsed.cards || INITIAL_CARDS,
          budgets: parsed.budgets || INITIAL_BUDGETS,
          goals: parsed.goals || INITIAL_GOALS,
          recurring: parsed.recurring || INITIAL_RECURRING,
          notifications: parsed.notifications || INITIAL_NOTIFICATIONS,
          profile: parsed.profile || INITIAL_PROFILE,
        };
      }
    } catch {
      // ignore storage errors
    }
    return {
      accounts: INITIAL_ACCOUNTS,
      transactions: INITIAL_TRANSACTIONS,
      cards: INITIAL_CARDS,
      budgets: INITIAL_BUDGETS,
      goals: INITIAL_GOALS,
      recurring: INITIAL_RECURRING,
      notifications: INITIAL_NOTIFICATIONS,
      profile: INITIAL_PROFILE,
    };
  };

  const initial = useMemo(() => loadInitialState(), []);

  const [accounts, setAccounts] = useState<BankAccount[]>(initial.accounts);
  const [transactions, setTransactions] = useState<Transaction[]>(initial.transactions);
  const [cards, setCards] = useState<PaymentCard[]>(initial.cards);
  const [budgets, setBudgets] = useState<BudgetItem[]>(initial.budgets);
  const [goals, setGoals] = useState<SavingsGoal[]>(initial.goals);
  const [recurringPayments, setRecurringPayments] = useState<RecurringPayment[]>(initial.recurring);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initial.notifications);
  const [profile, setProfile] = useState<UserProfile>(initial.profile);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    localStorage.setItem('aurelion_theme', theme);
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          accounts,
          transactions,
          cards,
          budgets,
          goals,
          recurring: recurringPayments,
          notifications,
          profile,
        })
      );
    } catch {
      // ignore storage quota errors
    }
  }, [accounts, transactions, cards, budgets, goals, recurringPayments, notifications, profile]);

  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const setTheme = useCallback((newTheme: 'dark' | 'light') => {
    setThemeState(newTheme);
  }, []);

  const toggleBalancesMasked = useCallback(() => {
    setBalancesMasked((prev) => !prev);
  }, []);

  // Recompute budget spent dynamically from transactions so there are never contradictions
  const synchronizedBudgets = useMemo(() => {
    return budgets.map((b) => {
      const categorySpend = transactions
        .filter(
          (t) =>
            t.category === b.category &&
            t.amount < 0 &&
            t.status !== 'Declined' &&
            t.type !== 'Internal Transfer'
        )
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      return {
        ...b,
        spent: categorySpend,
      };
    });
  }, [budgets, transactions]);

  const totalAvailableBalance = useMemo(
    () => accounts.reduce((acc, item) => acc + item.availableBalance, 0),
    [accounts]
  );

  const totalCurrentBalance = useMemo(
    () => accounts.reduce((acc, item) => acc + item.currentBalance, 0),
    [accounts]
  );

  const { monthlyIncome, monthlyExpenses, netCashFlow } = useMemo(() => {
    const filteredTxns =
      selectedAccountId === 'all'
        ? transactions
        : transactions.filter((t) => t.accountId === selectedAccountId);

    const income = filteredTxns
      .filter((t) => t.amount > 0 && t.status !== 'Declined' && t.type !== 'Internal Transfer')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = filteredTxns
      .filter((t) => t.amount < 0 && t.status !== 'Declined' && t.type !== 'Internal Transfer')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    return {
      monthlyIncome: income,
      monthlyExpenses: expenses,
      netCashFlow: income - expenses,
    };
  }, [transactions, selectedAccountId]);

  const executeDemoTransfer = useCallback(
    (input: TransferInput) => {
      const sourceAcc = accounts.find((a) => a.id === input.sourceAccountId);
      if (!sourceAcc) {
        return { success: false, error: 'Selected source account was not found.' };
      }
      if (!input.amount || isNaN(input.amount) || input.amount <= 0) {
        return { success: false, error: 'Please enter a valid positive transfer amount.' };
      }
      if (input.amount > sourceAcc.availableBalance) {
        return {
          success: false,
          error: `Insufficient demo available balance in ${sourceAcc.name} ($${sourceAcc.availableBalance.toLocaleString()}).`,
        };
      }

      const refNumber = `ARL-SIM-${Math.floor(100000 + Math.random() * 900000)}`;
      const today = new Date().toISOString().split('T')[0];
      const isInternal = Boolean(input.targetInternalAccountId);

      const newTxn: Transaction = {
        id: `txn-sim-${Date.now()}`,
        reference: refNumber,
        merchant: input.recipientName.trim(),
        merchantLocation: isInternal ? 'Aurelion Internal Treasury' : 'Simulated Wire Settlement',
        description: input.description.trim() || `Simulated transfer to ${input.recipientName}`,
        date: today,
        timestamp: new Date().toISOString(),
        category: isInternal ? 'Internal Treasury' : input.category,
        type: isInternal ? 'Internal Transfer' : 'Outgoing',
        amount: -Math.abs(input.amount),
        status: 'Completed',
        accountId: sourceAcc.id,
        accountName: sourceAcc.name,
        counterpartyIban: input.recipientAccountMasked,
        notes: 'Executed in Aurelion Interactive Demo Environment (No real funds moved)',
      };

      setAccounts((prev) =>
        prev.map((acc) => {
          if (acc.id === sourceAcc.id) {
            return {
              ...acc,
              availableBalance: Number((acc.availableBalance - input.amount).toFixed(2)),
              currentBalance: Number((acc.currentBalance - input.amount).toFixed(2)),
            };
          }
          if (input.targetInternalAccountId && acc.id === input.targetInternalAccountId) {
            return {
              ...acc,
              availableBalance: Number((acc.availableBalance + input.amount).toFixed(2)),
              currentBalance: Number((acc.currentBalance + input.amount).toFixed(2)),
            };
          }
          return acc;
        })
      );

      setTransactions((prev) => [newTxn, ...prev]);

      const newNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: 'Simulated Transfer Settled',
        message: `Demo transfer of $${input.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })} to ${input.recipientName} completed (Ref: ${refNumber}).`,
        category: 'Payment',
        timestamp: 'Just now',
        read: false,
        actionRoute: '/dashboard/transactions',
      };
      setNotifications((prev) => [newNotif, ...prev]);

      addToast({
        title: 'Simulated Transfer Confirmed',
        description: `$${input.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })} to ${input.recipientName} (${refNumber})`,
        variant: 'success',
      });

      return { success: true, transaction: newTxn };
    },
    [accounts, addToast]
  );

  const toggleCardLock = useCallback(
    (cardId: string) => {
      setCards((prev) =>
        prev.map((c) => {
          if (c.id !== cardId) return c;
          const nextStatus = c.status === 'Active' ? 'Locked' : 'Active';
          addToast({
            title: `Card ${nextStatus === 'Locked' ? 'Locked' : 'Unlocked'} (Demo)`,
            description: `${c.name} (${c.maskedNumber}) is now ${nextStatus.toLowerCase()}.`,
            variant: nextStatus === 'Locked' ? 'warning' : 'success',
          });
          return { ...c, status: nextStatus };
        })
      );
    },
    [addToast]
  );

  const updateCardControl = useCallback(
    (
      cardId: string,
      field: 'onlinePayments' | 'contactlessPayments' | 'internationalUsage',
      value: boolean
    ) => {
      const labels = {
        onlinePayments: 'Online & E-Commerce Payments',
        contactlessPayments: 'Contactless & Tap-to-Pay',
        internationalUsage: 'International Roaming Authorization',
      };
      setCards((prev) =>
        prev.map((c) => {
          if (c.id !== cardId) return c;
          addToast({
            title: `${labels[field]} ${value ? 'Enabled' : 'Disabled'}`,
            description: `Updated security control for ${c.name}.`,
            variant: 'default',
          });
          return { ...c, [field]: value };
        })
      );
    },
    [addToast]
  );

  const updateCardLimits = useCallback(
    (cardId: string, monthlyLimit: number, singleTransactionLimit: number) => {
      setCards((prev) =>
        prev.map((c) => {
          if (c.id !== cardId) return c;
          addToast({
            title: 'Card Velocity Limits Updated',
            description: `${c.name}: $${monthlyLimit.toLocaleString()}/mo limit applied.`,
            variant: 'success',
          });
          return { ...c, monthlyLimit, singleTransactionLimit };
        })
      );
    },
    [addToast]
  );

  const createBudget = useCallback(
    (
      category: TransactionCategory,
      monthlyLimit: number,
      alertThresholdPercent = 80,
      notes = ''
    ) => {
      setBudgets((prev) => {
        const existingIndex = prev.findIndex((b) => b.category === category);
        if (existingIndex > -1) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            monthlyLimit,
            alertThresholdPercent,
            notes: notes || updated[existingIndex].notes,
          };
          return updated;
        }
        return [
          ...prev,
          {
            id: `bdg-${Date.now()}`,
            category,
            monthlyLimit,
            spent: 0,
            alertThresholdPercent,
            notes,
          },
        ];
      });
      addToast({
        title: 'Monthly Budget Configured',
        description: `${category} limit set to $${monthlyLimit.toLocaleString()}/month.`,
        variant: 'success',
      });
    },
    [addToast]
  );

  const updateBudget = useCallback(
    (id: string, monthlyLimit: number, notes?: string) => {
      setBudgets((prev) =>
        prev.map((b) => (b.id === id ? { ...b, monthlyLimit, notes: notes ?? b.notes } : b))
      );
      addToast({
        title: 'Budget Threshold Updated',
        description: `Monthly allocation updated to $${monthlyLimit.toLocaleString()}.`,
        variant: 'success',
      });
    },
    [addToast]
  );

  const deleteBudget = useCallback(
    (id: string) => {
      setBudgets((prev) => prev.filter((b) => b.id !== id));
      addToast({
        title: 'Budget Removed',
        description: 'Category budget tracker removed from active monitoring.',
        variant: 'default',
      });
    },
    [addToast]
  );

  const createSavingsGoal = useCallback(
    (goal: Omit<SavingsGoal, 'id'>) => {
      const newGoal: SavingsGoal = {
        ...goal,
        id: `goal-${Date.now()}`,
      };
      setGoals((prev) => [...prev, newGoal]);
      addToast({
        title: 'Capital Goal Created',
        description: `"${goal.name}" initialized with target of $${goal.targetAmount.toLocaleString()}.`,
        variant: 'success',
      });
    },
    [addToast]
  );

  const renameSavingsGoal = useCallback(
    (id: string, newName: string) => {
      if (!newName.trim()) return;
      setGoals((prev) =>
        prev.map((g) => (g.id === id ? { ...g, name: newName.trim() } : g))
      );
      addToast({
        title: 'Savings Goal Renamed',
        description: `Goal updated to "${newName.trim()}".`,
        variant: 'default',
      });
    },
    [addToast]
  );

  const contributeToGoal = useCallback(
    (id: string, amount: number) => {
      if (!amount || amount <= 0) {
        return { success: false, error: 'Contribution must be greater than zero.' };
      }
      const targetGoal = goals.find((g) => g.id === id);
      if (!targetGoal) {
        return { success: false, error: 'Goal not found.' };
      }

      setGoals((prev) =>
        prev.map((g) =>
          g.id === id
            ? { ...g, currentAmount: Number((g.currentAmount + amount).toFixed(2)) }
            : g
        )
      );

      addToast({
        title: 'Simulated Contribution Added',
        description: `+$${amount.toLocaleString()} allocated toward ${targetGoal.name}.`,
        variant: 'success',
      });

      return { success: true };
    },
    [goals, addToast]
  );

  const deleteSavingsGoal = useCallback(
    (id: string) => {
      setGoals((prev) => prev.filter((g) => g.id !== id));
      addToast({
        title: 'Savings Goal Archived',
        description: 'Simulated savings goal removed.',
        variant: 'default',
      });
    },
    [addToast]
  );

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    addToast({
      title: 'Notifications Cleared',
      description: 'All alerts marked as read.',
      variant: 'default',
    });
  }, [addToast]);

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const toggleRecurringPaymentStatus = useCallback(
    (id: string) => {
      setRecurringPayments((prev) =>
        prev.map((rec) => {
          if (rec.id !== id) return rec;
          const nextStatus = rec.status === 'Scheduled' ? 'Paused' : 'Scheduled';
          addToast({
            title: `Recurring Commitment ${nextStatus}`,
            description: `${rec.merchant} ($${rec.amount.toLocaleString()}) is now ${nextStatus.toLowerCase()}.`,
            variant: nextStatus === 'Paused' ? 'warning' : 'success',
          });
          return { ...rec, status: nextStatus };
        })
      );
    },
    [addToast]
  );

  const updateProfile = useCallback(
    (updates: Partial<UserProfile>) => {
      setProfile((prev) => ({ ...prev, ...updates }));
      addToast({
        title: 'Preferences Saved',
        description: 'Your demo profile and security preferences have been updated.',
        variant: 'success',
      });
    },
    [addToast]
  );

  const resetDemoData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setAccounts(INITIAL_ACCOUNTS);
    setTransactions(INITIAL_TRANSACTIONS);
    setCards(INITIAL_CARDS);
    setBudgets(INITIAL_BUDGETS);
    setGoals(INITIAL_GOALS);
    setRecurringPayments(INITIAL_RECURRING);
    setNotifications(INITIAL_NOTIFICATIONS);
    setProfile(INITIAL_PROFILE);
    setSelectedAccountId('all');
    setBalancesMasked(false);
    addToast({
      title: 'Demo Environment Reset',
      description: 'All synthetic accounts, transactions, cards, and budgets restored to baseline.',
      variant: 'success',
    });
  }, [addToast]);

  return (
    <BankingContext.Provider
      value={{
        theme,
        toggleTheme,
        setTheme,
        balancesMasked,
        toggleBalancesMasked,
        selectedAccountId,
        setSelectedAccountId,
        accounts,
        transactions,
        cards,
        budgets: synchronizedBudgets,
        goals,
        recurringPayments,
        notifications,
        profile,
        toasts,
        addToast,
        dismissToast,
        totalAvailableBalance,
        totalCurrentBalance,
        monthlyIncome,
        monthlyExpenses,
        netCashFlow,
        executeDemoTransfer,
        toggleCardLock,
        updateCardControl,
        updateCardLimits,
        createBudget,
        updateBudget,
        deleteBudget,
        createSavingsGoal,
        renameSavingsGoal,
        contributeToGoal,
        deleteSavingsGoal,
        markNotificationRead,
        markAllNotificationsRead,
        dismissNotification,
        toggleRecurringPaymentStatus,
        updateProfile,
        resetDemoData,
      }}
    >
      {children}
    </BankingContext.Provider>
  );
};

export function useBanking() {
  const ctx = useContext(BankingContext);
  if (!ctx) {
    throw new Error('useBanking must be used within a BankingProvider');
  }
  return ctx;
}
