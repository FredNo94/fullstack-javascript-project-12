import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Anchor, Stack, Title } from '@mantine/core';
import { appRoutes } from '../routes.js';

export default function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <Stack align="center" p="xl">
      <Title order={1}>{t('notFound.title')}</Title>
      <Anchor component={Link} to={appRoutes.home}>{t('notFound.home')}</Anchor>
    </Stack>
  );
}
