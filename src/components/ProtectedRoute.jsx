import { Navigate, Outlet } from 'react-router-dom';

import useAuthStore, { selectIsAuthenticated } from '../authStore';
import { appRoutes } from '../routes.js';

export default function ProtectedRoute() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to={appRoutes.login} replace />;
  }

  return <Outlet />;
}
