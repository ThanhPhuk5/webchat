import { io } from "socket.io-client";

// Lấy userId từ localStorage hoặc cookie
const userId = localStorage.getItem("userId");

// ✅ Nếu đang chạy trên domain thật (Render), dùng origin
// ✅ Nếu đang chạy local dev, dùng localhost:5001
const isDeployed = window.location.hostname !== "localhost";
const BASE_URL = isDeployed ? window.location.origin : "http://localhost:5001";

export const socket = io(BASE_URL, {
  withCredentials: true,
  transports: ["websocket"],
  query: { userId },
});
