// Refetch after events so an in-flight snapshot cannot overwrite a new message.
export const refreshMessages = async (client, token) => {
  const filters = { queryKey: ['messages', token], exact: true };
  await client.cancelQueries(filters);
  await client.invalidateQueries(filters);
};

export const subscribeToMessages = (socket, client, token, onConnectionChange) => {
  const refresh = () => { void refreshMessages(client, token); };
  const onConnect = () => {
    onConnectionChange(true);
    refresh();
  };
  const onDisconnect = () => onConnectionChange(false);
  socket.on('newMessage', refresh);
  socket.on('connect', onConnect);
  socket.on('disconnect', onDisconnect);
  socket.on('connect_error', onDisconnect);

  if (socket.connected) refresh();
  return () => {
    socket.off('newMessage', refresh);
    socket.off('connect', onConnect);
    socket.off('disconnect', onDisconnect);
    socket.off('connect_error', onDisconnect);
  };
};
