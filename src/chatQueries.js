import chatService from './services/chatService.js';

const options = (resource, token, fetchData) => ({
  queryKey: [resource, token],
  queryFn: ({ signal }) => fetchData(token, signal),
  enabled: Boolean(token),
  staleTime: 30000,
  retry: (count, error) => error.response?.status !== 401 && count < 1,
});

export const channelsQuery = (token) => options('channels', token, chatService.getChannels);
export const messagesQuery = (token) => options('messages', token, chatService.getMessages);
