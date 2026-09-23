import { Box, Divider, Stack, Text, Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';

export default function ChannelHeader({ channel, messageCount }) {
  const { t } = useTranslation();

  return (
    <Box component="header" flex="0 0 auto">
      <Stack p="md" gap={4}>
        <Title order={2} size="h4" lineClamp={1}>
          {channel ? channel.name : t('channels.notSelected')}
        </Title>
        <Text size="sm" c="dimmed">{t('messages.count', { count: messageCount })}</Text>
      </Stack>
      <Divider />
    </Box>
  );
}
