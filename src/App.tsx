import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { BankingProvider } from './contexts/BankingContext';
import { ToastContainer } from './components/feedback/ToastContainer';
import { PublicLayout } from './components/layout/PublicLayout';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { PageSkeleton } from './components/ui/PageSkeleton';
import { HomePage } from './pages/public/HomePage';

// Lazy-loaded Secondary Public Routes
const PersonalBankingPage = lazy(() =>
  import('./pages/public/PublicProductPages').then((m) => ({ default: m.PersonalBankingPage }))
);
const PublicAccountsPage = lazy(() =>
  import('./pages/public/PublicProductPages').then((m) => ({ default: m.PublicAccountsPage }))
);
const PublicCardsPage = lazy(() =>
  import('./pages/public/PublicProductPages').then((m) => ({ default: m.PublicCardsPage }))
);
const PublicPaymentsPage = lazy(() =>
  import('./pages/public/PublicProductPages').then((m) => ({ default: m.PublicPaymentsPage }))
);
const PublicLoansPage = lazy(() =>
  import('./pages/public/PublicProductPages').then((m) => ({ default: m.PublicLoansPage }))
);
const PublicWealthPage = lazy(() =>
  import('./pages/public/PublicProductPages').then((m) => ({ default: m.PublicWealthPage }))
);
const PublicSecurityPage = lazy(() =>
  import('./pages/public/PublicProductPages').then((m) => ({ default: m.PublicSecurityPage }))
);
const PublicAboutPage = lazy(() =>
  import('./pages/public/PublicProductPages').then((m) => ({ default: m.PublicAboutPage }))
);
const PublicContactPage = lazy(() =>
  import('./pages/public/PublicProductPages').then((m) => ({ default: m.PublicContactPage }))
);
const LoginPage = lazy(() =>
  import('./pages/public/AuthPages').then((m) => ({ default: m.LoginPage }))
);
const SignupPage = lazy(() =>
  import('./pages/public/AuthPages').then((m) => ({ default: m.SignupPage }))
);

// Lazy-loaded Authenticated Dashboard Routes
const DashboardOverviewPage = lazy(() =>
  import('./pages/dashboard/DashboardOverviewPage').then((m) => ({
    default: m.DashboardOverviewPage,
  }))
);
const DashboardAccountsPage = lazy(() =>
  import('./pages/dashboard/DashboardAccountsPage').then((m) => ({
    default: m.DashboardAccountsPage,
  }))
);
const DashboardTransactionsPage = lazy(() =>
  import('./pages/dashboard/DashboardTransactionsPage').then((m) => ({
    default: m.DashboardTransactionsPage,
  }))
);
const DashboardTransfersPage = lazy(() =>
  import('./pages/dashboard/DashboardTransfersPage').then((m) => ({
    default: m.DashboardTransfersPage,
  }))
);
const DashboardCardsPage = lazy(() =>
  import('./pages/dashboard/DashboardCardsPage').then((m) => ({
    default: m.DashboardCardsPage,
  }))
);
const DashboardBudgetsPage = lazy(() =>
  import('./pages/dashboard/DashboardBudgetsPage').then((m) => ({
    default: m.DashboardBudgetsPage,
  }))
);
const DashboardAnalyticsPage = lazy(() =>
  import('./pages/dashboard/DashboardAnalyticsPage').then((m) => ({
    default: m.DashboardAnalyticsPage,
  }))
);
const DashboardProfilePage = lazy(() =>
  import('./pages/dashboard/DashboardProfileSettingsPages').then((m) => ({
    default: m.DashboardProfilePage,
  }))
);
const DashboardSettingsPage = lazy(() =>
  import('./pages/dashboard/DashboardProfileSettingsPages').then((m) => ({
    default: m.DashboardSettingsPage,
  }))
);

const NotFoundPage: React.FC = () => (
  <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-5">
    <span className="text-xs font-mono uppercase tracking-[0.22em] text-[#D6B878]">
      404 • Route Not Found
    </span>
    <h1 className="font-serif text-4xl font-semibold">
      The requested destination is outside our ledger.
    </h1>
    <div className="flex justify-center gap-3 pt-2">
      <Link
        to="/"
        className="px-5 py-2.5 rounded-xl bg-[#D6B878] text-[#080D18] text-xs font-semibold"
      >
        Return to Public Homepage
      </Link>
      <Link
        to="/dashboard"
        className="px-5 py-2.5 rounded-xl border border-current/15 text-xs font-medium"
      >
        Open Client Dashboard
      </Link>
    </div>
  </div>
);

export const App: React.FC = () => {
  return (
    <BankingProvider>
      <BrowserRouter>
        <ToastContainer />
        <Routes>
          {/* PUBLIC WEBSITE ROUTES (1 - 12) */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/personal-banking"
              element={
                <Suspense fallback={<PageSkeleton variant="public" />}>
                  <PersonalBankingPage />
                </Suspense>
              }
            />
            <Route
              path="/accounts"
              element={
                <Suspense fallback={<PageSkeleton variant="public" />}>
                  <PublicAccountsPage />
                </Suspense>
              }
            />
            <Route
              path="/cards"
              element={
                <Suspense fallback={<PageSkeleton variant="public" />}>
                  <PublicCardsPage />
                </Suspense>
              }
            />
            <Route
              path="/payments"
              element={
                <Suspense fallback={<PageSkeleton variant="public" />}>
                  <PublicPaymentsPage />
                </Suspense>
              }
            />
            <Route
              path="/loans"
              element={
                <Suspense fallback={<PageSkeleton variant="public" />}>
                  <PublicLoansPage />
                </Suspense>
              }
            />
            <Route
              path="/wealth"
              element={
                <Suspense fallback={<PageSkeleton variant="public" />}>
                  <PublicWealthPage />
                </Suspense>
              }
            />
            <Route
              path="/security"
              element={
                <Suspense fallback={<PageSkeleton variant="public" />}>
                  <PublicSecurityPage />
                </Suspense>
              }
            />
            <Route
              path="/about"
              element={
                <Suspense fallback={<PageSkeleton variant="public" />}>
                  <PublicAboutPage />
                </Suspense>
              }
            />
            <Route
              path="/contact"
              element={
                <Suspense fallback={<PageSkeleton variant="public" />}>
                  <PublicContactPage />
                </Suspense>
              }
            />
            <Route
              path="/login"
              element={
                <Suspense fallback={<PageSkeleton variant="public" />}>
                  <LoginPage />
                </Suspense>
              }
            />
            <Route
              path="/signup"
              element={
                <Suspense fallback={<PageSkeleton variant="public" />}>
                  <SignupPage />
                </Suspense>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* AUTHENTICATED BANKING EXPERIENCE ROUTES (13 - 21) */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route
              index
              element={
                <Suspense fallback={<PageSkeleton variant="dashboard" />}>
                  <DashboardOverviewPage />
                </Suspense>
              }
            />
            <Route
              path="accounts"
              element={
                <Suspense fallback={<PageSkeleton variant="dashboard" />}>
                  <DashboardAccountsPage />
                </Suspense>
              }
            />
            <Route
              path="transactions"
              element={
                <Suspense fallback={<PageSkeleton variant="dashboard" />}>
                  <DashboardTransactionsPage />
                </Suspense>
              }
            />
            <Route
              path="transfers"
              element={
                <Suspense fallback={<PageSkeleton variant="dashboard" />}>
                  <DashboardTransfersPage />
                </Suspense>
              }
            />
            <Route
              path="cards"
              element={
                <Suspense fallback={<PageSkeleton variant="dashboard" />}>
                  <DashboardCardsPage />
                </Suspense>
              }
            />
            <Route
              path="budgets"
              element={
                <Suspense fallback={<PageSkeleton variant="dashboard" />}>
                  <DashboardBudgetsPage />
                </Suspense>
              }
            />
            <Route
              path="analytics"
              element={
                <Suspense fallback={<PageSkeleton variant="dashboard" />}>
                  <DashboardAnalyticsPage />
                </Suspense>
              }
            />
            <Route
              path="profile"
              element={
                <Suspense fallback={<PageSkeleton variant="dashboard" />}>
                  <DashboardProfilePage />
                </Suspense>
              }
            />
            <Route
              path="settings"
              element={
                <Suspense fallback={<PageSkeleton variant="dashboard" />}>
                  <DashboardSettingsPage />
                </Suspense>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </BankingProvider>
  );
};

export default App;
