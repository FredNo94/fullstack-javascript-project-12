import axios from "axios";

const login = async (values) => {
  const response = await axios.post("/api/v1/login", values);
  return response.data;
};

const signup = async ({ username, password }) => {
  const response = await axios.post('/api/v1/signup', { username, password }, { timeout: 15000 });
  return response.data;
};

export default { login, signup };
