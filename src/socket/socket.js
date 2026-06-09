import { io } from "socket.io-client";

// Adjust the URL to match your backend server address and port
const socket = io("http://localhost:8800", {
  withCredentials: true,
});

export default socket;
