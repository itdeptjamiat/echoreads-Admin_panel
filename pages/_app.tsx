import type { AppProps } from 'next/app';
import { AuthProvider, useAuth } from '../lib/authContext';
import '../styles/globals.css';
import '../styles/magazines.css';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

function AuthGuard({ Component, pageProps, router }: AppProps) {
  const { isAuthenticated, loading } = useAuth();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Only run on client and after auth loading is complete
    if (typeof window !== 'undefined' && !loading) {
      if (!isAuthenticated && router.pathname !== '/admin/login') {
        router.replace('/admin/login');
      }
      setChecking(false);
    }
  }, [isAuthenticated, loading, router.pathname]);

  // Show loading while checking authentication
  if (loading || checking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If on login page or authenticated, render the component
  if (router.pathname === '/admin/login' || isAuthenticated) {
    return <Component {...pageProps} />;
  }

  // Otherwise, null (shouldn't happen due to redirect)
  return null;
}

function MyApp({ Component, pageProps, router }: AppProps) {
  return (
    <AuthProvider>
      <AuthGuard Component={Component} pageProps={pageProps} router={router} />
    </AuthProvider>
  );
}

export default MyApp; 