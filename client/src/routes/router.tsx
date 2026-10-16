import { createBrowserRouter, type RouteObject } from 'react-router';
import StyleGuide from '@/dev/StyleGuide';
import ExpenseDetailPanel from '@/features/expenses/ExpenseDetailPanel';
import { EditExpensePanel, NewExpensePanel } from '@/features/expenses/ExpenseFormModal';
import { AppLayout } from '@/layouts/AppLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import AdminCategoriesPage from '@/pages/AdminCategoriesPage';
import AdminExpensesPage from '@/pages/AdminExpensesPage';
import AdminOverviewPage from '@/pages/AdminOverviewPage';
import AdminUsersPage from '@/pages/AdminUsersPage';
import BudgetsPage from '@/pages/BudgetsPage';
import DashboardPage from '@/pages/DashboardPage';
import ErrorPage from '@/pages/ErrorPage';
import ExpensesPage from '@/pages/ExpensesPage';
import LoginPage from '@/pages/LoginPage';
import NotFoundPage from '@/pages/NotFoundPage';
import RegisterPage from '@/pages/RegisterPage';
import ReportsPage from '@/pages/ReportsPage';
import SettingsPage from '@/pages/SettingsPage';
import { AdminRoute, GuestRoute, HomeRedirect, ProtectedRoute } from './guards';

const devRoutes: RouteObject[] = import.meta.env.DEV
  ? [{ path: '/dev/ui', element: <StyleGuide /> }]
  : [];

export const router = createBrowserRouter([
  {
    // One error boundary for every page: a crash anywhere shows ErrorPage, not a blank screen.
    errorElement: <ErrorPage />,
    children: [
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
              { path: '/', element: <HomeRedirect /> },
              { path: '/dashboard', element: <DashboardPage /> },
              {
                // Detail (slideout) and add/edit (modal) open over the list, so they nest under it.
                path: '/expenses',
                element: <ExpensesPage />,
                children: [
                  { path: 'new', element: <NewExpensePanel /> },
                  { path: ':id', element: <ExpenseDetailPanel /> },
                  { path: ':id/edit', element: <EditExpensePanel /> },
                ],
              },
              { path: '/budgets', element: <BudgetsPage /> },
              { path: '/reports', element: <ReportsPage /> },
              { path: '/settings', element: <SettingsPage /> },
              {
                element: <AdminRoute />,
                children: [
                  { path: '/admin', element: <AdminOverviewPage /> },
                  { path: '/admin/users', element: <AdminUsersPage /> },
                  { path: '/admin/expenses', element: <AdminExpensesPage /> },
                  { path: '/admin/categories', element: <AdminCategoriesPage /> },
                ],
              },
            ],
          },
        ],
      },
      ...devRoutes,
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
