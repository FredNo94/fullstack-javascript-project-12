import { refreshMessages } from '../messageEvents.js';
import { refreshChannels } from '../channelEvents.js';
import { showConnectionError, hideConnectionError } from '../toasts.js';
import createChatCache from './chatCache.js';

export default function createAppApi({ realtime, stores, queryClient, t }) {
  return {
    start() {
      const { auth, ui, toasts } = stores;
      let active = true;
      let sessionVersion = 0;
      const applyEvent = (method, payload) => {
        const token = auth.getState().token;
        if (!active || !token) return;
        const version = sessionVersion;
        const cache = createChatCache(queryClient, () => active && version === sessionVersion);
        cache[method](token, payload);
      };
      const refresh = (resource) => {
        const token = auth.getState().token;
        if (!active || !token) return;
        if (resource === 'messages') void refreshMessages(queryClient, token);
        else void refreshChannels(queryClient, token);
      };
      const refreshAll = () => {
        refresh('channels');
        refresh('messages');
      };
      const stopAuth = auth.subscribe((state, previous) => {
        if (state.token !== previous.token) {
          sessionVersion += 1;
          queryClient.clear();
          ui.getState().reset();
        }
      });
      const stopChat = realtime.subscribeToChat({
        onMessage: (message) => applyEvent('message', message),
        onChannel: (channel) => applyEvent('channel', channel),
        onChannelRemoved: (channel) => applyEvent('removeChannel', channel),
      });
      const stopConnection = realtime.subscribeToConnection((status) => {
        ui.getState().setConnectionStatus(status);
        if (status === 'disconnected') showConnectionError(t, toasts);
        else hideConnectionError(toasts);
        if (status === 'connected') refreshAll();
      });
      return () => {
        active = false;
        stopConnection();
        stopChat();
        stopAuth();
        hideConnectionError(toasts);
        queryClient.clear();
      };
    },
  };
}

