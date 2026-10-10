import { createBrowserRouter, Navigate, type RouteObject } from 'react-router';
import StyleGuide from '@/dev/StyleGuide';
import { AppLayout } from '@/layouts/AppLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import AdminPage from '@/pages/AdminPage';
import DashboardPage from '@/pages/DashboardPage';
import ExpensesPage from '@/pages/ExpensesPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import { AdminRoute, GuestRoute, ProtectedRoute } from './guards';

const devRoutes: RouteObject[] = import.meta.env.DEV
  ? [{ path: '/dev/ui', element: <StyleGuide /> }]
  : [];

export const router = createBrowserRouter([
  {
    element: <GuestRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: '/login', element: <LoginPage /> },
          { path: '/register', element: <RegisterPage /> },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/', element: <Navigate to="/dashboard" replace /> },
          { path: '/dashboard', element: <DashboardPage /> },
          { path: '/expenses', element: <ExpensesPage /> },
          { element: <AdminRoute />, children: [{ path: '/admin', element: <AdminPage /> }] },
        ],
      },
    ],
  },
  ...devRoutes,
  // Until the 404 page exists (Fri Oct 16).
  { path: '*', element: <Navigate to="/dashboard" replace /> },
]);
