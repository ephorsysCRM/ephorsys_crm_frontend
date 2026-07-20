import axios from "axios";
import { store } from "../redux/store";
import { logoutSuccess } from "../redux/features/auth/authSlice";

const api = axios.create({
  baseURL: import.meta.env.DEV
    ? "/api/v1"
    : "https://ephorsys-crm-backend.onrender.com/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const getAuthToken = () => {
  const { auth } = store.getState();
  // After loginSuccess: { user: response.data.data, role } → token lives at auth.user.token
  return auth?.user?.token;
};

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url || "";
    const isAuthRequest = /\/(admin|employee)\/(login|logout)/.test(requestUrl);
    const { isAuthenticated } = store.getState().auth;

    if (status === 401 && isAuthenticated && !isAuthRequest) {
      store.dispatch(logoutSuccess());
    }

    return Promise.reject(error);
  }
);

export default api;
