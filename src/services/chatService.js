import axios from 'axios';

const getChannels = async (token, signal) => {
  const response = await axios.get('/api/v1/channels', {
    timeout: 15000,
    signal,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const getMessages = async (token, signal) => {
  const response = await axios.get('/api/v1/messages', {
    timeout: 15000,
    signal,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const sendMessage = async (token, message) => {
  const response = await axios.post('/api/v1/messages', message, {
    timeout: 15000,
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const changeChannel = async (token, method, id, name) => {
  const response = await axios({
    method,
    url: id == null ? '/api/v1/channels' : `/api/v1/channels/${encodeURIComponent(id)}`,
    data: name === undefined ? undefined : { name },
    timeout: 15000,
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const createChannel = (token, name) => changeChannel(token, 'post', null, name);
const renameChannel = (token, id, name) => changeChannel(token, 'patch', id, name);
const removeChannel = (token, id) => changeChannel(token, 'delete', id);

export default { getChannels, getMessages, sendMessage, createChannel, renameChannel, removeChannel };
