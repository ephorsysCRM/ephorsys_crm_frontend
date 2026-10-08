import axios from "axios";

const api = axios.create({
  // baseURL: "https://ephorsys-crm-backend.onrender.com/api/v1",
  baseURL: "http://localhost:8800/api/v1",
  withCredentials: true,
});

export default api;
