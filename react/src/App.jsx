// C:\BILAL Important\Project_Dashboard\react\src\App.jsx
import React, { Suspense } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import Loader from './components/Loader/Loader';
import AppRoutes from './routes'; // single router

export default function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loader size="large" className="global-loader" />}>
        <AppRoutes />
      </Suspense>
    </ErrorBoundary>
  );
}
