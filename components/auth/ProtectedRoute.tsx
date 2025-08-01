import React from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../lib/authContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole, requireAdmin = true }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, loading, router]);

  React.useEffect(() => {
    if (!loading && isAuthenticated) {
      // Check for admin requirement (check both role and userType)
      if (requireAdmin && user?.role !== 'admin' && user?.userType !== 'admin') {
        router.push('/admin/login?error=unauthorized');
        return;
      }
      
      // Check for specific role requirement
      if (requiredRole && user?.role !== requiredRole && user?.userType !== requiredRole) {
        router.push('/admin/login?error=unauthorized');
        return;
      }
    }
  }, [isAuthenticated, loading, user, requiredRole, requireAdmin, router]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Don't render children if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Don't render children if user doesn't have required role
  if (requireAdmin && user?.role !== 'admin') {
    return null;
  }
  
  if (requiredRole && user?.role !== requiredRole) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 