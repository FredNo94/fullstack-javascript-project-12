import { useContext, useEffect, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ActionIcon, Alert, Button, Center, Menu, Group, Loader, Paper, ScrollArea, Stack, Text, Title } from '@mantine/core';
import useAuthStore from '../authStore';
import useUiStore from '../uiStore';
import { channelsQuery, messagesQuery } from '../chatQueries';

import SocketContext from '../contexts/SocketContext';
import MessageForm from '../components/MessageForm';
import { subscribeToMessages } from '../messageEvents';
import { subscribeToChannels } from '../channelEvents';
import ChannelModal from '../components/ChannelModal';

export default function HomePage() {
  const socket = useContext(SocketContext);
  const client = useQueryClient();
  const [connected, setConnected] = useState(() => Boolean(socket?.connected));
  const viewport = useRef(null);
  const token = useAuthStore((state) => state.token);
  const removeAuth = useAuthStore((state) => state.removeAuth);
  const currentChannelId = useUiStore((state) => state.currentChannelId);
  const setCurrentChannel = useUiStore((state) => state.setCurrentChannel);
  const modal = useUiStore((state) => state.modal);
  const openModal = useUiStore((state) => state.openModal);
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
    const stopMessages = subscribeToMessages(socket, client, token, setConnected);
    const stopChannels = subscribeToChannels(socket, client, token);
    return () => { stopMessages(); stopChannels(); };
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
    <><Group align="stretch" gap="md" wrap="nowrap" p="md" h="calc(100dvh - 72px)">
      <Paper component="aside" withBorder p="sm" w={{ base: 130, sm: 240 }} flex="0 0 auto">
        <Stack h="100%">
          <Group justify="space-between"><Title order={2} size="h4">Каналы</Title><ActionIcon aria-label="Добавить канал" onClick={() => openModal('create')}>+</ActionIcon></Group>
          <ScrollArea flex={1} type="auto" scrollbars="y">
            <Stack gap="xs">
              {channels.data.map((channel) => (
                <Group key={channel.id} gap={0} wrap="nowrap"><Button
                  variant={channel.id === currentChannel?.id ? 'filled' : 'subtle'}
                  aria-pressed={channel.id === currentChannel?.id}
                  justify="flex-start"
                  onClick={() => setCurrentChannel(channel.id)}
                  flex={1} miw={0} title={channel.name}
                >
                  <Text span truncate># {channel.name}</Text>
                </Button>
                {channel.removable && <Menu withinPortal>
                  <Menu.Target><ActionIcon variant="subtle" aria-label={`Управление каналом ${channel.name}`}>⋮</ActionIcon></Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item onClick={() => openModal('rename', channel.id)}>Переименовать</Menu.Item>
                    <Menu.Item color="red" onClick={() => openModal('remove', channel.id)}>Удалить</Menu.Item>
                  </Menu.Dropdown>
                </Menu>}
                </Group>
              ))}
              {channels.data.length === 0 && <Text c="dimmed">Каналов пока нет</Text>}
            </Stack>
          </ScrollArea>
        </Stack>
      </Paper>
      <Stack flex={1} miw={0}>
        <Title order={2} size="h4" lineClamp={1}>{currentChannel ? `# ${currentChannel.name}` : 'Нет выбранного канала'}</Title>
        {!connected && <Alert color="yellow" role="status">Соединение потеряно. Ожидаем подключения для получения новых сообщений.</Alert>}
        {messages.isError && <Alert color="red" role="alert">Не удалось обновить сообщения. <Button variant="subtle" onClick={() => { void messages.refetch(); }}>Повторить</Button></Alert>}
        <ScrollArea flex={1} mih={0} scrollbars="y" viewportRef={viewport} aria-label="Сообщения">
          <Stack gap="xs">
            {visibleMessages.map((message) => (
              <Text key={message.id} style={{ overflowWrap: 'anywhere', whiteSpace: 'pre-wrap' }}>
                <Text span fw={700}>{message.username}</Text>: {message.body}
              </Text>
            ))}
            {visibleMessages.length === 0 && <Text c="dimmed">Сообщений пока нет</Text>}
          </Stack>
        </ScrollArea>
        <MessageForm key={token} channelId={currentChannel?.id} />
      </Stack>
    </Group>
    {modal && <ChannelModal key={`${modal.type}-${modal.channelId}`} modal={modal} channels={channels.data} />}
    </>
  );
}
