import { useTranslation } from 'react-i18next';
import { Anchor, Box, Button, Group } from '@mantine/core';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import useAuthStore, { selectIsAuthenticated } from './authStore';
import useUiStore from './uiStore';

function App() {
  const { t } = useTranslation();
  const removeAuth = useAuthStore((state) => state.removeAuth);
  const authenticated = useAuthStore(selectIsAuthenticated);
  const client = useQueryClient();
  const resetUi = useUiStore((state) => state.reset);
  const navigate = useNavigate();
  const logout = () => {
    removeAuth();
    client.clear();
    resetUi();
    navigate('/login', { replace: true });
  };
  return (
    <Box mih="100dvh">
      <Group component="header" h={72} px="xl" bg="white" justify="space-between">
          <Anchor component={Link} to="/" fw={700}>
            {t('app.name')}
          </Anchor>
          {authenticated && <Button onClick={logout}>{t('auth.logout')}</Button>}
      </Group>
      <Box component="main">
        <Outlet />
      </Box>
    </Box>
  );
}

export default App;
