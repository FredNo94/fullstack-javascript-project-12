import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Alert, Anchor, Button, Center, Image, Paper, PasswordInput, SimpleGrid, Stack, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../authStore';
import authService from '../services/authService';
import avatarImg from '../assets/avatar.jpg';
import { useToastStore, showNetworkError } from '../toasts';

export default function LoginForm() {
  const { t } = useTranslation();
  const toastStore = useToastStore();
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();
  const [authError, setAuthError] = useState(null);
  const [isSubmitting, setSubmitting] = useState(false);
  const form = useForm({
    initialValues: { username: '', password: '' },
    validate: {
      username: (value) => (value.trim() ? null : t('validation.required')),
      password: (value) => (value ? null : t('validation.required')),
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
        showNetworkError(t, toastStore);
        setAuthError(t('auth.networkError'));
      } else if (error.response.status === 401) {
        setAuthError(t('auth.invalidCredentials'));
      } else {
        setAuthError(t('auth.serverError'));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Paper withBorder shadow="sm" radius="md" p="xl" w="100%" maw={800}>
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xl">
        <Center>
          <Image src={avatarImg} alt="" w={200} maw="100%" radius="50%" />
        </Center>
      <form onSubmit={form.onSubmit(handleSubmit)} noValidate>
        <Stack>
          <Title order={1} size="h2" ta="center">{t('auth.login')}</Title>
          {authError && <Alert color="red" role="alert">{authError}</Alert>}
          <TextInput
            label={t('auth.nickname')}
            name="username"
            autoComplete="username"
            required
            withAsterisk={false}
            {...form.getInputProps('username')}
          />
          <PasswordInput
            label={t('auth.password')}
            withAsterisk={false}
            name="password"
            autoComplete="current-password"
            visibilityToggleButtonProps={{ 'aria-label': t('auth.togglePassword') }}
            required
            {...form.getInputProps('password')}
          />
          <Button type="submit" loading={isSubmitting} fullWidth>{t('auth.login')}</Button>
          <Anchor component={Link} to="/signup" ta="center">{t('auth.signup')}</Anchor>
        </Stack>
      </form>
      </SimpleGrid>
    </Paper>
  );
}
