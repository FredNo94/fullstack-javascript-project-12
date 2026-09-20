import { Anchor, Box, Group } from '@mantine/core';
import { Link, Outlet } from 'react-router-dom';

function App() {
  return (
    <Box mih="100dvh">
      <Group component="header" h={72} px="xl" bg="white">
          <Anchor component={Link} to="/" fw={700}>
            Hexlet Chat
          </Anchor>
      </Group>
      <Box component="main">
        <Outlet />
      </Box>
    </Box>
  );
}

export default App;
