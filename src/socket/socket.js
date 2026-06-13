import { io } from "socket.io-client";

// Adjust the URL to match your backend server address and port
const socket = io("https://ephorsys-crm-backend.onrender.com", {
  withCredentials: true,
});

export default socket;
