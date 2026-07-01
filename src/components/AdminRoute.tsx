import { LoadingSkeleton } from './LoadingSkeleton';
import { PageContainer } from './PageContainer';
import { useAuth } from '../contexts/AuthContext';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export function AdminRoute() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <PageContainer className="py-16">
        <div className="mx-auto max-w-2xl space-y-4">
          <LoadingSkeleton className="h-20 w-full rounded-3xl" />
          <LoadingSkeleton className="h-72 w-full rounded-3xl" />
        </div>
      </PageContainer>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!user?.isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}