export type AccountTier = 'Essential' | 'Elevate' | 'Private';

export type AccountType = 'Checking' | 'High-Yield Vault' | 'Private Treasury' | 'Multi-Currency Reserve';

export interface BankAccount {
  id: string;
  name: string;
  subtitle: string;
  type: AccountType;
  tier: AccountTier;
  accountNumberMasked: string;
  accountIdentifier: string;
  routingNumber: string;
  iban: string;
  currency: 'USD';
  availableBalance: number;
  currentBalance: number;
  pendingBalance: number;
  indicativeYieldNote: string;
  monthlyChangePercent: number;
  status: 'Active' | 'Restricted';
  openedDate: string;
  colorAccent: string;
}

export type TransactionCategory =
  | 'Dining & Gastronomy'
  | 'Travel & Aviation'
  | 'Architecture & Home'
  | 'Technology & Cloud'
  | 'Wealth & Advisory'
  | 'Compensation & Retainer'
  | 'Internal Treasury'
  | 'Health & Longevity'
  | 'Luxury Retail';

export type TransactionType = 'Incoming' | 'Outgoing' | 'Internal Transfer';
export type TransactionStatus = 'Completed' | 'Pending' | 'Declined';

export interface Transaction {
  id: string;
  reference: string;
  merchant: string;
  merchantLocation: string;
  description: string;
  date: string; // YYYY-MM-DD
  timestamp: string;
  category: TransactionCategory;
  type: TransactionType;
  amount: number; // positive for Incoming, negative for Outgoing
  status: TransactionStatus;
  accountId: string;
  accountName: string;
  cardId?: string;
  counterpartyIban?: string;
  notes?: string;
}

export type CardVariantId = 'obsidian' | 'champagne' | 'arctic' | 'emerald';

export interface PaymentCard {
  id: string;
  variantId: CardVariantId;
  name: string;
  tierLabel: string;
  materialDescription: string;
  cardholderName: string;
  maskedNumber: string;
  lastFour: string;
  expiryDate: string;
  network: 'AURELION PRIVATE' | 'VISA INFINITE PRIVILEGE';
  linkedAccountId: string;
  status: 'Active' | 'Locked';
  onlinePayments: boolean;
  contactlessPayments: boolean;
  internationalUsage: boolean;
  monthlyLimit: number;
  currentMonthSpend: number;
  singleTransactionLimit: number;
  features: string[];
}

export interface BudgetItem {
  id: string;
  category: TransactionCategory;
  monthlyLimit: number;
  spent: number;
  alertThresholdPercent: number;
  notes?: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  category: string;
  targetAmount: number;
  currentAmount: number;
  monthlyContribution: number;
  targetDate: string;
  linkedAccountId: string;
  assumptionNote: string;
}

export interface RecurringPayment {
  id: string;
  merchant: string;
  category: TransactionCategory;
  amount: number;
  frequency: 'Monthly' | 'Quarterly' | 'Annual';
  nextDate: string;
  accountId: string;
  status: 'Scheduled' | 'Paused';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: 'Payment' | 'Budget' | 'Reminder' | 'Security' | 'Milestone';
  timestamp: string;
  read: boolean;
  actionRoute?: string;
}

export interface UserProfile {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  clientId: string;
  membershipTier: AccountTier;
  memberSince: string;
  privateAdvisorName: string;
  privateAdvisorTitle: string;
  residency: string;
  preferredCurrency: 'USD' | 'EUR' | 'GBP' | 'CHF';
  biometricEnabled: boolean;
  mfaEnabled: boolean;
  hardwareKeyRegistered: boolean;
  sessionTimeoutMinutes: number;
  loginAlerts: boolean;
  highValueTransferAlerts: boolean;
  privacyHideBalancesOnLaunch: boolean;
  reducedMotionPreference: boolean;
  highContrastMode: boolean;
}

export interface MonthlyMetric {
  month: string;
  income: number;
  expenses: number;
  savings: number;
  netCashFlow: number;
  totalBalance: number;
}
