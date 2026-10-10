import { ThemeProvider } from 'next-themes';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router/dom';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/features/auth/AuthProvider';
import { router } from '@/routes/router';
import { store } from '@/store';

// Redux (server data, filters) wraps auth, because AuthProvider calls the API through RTK Query.
// The theme follows the system until the user picks one; it's applied as a .dark class on <html>.
export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <Provider store={store}>
        <AuthProvider>
          <RouterProvider router={router} />
          <Toaster />
        </AuthProvider>
      </Provider>
    </ThemeProvider>
  );
}
