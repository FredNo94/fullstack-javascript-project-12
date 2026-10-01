import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Alert, Button, Loader, Modal, Stack } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import useAuthStore from '../authStore';
import useUiStore from '../uiStore';
import { channelsQuery } from '../chatQueries';
import ChannelModal from './ChannelModal';

function ChannelModalLoader({ modal, token }) {
  const { t } = useTranslation();
  const close = useUiStore((state) => state.closeModal);
  const removeAuth = useAuthStore((state) => state.removeAuth);
  const channels = useQuery(channelsQuery(token));

  useEffect(() => {
    if (channels.error?.response?.status === 401) removeAuth();
  }, [channels.error, removeAuth]);

  if (!channels.data) {
    return (
      <Modal opened onClose={close} title={t('channels.title')} centered
        closeButtonProps={{ 'aria-label': t('common.close') }}>
        <Stack>
          {channels.isError ? (
            <>
              <Alert color="red">{t('chat.loadError')}</Alert>
              <Button onClick={() => { void channels.refetch(); }}>{t('common.retry')}</Button>
            </>
          ) : <Loader aria-label={t('chat.loading')} />}
          <Button variant="default" onClick={close}>{t('common.close')}</Button>
        </Stack>
      </Modal>
    );
  }

  return <ChannelModal modal={modal} channels={channels.data} />;
}

export default function ModalHost() {
  const token = useAuthStore((state) => state.token);
  const modal = useUiStore((state) => state.modal);
  const close = useUiStore((state) => state.closeModal);
  const { pathname } = useLocation();

  useEffect(() => {
    if (!token || pathname !== '/') close();
  }, [token, pathname, close]);

  if (!token || !modal || pathname !== '/') return null;
  return <ChannelModalLoader key={`${modal.type}-${modal.channelId}`} modal={modal} token={token} />;
}

