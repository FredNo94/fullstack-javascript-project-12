import { useTranslation } from 'react-i18next';
import { useContext, useEffect, useState } from 'react';
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
import ChannelHeader from '../components/ChannelHeader';
import MessageList from '../components/MessageList';

export default function HomePage() {
  const { t } = useTranslation();
  const socket = useContext(SocketContext);
  const client = useQueryClient();
  const [connected, setConnected] = useState(() => Boolean(socket?.connected));
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

  if ((channels.isError && !channels.data) || (messages.isError && !messages.data)) {
    return (
      <Alert color="red" title={t('chat.loadError')} role="alert" m="md">
        <Stack gap="sm">
          <Text>{t('chat.retryNotice')}</Text>
          <Button onClick={() => { void channels.refetch(); void messages.refetch(); }}>{t('common.retry')}</Button>
        </Stack>
      </Alert>
    );
  }

  if (channels.isPending || messages.isPending) {
    return <Center mih="60vh"><Loader aria-label={t('chat.loading')} /></Center>;
  }

  const visibleMessages = currentChannel
    ? messages.data.filter((message) => String(message.channelId) === String(currentChannel.id))
    : [];

  return (
    <><Group align="stretch" gap={0} wrap="nowrap" p="md" h="calc(100dvh - 72px)">
      <Paper component="aside" withBorder radius="md" p="sm" w={{ base: 130, sm: 240 }} flex="0 0 auto"
        style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}>
        <Stack h="100%">
          <Group justify="space-between"><Title order={2} size="h4">{t('channels.title')}</Title><ActionIcon variant="outline" color="blue" radius="md" size={32} aria-label="+" title={t('channels.addTitle')} onClick={() => openModal('create')}>+</ActionIcon></Group>
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
                  <Text span truncate>{t('channels.label', { name: channel.name })}</Text>
                </Button>
                {channel.removable && <Menu withinPortal>
                  <Menu.Target><ActionIcon variant="subtle" aria-label={t('channels.manage', { name: channel.name })}>⋮</ActionIcon></Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item onClick={() => openModal('rename', channel.id)}>{t('channels.rename')}</Menu.Item>
                    <Menu.Item color="red" onClick={() => openModal('remove', channel.id)}>{t('common.delete')}</Menu.Item>
                  </Menu.Dropdown>
                </Menu>}
                </Group>
              ))}
              {channels.data.length === 0 && <Text c="dimmed">{t('channels.empty')}</Text>}
            </Stack>
          </ScrollArea>
        </Stack>
      </Paper>
      <Paper withBorder radius="md" ml={-1} flex={1} miw={0} mih={0}
        style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}>
      <Stack h="100%" gap={0}>
        <ChannelHeader channel={currentChannel} messageCount={visibleMessages.length} />
        <Stack component="section" aria-label={t('messages.title')} flex={1} mih={0} p="md" gap="md">
        {!connected && <Alert color="yellow" role="status">{t('chat.disconnected')}</Alert>}
        {messages.isError && <Alert color="red" role="alert">{t('messages.refreshError')} <Button variant="subtle" onClick={() => { void messages.refetch(); }}>{t('common.retry')}</Button></Alert>}
        <MessageList messages={visibleMessages} channelId={currentChannel?.id} />
        <MessageForm key={token} channelId={currentChannel?.id} />
        </Stack>
      </Stack>
      </Paper>
    </Group>
    {modal && <ChannelModal key={`${modal.type}-${modal.channelId}`} modal={modal} channels={channels.data} />}
    </>
  );
}
