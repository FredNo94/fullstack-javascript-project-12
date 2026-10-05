import { Navigate } from 'react-router-dom';
import { Center } from '@mantine/core';

import LoginForm from '../components/LoginForm';
import useAuthStore, { selectIsAuthenticated } from '../authStore';
import { appRoutes } from '../routes.js';

export default function LoginPage() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);

  if (isAuthenticated) {
    return <Navigate to={appRoutes.home} replace />;
  }

  return (
    <Center p="md" mih="75vh">
      <LoginForm />
    </Center>
  );
}
