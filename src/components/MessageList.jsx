import { useEffect, useRef } from 'react';
import { ScrollArea, Stack, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';

export default function MessageList({ messages, channelId }) {
  const { t } = useTranslation();
  const viewport = useRef(null);

  useEffect(() => {
    if (viewport.current) viewport.current.scrollTop = viewport.current.scrollHeight;
  }, [messages, channelId]);

  return (
    <ScrollArea flex={1} mih={0} scrollbars="y" viewportRef={viewport}>
      <Stack component="ul" aria-label={t('messages.title')} gap="xs" m={0} p={0} style={{ listStyle: 'none' }}>
        {messages.map((message) => (
          <Text component="li" key={message.id} style={{ overflowWrap: 'anywhere', whiteSpace: 'pre-wrap' }}>
            <Text span fw={700}>{message.username}</Text>: {message.body}
          </Text>
        ))}
      </Stack>
    </ScrollArea>
  );
}
