import { useRef, useState } from 'react';
import { Alert, Anchor, Button, Center, Paper, PasswordInput, Stack, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import useAuthStore, { selectIsAuthenticated } from '../authStore';
import authService from '../services/authService';
import { signupValidation } from '../signupValidation';

export default function SignupPage() {
  const authenticated = useAuthStore(selectIsAuthenticated);
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);
  const busy = useRef(false);
  const form = useForm({
    initialValues: { username: '', password: '', confirmPassword: '' },
    validate: signupValidation,
  });
  const submit = async ({ username, password }) => {
    if (busy.current) return;
    busy.current = true;
    setPending(true);
    setError(null);
    try {
      const auth = await authService.signup({ username: username.trim(), password });
      setAuth(auth);
      navigate('/', { replace: true });
    } catch (reason) {
      if (reason.response?.status === 409) {
        form.setFieldError('username', 'Такой пользователь уже существует');
        form.getInputNode('username')?.focus();
      } else {
        setError('Не удалось зарегистрироваться. Проверьте подключение и попробуйте ещё раз.');
      }
    } finally {
      busy.current = false;
      setPending(false);
    }
  };
  if (authenticated) return <Navigate to="/" replace />;
  return (
    <Center p="md" mih="75vh">
      <Paper withBorder shadow="sm" radius="md" p="xl" w="100%" maw={440}>
        <form onSubmit={(event) => form.onSubmit(submit)(event)} noValidate>
          <Stack>
            <Title order={1} size="h2" ta="center">Регистрация</Title>
            {error && <Alert color="red" role="alert">{error}</Alert>}
            <TextInput label="Имя пользователя" name="username" autoComplete="username" autoFocus required
              readOnly={pending} {...form.getInputProps('username')} />
            <PasswordInput label="Пароль" name="password" autoComplete="new-password" required
              readOnly={pending} {...form.getInputProps('password')}
              visibilityToggleButtonProps={{ 'aria-label': 'Показать или скрыть пароль' }} />
            <PasswordInput label="Подтвердите пароль" name="confirmPassword" autoComplete="new-password" required
              readOnly={pending} {...form.getInputProps('confirmPassword')}
              visibilityToggleButtonProps={{ 'aria-label': 'Показать или скрыть подтверждение пароля' }} />
            <Button type="submit" loading={pending}>Зарегистрироваться</Button>
            <Anchor component={Link} to="/login" ta="center">Уже есть аккаунт? Войти</Anchor>
          </Stack>
        </form>
      </Paper>
    </Center>
  );
}
