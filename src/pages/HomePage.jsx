import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Alert, Box, Button, Center, Group, Loader, Paper, ScrollArea, Stack, Text, TextInput, Title } from '@mantine/core';
import useAuthStore from '../authStore';
import useUiStore from '../uiStore';
import { channelsQuery, messagesQuery } from '../chatQueries';

export default function HomePage() {
  const token = useAuthStore((state) => state.token);
  const removeAuth = useAuthStore((state) => state.removeAuth);
  const currentChannelId = useUiStore((state) => state.currentChannelId);
  const setCurrentChannel = useUiStore((state) => state.setCurrentChannel);
  const channels = useQuery(channelsQuery(token));
  const messages = useQuery(messagesQuery(token));
  const currentChannel = channels.data?.find((channel) => String(channel.id) === String(currentChannelId))
    ?? channels.data?.find((channel) => channel.name === 'general')
    ?? channels.data?.[0];

  useEffect(() => {
    if (channels.isSuccess) setCurrentChannel(currentChannel?.id ?? null);
  }, [channels.isSuccess, currentChannel?.id, setCurrentChannel]);

  useEffect(() => {
    if (channels.error?.response?.status === 401 || messages.error?.response?.status === 401) {
      removeAuth();
    }
  }, [channels.error, messages.error, removeAuth]);

  if (channels.isError || messages.isError) {
    return (
      <Alert color="red" title="Не удалось загрузить чат" role="alert" m="md">
        <Stack gap="sm">
          <Text>Проверьте подключение и попробуйте ещё раз.</Text>
          <Button onClick={() => { void channels.refetch(); void messages.refetch(); }}>Повторить</Button>
        </Stack>
      </Alert>
    );
  }

  if (channels.isPending || messages.isPending) {
    return <Center mih="60vh"><Loader aria-label="Загрузка чата" /></Center>;
  }

  const visibleMessages = currentChannel
    ? messages.data.filter((message) => String(message.channelId) === String(currentChannel.id))
    : [];

  return (
    <Group align="stretch" gap="md" wrap="nowrap" p="md" h="calc(100dvh - 72px)">
      <Paper component="aside" withBorder p="sm" w={{ base: 130, sm: 240 }} flex="0 0 auto">
        <Stack h="100%">
          <Title order={2} size="h4">Каналы</Title>
          <ScrollArea flex={1}>
            <Stack gap="xs">
              {channels.data.map((channel) => (
                <Button
                  key={channel.id}
                  variant={channel.id === currentChannel?.id ? 'filled' : 'subtle'}
                  aria-pressed={channel.id === currentChannel?.id}
                  justify="flex-start"
                  onClick={() => setCurrentChannel(channel.id)}
                  fullWidth
                >
                  # {channel.name}
                </Button>
              ))}
              {channels.data.length === 0 && <Text c="dimmed">Каналов пока нет</Text>}
            </Stack>
          </ScrollArea>
        </Stack>
      </Paper>
      <Stack flex={1} miw={0}>
        <Title order={2} size="h4">{currentChannel ? `# ${currentChannel.name}` : 'Нет выбранного канала'}</Title>
        <ScrollArea flex={1} aria-label="Сообщения">
          <Stack gap="xs">
            {visibleMessages.map((message) => (
              <Text key={message.id}>
                <Text span fw={700}>{message.username}</Text>: {message.body}
              </Text>
            ))}
            {visibleMessages.length === 0 && <Text c="dimmed">Сообщений пока нет</Text>}
          </Stack>
        </ScrollArea>
        <Box component="form" onSubmit={(event) => event.preventDefault()}>
          <Group wrap="nowrap">
            <TextInput flex={1} miw={0} aria-label="Новое сообщение" placeholder="Введите сообщение..." disabled={!currentChannel} />
            <Button type="submit" disabled title="Отправка сообщений появится на следующем шаге">Отправить</Button>
          </Group>
        </Box>
      </Stack>
    </Group>
  );
}
