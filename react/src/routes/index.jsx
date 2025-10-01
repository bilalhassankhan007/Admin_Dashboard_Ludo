// C:\BILAL Important\Project_Dashboard\react\src\routes\index.jsx
import React, { lazy, Suspense, useMemo } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Loader from '../components/Loader/Loader';
import AdminLayout from '../layouts/AdminLayout';
import GuestLayout from '../layouts/GuestLayout';
import ErrorPage from '../components/ErrorPage';
import NotFound from '../components/NotFound';
import Withdrawl from './Withdrawl';
import ContactUs from './ContactUs';
import ProtectedRoute from '../components/ProtectedRoute';

// Lazy helper with retry
const lazyWithRetry = (importFn) =>
  lazy(async () => {
    const MAX_RETRIES = 3;
    let attempt = 0;
    while (attempt < MAX_RETRIES) {
      try {
        return await importFn();
      } catch (err) {
        attempt += 1;
        await new Promise((res) => setTimeout(res, 200 * attempt));
        if (attempt >= MAX_RETRIES) throw err;
      }
    }
    return importFn();
  });

// ==== PRIVATE PAGES (require auth) ====
const DashboardSales = lazyWithRetry(() => import('../views/dashboard/DashSales'));
const Leaderboard = lazyWithRetry(() => import('../views/leaderboard/Leaderboard'));
const Players = lazyWithRetry(() => import('../views/players/Players'));
const TransactionHistory = lazyWithRetry(() => import('../views/transactions/transactionHistory'));
const WalletBalance = lazyWithRetry(() => import('../views/wallet/WalletBalance'));
const WithdrawalHistory = lazyWithRetry(() => import('../views/withdraw/WithdrawalHistory'));
const GameHistory = lazyWithRetry(() => import('../views/game/GameHistory'));
const UserProfile = lazyWithRetry(() => import('../views/user/UserProfile'));
const UserDetails = lazyWithRetry(() => import('../views/user/UserDetails'));
const UserWallet = lazyWithRetry(() => import('../views/user/Wallet'));
const UserWithdrawals = lazyWithRetry(() => import('../views/user/Withdrawals'));

// ==== PUBLIC PAGES (/auth/*) ====
// NOTE: filenames are lowercase to avoid casing conflicts on case-sensitive systems
const Login = lazyWithRetry(() => import('../views/auth/login'));
const Register = lazyWithRetry(() => import('../views/auth/register'));
const ForgotPassword = lazyWithRetry(() => import('../views/auth/forgot-password'));

const withSuspense = (Component) => (
  <Suspense fallback={<Loader />}>
    <Component />
  </Suspense>
);

const routes = [
  // PRIVATE AREA (wrapped in ProtectedRoute)
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: withSuspense(DashboardSales) },
      { path: 'dashboard', element: withSuspense(DashboardSales) },

      { path: 'leaderboard', element: withSuspense(Leaderboard) },
      { path: 'players', element: withSuspense(Players) },

      { path: 'transaction-history', element: withSuspense(TransactionHistory) },
      { path: 'withdrawal', element: <Withdrawl /> },
      { path: 'withdrawal-history', element: withSuspense(WithdrawalHistory) },

      {
        path: 'user-profile',
        children: [
          { index: true, element: withSuspense(UserProfile) },
          { path: ':userId', element: withSuspense(UserDetails) }
        ]
      },
      {
        path: 'user',
        children: [
          { path: 'wallet', element: withSuspense(UserWallet) },
          { path: 'withdrawals', element: withSuspense(UserWithdrawals) },
          { path: 'games', element: withSuspense(GameHistory) }
        ]
      },

      { path: 'wallet-balance', element: withSuspense(WalletBalance) },
      { path: 'game-history', element: withSuspense(GameHistory) },

      { path: 'contact-us', element: <ContactUs /> }
    ]
  },

  // PUBLIC AUTH AREA
  {
    path: '/auth',
    element: <GuestLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: 'login', element: withSuspense(Login) },
      { path: 'register', element: withSuspense(Register) },
      { path: 'forgot-password', element: withSuspense(ForgotPassword) }
    ]
  },

  { path: '*', element: <NotFound /> }
];

const routerOptions = {
  // Set in .env as VITE_APP_BASE_NAME="/react/free" (or "/" if served at root)
  basename: import.meta.env.VITE_APP_BASE_NAME || '/',
  future: { v7_startTransition: true }
};

export default function AppRoutes() {
  const router = useMemo(() => createBrowserRouter(routes, routerOptions), []);
  return <RouterProvider router={router} />;
}
