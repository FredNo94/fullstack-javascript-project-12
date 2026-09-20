import { useRef } from 'react';
import { Alert, Button, Group, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useAuthStore from '../authStore';
import chatService from '../services/chatService';
import { refreshMessages } from '../messageEvents';

export default function MessageForm({ channelId }) {
  const token = useAuthStore((state) => state.token);
  const username = useAuthStore((state) => state.username);
  const client = useQueryClient();
  const sending = useRef(false);
  const input = useRef(null);
  const form = useForm({
    initialValues: { body: '' },
    validate: { body: (value) => (value.trim() ? null : 'Введите сообщение') },
  });
  const mutation = useMutation({
    mutationFn: (message) => chatService.sendMessage(token, message),
    retry: false,
    networkMode: 'always',
  });

  const submit = async ({ body }) => {
    if (sending.current || !channelId) return;
    sending.current = true;
    try {
      await mutation.mutateAsync({ body: body.trim(), channelId, username });
      form.reset();
      void refreshMessages(client, token);
    } catch (error) {
      if (error.response?.status === 401 && useAuthStore.getState().token === token) {
        useAuthStore.getState().removeAuth();
      }
    } finally {
      sending.current = false;
      input.current?.focus();
    }
  };

  return (
    <form onSubmit={(event) => form.onSubmit(submit)(event)}>
      <Stack gap="xs">
        {mutation.isError && (
          <Alert color="red" role="alert">
            Не удалось подтвердить отправку. Текст сохранён. Проверьте сообщения перед повторной отправкой.
          </Alert>
        )}
        <Group wrap="nowrap">
          <TextInput
            ref={input}
            flex={1}
            miw={0}
            aria-label="Новое сообщение"
            placeholder="Введите сообщение..."
            readOnly={mutation.isPending}
            disabled={!channelId}
            autoComplete="off"
            {...form.getInputProps('body')}
          />
          <Button type="submit" loading={mutation.isPending} disabled={!channelId || !form.values.body.trim()}>
            Отправить
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
