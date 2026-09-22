import { useTranslation } from 'react-i18next';
import { useRef } from 'react';
import { ActionIcon, Alert, Stack, TextInput } from '@mantine/core';
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
          <TextInput
            ref={input}
            size="md"
            miw={0}
            aria-label={t('messages.new')}
            placeholder={t('messages.placeholder')}
            readOnly={mutation.isPending}
            disabled={!channelId}
            autoComplete="off"
            {...form.getInputProps('body')}
            rightSectionWidth={44}
            rightSectionPointerEvents="auto"
            rightSection={(
          <ActionIcon type="submit" size={32} radius="md" color="blue"
            aria-label={t('messages.send')} title={t('messages.send')}
            loading={mutation.isPending} disabled={!channelId || !form.values.body.trim()}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
              <path d="M5 12h14m-6-6 6 6-6 6" />
            </svg>
          </ActionIcon>
            )}
          />
      </Stack>
    </form>
  );
}
