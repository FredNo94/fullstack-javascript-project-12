import { refreshMessages } from './messageEvents.js';

export const refreshChannels = async (client, token) => {
  const filters = { queryKey: ['channels', token], exact: true };
  await client.cancelQueries(filters);
  await client.invalidateQueries(filters);
};

export const subscribeToChannels = (socket, client, token) => {
  const refresh = () => { void refreshChannels(client, token); };
  const remove = () => {
    refresh();
    void refreshMessages(client, token);
  };
  socket.on('newChannel', refresh);
  socket.on('renameChannel', refresh);
  socket.on('removeChannel', remove);
  socket.on('connect', refresh);
  if (socket.connected) refresh();
  return () => {
    socket.off('newChannel', refresh);
    socket.off('renameChannel', refresh);
    socket.off('removeChannel', remove);
    socket.off('connect', refresh);
  };
};
