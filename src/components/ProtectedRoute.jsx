import { Navigate, Outlet } from 'react-router-dom';

import useAuthStore, { selectIsAuthenticated } from '../authStore';

export default function ProtectedRoute() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
