import axios from "axios";
import { apiRoutes } from '../routes.js';

const login = async (values) => {
  const response = await axios.post(apiRoutes.login, values);
  return response.data;
};

const signup = async ({ username, password }) => {
  const response = await axios.post(apiRoutes.signup, { username, password }, { timeout: 15000 });
  return response.data;
};

export default { login, signup };
