import { Link } from 'react-router-dom';
import { Anchor, Stack, Title } from '@mantine/core';

export default function NotFoundPage() {
  return (
    <Stack align="center" p="xl">
      <Title order={1}>404 — Страница не найдена</Title>
      <Anchor component={Link} to="/">Вернуться на главную</Anchor>
    </Stack>
  );
}
