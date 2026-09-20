import { useContext, useEffect, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert, Button, Center, Group, Loader, Paper, ScrollArea, Stack, Text, Title } from '@mantine/core';
import useAuthStore from '../authStore';
import useUiStore from '../uiStore';
import { channelsQuery, messagesQuery } from '../chatQueries';

import SocketContext from '../contexts/SocketContext';
import MessageForm from '../components/MessageForm';
import { subscribeToMessages } from '../messageEvents';

export default function HomePage() {
  const socket = useContext(SocketContext);
  const client = useQueryClient();
  const [connected, setConnected] = useState(() => Boolean(socket?.connected));
  const viewport = useRef(null);
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

  useEffect(() => {
    if (!socket || !token) return undefined;
    return subscribeToMessages(socket, client, token, setConnected);
  }, [socket, client, token]);

  useEffect(() => {
    if (viewport.current) viewport.current.scrollTop = viewport.current.scrollHeight;
  }, [messages.data, currentChannel?.id]);

  if ((channels.isError && !channels.data) || (messages.isError && !messages.data)) {
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
        {!connected && <Alert color="yellow" role="status">Соединение потеряно. Ожидаем подключения для получения новых сообщений.</Alert>}
        {messages.isError && <Alert color="red" role="alert">Не удалось обновить сообщения. <Button variant="subtle" onClick={() => { void messages.refetch(); }}>Повторить</Button></Alert>}
        <ScrollArea flex={1} viewportRef={viewport} aria-label="Сообщения">
          <Stack gap="xs">
            {visibleMessages.map((message) => (
              <Text key={message.id}>
                <Text span fw={700}>{message.username}</Text>: {message.body}
              </Text>
            ))}
            {visibleMessages.length === 0 && <Text c="dimmed">Сообщений пока нет</Text>}
          </Stack>
        </ScrollArea>
        <MessageForm key={token} channelId={currentChannel?.id} />
      </Stack>
    </Group>
  );
}
