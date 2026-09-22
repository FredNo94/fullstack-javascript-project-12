import { useTranslation } from 'react-i18next';
import { useRef, useState } from 'react';
import { Alert, Anchor, Button, Center, Paper, PasswordInput, Stack, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import useAuthStore, { selectIsAuthenticated } from '../authStore';
import authService from '../services/authService';
import { signupValidation } from '../signupValidation';

export default function SignupPage() {
  const { t } = useTranslation();
  const authenticated = useAuthStore(selectIsAuthenticated);
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);
  const busy = useRef(false);
  const form = useForm({
    initialValues: { username: '', password: '', confirmPassword: '' },
    validate: signupValidation(t),
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
        form.setFieldError('username', t('auth.userExists'));
        form.getInputNode('username')?.focus();
      } else {
        setError(t('auth.signupError'));
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
            <Title order={1} size="h2" ta="center">{t('auth.signup')}</Title>
            {error && <Alert color="red" role="alert">{error}</Alert>}
            <TextInput label={t('auth.username')} name="username" autoComplete="username" autoFocus required
              readOnly={pending} {...form.getInputProps('username')} />
            <PasswordInput label={t('auth.password')} name="password" autoComplete="new-password" required
              readOnly={pending} {...form.getInputProps('password')}
              visibilityToggleButtonProps={{ 'aria-label': t('auth.togglePassword') }} />
            <PasswordInput label={t('auth.confirmPassword')} name="confirmPassword" autoComplete="new-password" required
              readOnly={pending} {...form.getInputProps('confirmPassword')}
              visibilityToggleButtonProps={{ 'aria-label': t('auth.toggleConfirmPassword') }} />
            <Button type="submit" loading={pending}>{t('auth.register')}</Button>
            <Anchor component={Link} to="/login" ta="center">{t('auth.haveAccount')}</Anchor>
          </Stack>
        </form>
      </Paper>
    </Center>
  );
}
