import { cleanText } from '../profanity.js';

const sameId = (left, right) => String(left) === String(right);
const upsert = (items, incoming) => {
  const existing = items.some((item) => sameId(item.id, incoming.id));
  return existing
    ? items.map((item) => sameId(item.id, incoming.id) ? { ...item, ...incoming } : item)
    : [...items, incoming];
};

export default function createChatCache(queryClient, isCurrentSession) {
  const update = (resource, token, transform) => {
    const queryKey = [resource, token];
    const apply = () => {
      if (isCurrentSession()) {
        queryClient.setQueryData(queryKey, (items) => items === undefined ? undefined : transform(items));
      }
    };
    const query = queryClient.getQueryCache().find({ queryKey, exact: true });
    apply();
    if (query?.state.fetchStatus !== 'idle') {
      void query?.promise?.then(apply, () => {});
    }
  };

  return {
    message: (token, payload) => update('messages', token, (items) => (
      upsert(items, { ...payload, body: cleanText(payload.body) })
    )),
    channel: (token, payload) => update('channels', token, (items) => (
      upsert(items, { ...payload, name: cleanText(payload.name) })
    )),
    removeChannel: (token, { id }) => {
      update('channels', token, (items) => items.filter((item) => !sameId(item.id, id)));
      update('messages', token, (items) => items.filter((item) => !sameId(item.channelId, id)));
    },
  };
}
