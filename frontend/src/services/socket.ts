import { io } from "socket.io-client";

// Lấy userId từ localStorage hoặc cookie
const userId = localStorage.getItem("userId");

const BASE_URL =
  import.meta.env.MODE === "production"
    ? window.location.origin
    : "http://localhost:5001";

export const socket = io(BASE_URL, {
  withCredentials: true,
  transports: ["websocket"],
  query: { userId }, // để backend nhận socket.handshake.query.userId
});
