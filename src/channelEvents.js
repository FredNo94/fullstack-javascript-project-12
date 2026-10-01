export const refreshChannels = async (client, token) => {
  const filters = { queryKey: ['channels', token], exact: true };
  await client.cancelQueries(filters);
  await client.invalidateQueries(filters);
};
