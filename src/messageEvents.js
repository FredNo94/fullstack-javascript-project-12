export const refreshMessages = async (client, token) => {
  const filters = { queryKey: ['messages', token], exact: true };
  await client.cancelQueries(filters);
  await client.invalidateQueries(filters);
};
