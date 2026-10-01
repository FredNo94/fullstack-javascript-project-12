export default function createRealtimeApi(socket) {
  const subscribe = (handlers) => {
    Object.entries(handlers).forEach(([event, handler]) => socket.on(event, handler));
    return () => {
      Object.entries(handlers).forEach(([event, handler]) => socket.off(event, handler));
    };
  };

  return {
    subscribeToChat: ({ onMessage, onChannel, onChannelRemoved }) => subscribe({
      newMessage: onMessage,
      newChannel: onChannel,
      renameChannel: onChannel,
      removeChannel: onChannelRemoved,
    }),
    subscribeToConnection: (listener) => {
      const unsubscribe = subscribe({
        connect: () => listener('connected'),
        disconnect: () => listener('disconnected'),
        connect_error: () => listener('disconnected'),
      });
      listener(socket.connected ? 'connected' : 'connecting');
      return unsubscribe;
    },
  };
}

