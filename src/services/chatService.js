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

export default { getChannels, getMessages, sendMessage };
