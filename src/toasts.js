import { useContext } from 'react';
import StoresContext from './contexts/StoresContext.js';
import { notifications } from '@mantine/notifications';
import { isAxiosError } from 'axios';

export const useToastStore = () => useContext(StoresContext).toasts;

export const showNetworkError = (t, store) => notifications.show({
  id: 'network-error',
  color: 'red',
  message: t('notifications.networkError'),
  autoClose: 7000,
  closeButtonProps: { 'aria-label': t('common.close') },
}, store);

export const showRequestError = (error, t, store) => {
  if (isAxiosError(error) && !error.response) {
    showNetworkError(t, store);
  } else {
    notifications.show({
      id: 'data-load-error',
      color: 'red',
      message: t('notifications.loadError'),
      closeButtonProps: { 'aria-label': t('common.close') },
    }, store);
  }
};

export const showChannelSuccess = (type, t, store) => notifications.show({
  color: 'green',
  message: t(`notifications.channel.${type}`),
  closeButtonProps: { 'aria-label': t('common.close') },
}, store);
