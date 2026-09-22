import { useTranslation } from 'react-i18next';
import { useRef } from 'react';
import { Alert, Button, Group, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useAuthStore from '../authStore';
import chatService from '../services/chatService';
import { refreshMessages } from '../messageEvents';

export default function MessageForm({ channelId }) {
  const { t } = useTranslation();
  const removeAuth = useAuthStore((state) => state.removeAuth);
  const token = useAuthStore((state) => state.token);
  const username = useAuthStore((state) => state.username);
  const client = useQueryClient();
  const sending = useRef(false);
  const input = useRef(null);
  const form = useForm({
    initialValues: { body: '' },
    validate: { body: (value) => (value.trim() ? null : t('validation.messageRequired')) },
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
      if (error.response?.status === 401) {
        removeAuth();
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
            {t('messages.sendError')}
          </Alert>
        )}
        <Group wrap="nowrap">
          <TextInput
            ref={input}
            flex={1}
            miw={0}
            aria-label={t('messages.new')}
            placeholder={t('messages.placeholder')}
            readOnly={mutation.isPending}
            disabled={!channelId}
            autoComplete="off"
            {...form.getInputProps('body')}
          />
          <Button type="submit" loading={mutation.isPending} disabled={!channelId || !form.values.body.trim()}>
            {t('messages.send')}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
