import axios from "axios";
import { store } from "../redux/store";
import { logout } from "../redux/authSlice";

// Create an Axios instance
const api = axios.create({
  baseURL: "http://localhost:8800/api/v1", // Using standard port from the backend
  withCredentials: true, // Important for sending/receiving HTTP-only cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor to handle 401 (Unauthorized) / Token Expired
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // If the server sends a 401 Unauthorized, automatically log the user out on the frontend
    if (error.response && error.response.status === 401) {
      store.dispatch(logout());
      // Optional: redirect to login here, but usually React Router handles it based on auth state
    }
    return Promise.reject(error);
  }
);

export default api;
