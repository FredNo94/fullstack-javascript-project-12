import { Anchor, Box, Button, Group } from '@mantine/core';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import useAuthStore, { selectIsAuthenticated } from './authStore';
import useUiStore from './uiStore';

function App() {
  const authenticated = useAuthStore(selectIsAuthenticated);
  const client = useQueryClient();
  const navigate = useNavigate();
  const logout = () => {
    useAuthStore.getState().removeAuth();
    client.clear();
    useUiStore.setState({ currentChannelId: null, modal: null });
    navigate('/login', { replace: true });
  };
  return (
    <Box mih="100dvh">
      <Group component="header" h={72} px="xl" bg="white" justify="space-between">
          <Anchor component={Link} to="/" fw={700}>
            Hexlet Chat
          </Anchor>
          {authenticated && <Button onClick={logout}>Выйти</Button>}
      </Group>
      <Box component="main">
        <Outlet />
      </Box>
    </Box>
  );
}

export default App;
