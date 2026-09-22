import { notifications } from '@mantine/notifications';
import { isAxiosError } from 'axios';

export const showNetworkError = (t) => notifications.show({
  id: 'network-error',
  color: 'red',
  message: t('notifications.networkError'),
  autoClose: 7000,
  closeButtonProps: { 'aria-label': t('common.close') },
});

export const showRequestError = (error, t) => {
  if (isAxiosError(error) && !error.response) {
    showNetworkError(t);
  } else {
    notifications.show({
      id: 'data-load-error',
      color: 'red',
      message: t('notifications.loadError'),
      closeButtonProps: { 'aria-label': t('common.close') },
    });
  }
};

export const showChannelSuccess = (type, t) => notifications.show({
  color: 'green',
  message: t(`notifications.channel.${type}`),
  closeButtonProps: { 'aria-label': t('common.close') },
});
