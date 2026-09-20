import axios from "axios";

const login = async (values) => {
  const response = await axios.post("/api/v1/login", values);
  return response.data;
};

export default { login };