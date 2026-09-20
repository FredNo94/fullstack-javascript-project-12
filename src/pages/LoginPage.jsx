import { Navigate } from 'react-router-dom';
import { Center } from '@mantine/core';

import LoginForm from '../components/LoginForm';
import useAuthStore, { selectIsAuthenticated } from '../authStore';

export default function LoginPage() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <Center p="md" mih="75vh">
      <LoginForm />
    </Center>
  );
}
