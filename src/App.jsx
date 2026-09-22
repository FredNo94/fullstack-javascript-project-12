import { useTranslation } from 'react-i18next';
import { Anchor, Box, Button, Group, Paper } from '@mantine/core';
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
      <Paper component="header" withBorder radius={0} bg="white">
        <Group h={70} pl="calc(var(--mantine-spacing-md) + var(--mantine-spacing-sm))" pr="md" justify="space-between" wrap="nowrap">
          <Anchor component={Link} to="/" fw={700} c="black" underline="never">
            {t('app.name')}
          </Anchor>
          {authenticated && <Button variant="outline" color="blue" onClick={logout}>{t('auth.logout')}</Button>}
        </Group>
      </Paper>
      <Box component="main">
        <Outlet />
      </Box>
    </Box>
  );
}

export default App;
