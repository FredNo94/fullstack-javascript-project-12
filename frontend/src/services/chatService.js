import axios from 'axios';

const getChannels = async (token) => {
  const response = await axios.get('/api/v1/channels', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const getMessages = async (token) => {
  const response = await axios.get('/api/v1/messages', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export default { getChannels, getMessages };