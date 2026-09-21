import { useRef, useState } from 'react';
import { Alert, Button, Group, Modal, Stack, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useAuthStore from '../authStore';
import useUiStore from '../uiStore';
import chatService from '../services/chatService';
import { validateChannelName } from '../channelValidation';
import { refreshChannels } from '../channelEvents';
import { refreshMessages } from '../messageEvents';

export default function ChannelModal({ modal, channels }) {
  const token = useAuthStore((state) => state.token);
  const close = useUiStore((state) => state.closeModal);
  const selectChannel = useUiStore((state) => state.setCurrentChannel);
  const client = useQueryClient();
  const channel = channels.find((item) => item.id === modal.channelId);
  const deleting = modal.type === 'remove';
  const creating = modal.type === 'create';
  const unavailable = !creating && !channel?.removable;
  const busy = useRef(false);
  const [error, setError] = useState(null);
  const form = useForm({
    initialValues: { name: channel?.name ?? '' },
    validate: { name: (name) => deleting ? null : validateChannelName(name, channels, modal.channelId) },
  });
  const mutation = useMutation({
    retry: false,
    networkMode: 'always',
    mutationFn: async ({ name }) => {
      if (unavailable) throw new Error('Канал недоступен');
      if (deleting) return chatService.removeChannel(token, channel.id);

      const latest = await chatService.getChannels(token);
      const validation = validateChannelName(name, latest, modal.channelId);
      if (validation) {
        form.setFieldError('name', validation);
        throw new Error(validation);
      }
      return creating ? chatService.createChannel(token, name)
        : chatService.renameChannel(token, channel.id, name);
    },
  });
  const submit = async ({ name }) => {
    if (busy.current || unavailable) return;
    busy.current = true;
    setError(null);
    try {
      const result = await mutation.mutateAsync({ name: name.trim() });
      await client.cancelQueries({ queryKey: ['channels', token], exact: true });
      client.setQueryData(['channels', token], (old = []) => deleting
        ? old.filter((item) => item.id !== result.id)
        : [...old.filter((item) => item.id !== result.id), result]);
      if (creating) selectChannel(result.id);
      void refreshChannels(client, token);
      if (deleting) void refreshMessages(client, token);
      close();
    } catch (reason) {
      if (reason.response?.status === 401) useAuthStore.getState().removeAuth();
      setError('Не удалось выполнить операцию. Проверьте список каналов перед повторной попыткой.');
    } finally {
      busy.current = false;
    }
  };
  const title = creating ? 'Добавить канал' : deleting ? 'Удалить канал' : 'Переименовать канал';
  return (
    <Modal opened onClose={() => { if (!mutation.isPending) close(); }} title={title} centered
      closeOnEscape={!mutation.isPending} closeOnClickOutside={!mutation.isPending}
      withCloseButton={!mutation.isPending}>
      <form onSubmit={(event) => form.onSubmit(submit)(event)}>
        <Stack>
          {unavailable && <Alert color="red" role="alert">Канал удалён или недоступен для изменения.</Alert>}
          {error && <Alert color="red" role="alert">{error}</Alert>}
          {deleting ? <Text>Удалить канал «{channel?.name}» и все его сообщения?</Text> : (
            <TextInput label="Имя канала" data-autofocus required
              readOnly={mutation.isPending} {...form.getInputProps('name')}
              onFocus={(event) => event.currentTarget.select()} />
          )}
          <Group justify="flex-end">
            <Button variant="default" onClick={close} disabled={mutation.isPending}>Отменить</Button>
            <Button type="submit" color={deleting ? 'red' : 'blue'} data-autofocus={deleting || undefined}
              loading={mutation.isPending} disabled={unavailable}>
              {creating ? 'Добавить' : deleting ? 'Удалить' : 'Сохранить'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
