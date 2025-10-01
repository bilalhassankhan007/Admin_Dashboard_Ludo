import React, { lazy, Suspense, useMemo } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import GuestLayout from '../layouts/GuestLayout';
import Loader from '../components/Loader/Loader';
import DynamicImportErrorBoundary from '../components/DynamicImportErrorBoundary';
import ErrorPage from '../components/ErrorPage';
import NotFound from '../components/NotFound';
import ProtectedRoute from '../components/ProtectedRoute';

const lazyWithRetry = (componentImport) =>
  lazy(async () => {
    const MAX_RETRIES = 3;
    let retries = 0;
    while (retries < MAX_RETRIES) {
      try {
        return await componentImport();
      } catch (error) {
        console.error(`Failed to load module (attempt ${retries + 1}):`, error);
        retries++;
        if (retries >= MAX_RETRIES) throw error;
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
    throw new Error('Max retries reached');
  });

// Main route components - use consistent lowercase naming
const Dashboard = lazyWithRetry(() => import('../views/dashboard/Dashboard'));
const Leaderboard = lazyWithRetry(() => import('../views/leaderboard/Leaderboard'));
const Login = lazyWithRetry(() => import('../views/auth/login')); // lowercase
const Register = lazyWithRetry(() => import('../views/auth/register')); // lowercase
const ForgotPassword = lazyWithRetry(() => import('../views/auth/forgot-password')); // lowercase
const Logout = lazyWithRetry(() => import('../views/auth/Logout')); // ADD THIS IMPORT

const withSuspense = (Component) => (
  <DynamicImportErrorBoundary>
    <Suspense fallback={<Loader />}>
      <Component />
    </Suspense>
  </DynamicImportErrorBoundary>
);

const withProtectedRoute = (Component) => (
  <ProtectedRoute>
    {withSuspense(Component)}
  </ProtectedRoute>
);

const routes = [
  {
    path: '/',
    element: <AdminLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: withProtectedRoute(Dashboard) },
      { path: 'dashboard', element: withProtectedRoute(Dashboard) },
      { path: 'leaderboard', element: withProtectedRoute(Leaderboard) },
    ]
  },
  {
    path: '/auth',
    element: <GuestLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: 'login', element: withSuspense(Login) },
      { path: 'register', element: withSuspense(Register) },
      { path: 'forgot-password', element: withSuspense(ForgotPassword) },
      { path: 'logout', element: withSuspense(Logout) } 
    ]
  },
  { path: '*', element: <NotFound /> }
];

const routerOptions = {
  basename: import.meta.env.VITE_APP_BASE_NAME,
  future: { v7_startTransition: true }
};

export default function MainRoutes() {
  const router = useMemo(() => createBrowserRouter(routes, routerOptions), []);
  return <RouterProvider router={router} />;
}