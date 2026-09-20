import { useState } from 'react';
import { Alert, Button, Paper, PasswordInput, Stack, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../authStore';
import authService from '../services/authService';

export default function LoginForm() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();
  const [authError, setAuthError] = useState(null);
  const [isSubmitting, setSubmitting] = useState(false);
  const form = useForm({
    initialValues: { username: '', password: '' },
    validate: {
      username: (value) => (value.trim() ? null : 'Обязательное поле'),
      password: (value) => (value ? null : 'Обязательное поле'),
    },
  });

  const handleSubmit = async (values) => {
    setAuthError(null);
    setSubmitting(true);
    try {
      const { token, username } = await authService.login(values);
      setAuth({ token, username });
      navigate('/', { replace: true });
    } catch (error) {
      if (!error.response) {
        setAuthError('Не удалось подключиться к серверу. Попробуйте ещё раз.');
      } else if (error.response.status === 401) {
        setAuthError('Неверные имя пользователя или пароль');
      } else {
        setAuthError('Ошибка сервера');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Paper withBorder shadow="sm" radius="md" p="xl" w="100%" maw={440}>
      <form onSubmit={form.onSubmit(handleSubmit)} noValidate>
        <Stack>
          <Title order={1} size="h2" ta="center">Войти</Title>
          {authError && <Alert color="red" role="alert">{authError}</Alert>}
          <TextInput
            label="Ваш ник"
            name="username"
            autoComplete="username"
            required
            {...form.getInputProps('username')}
          />
          <PasswordInput
            label="Пароль"
            name="password"
            autoComplete="current-password"
            visibilityToggleButtonProps={{ 'aria-label': 'Показать или скрыть пароль' }}
            required
            {...form.getInputProps('password')}
          />
          <Button type="submit" loading={isSubmitting} fullWidth>Войти</Button>
        </Stack>
      </form>
    </Paper>
  );
}
