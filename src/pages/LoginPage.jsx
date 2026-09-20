import { Navigate } from 'react-router-dom';
import { Center } from '@mantine/core';
import { useSelector } from 'react-redux';
import LoginForm from '../components/LoginForm';
import { selectIsAuthenticated } from '../slices/authSlice';

export default function LoginPage() {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <Center p="md" mih="75vh">
      <LoginForm />
    </Center>
  );
}
