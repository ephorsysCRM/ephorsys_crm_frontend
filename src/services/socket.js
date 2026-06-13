import { io } from "socket.io-client";

// ─────────────────────────────────────────────
// Singleton Socket.IO client
// autoConnect:false — call socket.connect() after login
// ─────────────────────────────────────────────
const socket = io("https://ephorsys-crm-backend.onrender.com", {
  withCredentials: true,
  autoConnect: false,
});

// Debug logs for connection events
socket.on("connect", () => {
  console.log("[socket] Connected with id:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("[socket] Disconnected:", reason);
});

export default socket;
