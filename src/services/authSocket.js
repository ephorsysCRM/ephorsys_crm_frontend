import socket from "./socket";

/**
 * Call this after the user has successfully logged in and you know their MongoDB _id.
 * It ensures the socket client connects (if not already) and joins a private room
 * named after the employee's id so the backend can emit real‑time updates only
 * to that user.
 */
export const joinUserRoom = (userId) => {
  if (!userId) return;

  // If already connected, emit join immediately
  if (socket.connected) {
    socket.emit("join", { userId });
    console.log("[authSocket] Already connected, joined room:", userId);
    return;
  }

  // Connect first, then emit join AFTER the connection is established
  socket.connect();

  // Use .once so the listener auto-removes after firing
  socket.once("connect", () => {
    socket.emit("join", { userId });
    console.log("[authSocket] Connected & joined room:", userId);
  });
};
