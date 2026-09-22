import { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { notifications } from '@mantine/notifications';
import SocketContext from '../contexts/SocketContext';
import { showNetworkError } from '../toasts';

export default function NetworkNotifications() {
  const socket = useContext(SocketContext);
  const { t } = useTranslation();
  useEffect(() => {
    let reported = false;
    const offline = () => {
      if (!reported) showNetworkError(t);
      reported = true;
    };
    const recovered = () => {
      if (navigator.onLine && (!socket || socket.connected)) {
        reported = false;
        notifications.hide('network-error');
      }
    };
    window.addEventListener('offline', offline);
    window.addEventListener('online', recovered);
    socket?.on('disconnect', offline);
    socket?.on('connect_error', offline);
    socket?.on('connect', recovered);
    if (!navigator.onLine) offline();
    return () => {
      window.removeEventListener('offline', offline);
      window.removeEventListener('online', recovered);
      socket?.off('disconnect', offline);
      socket?.off('connect_error', offline);
      socket?.off('connect', recovered);
    };
  }, [socket, t]);
  return null;
}
