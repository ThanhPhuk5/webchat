import { io } from "socket.io-client";

// Lấy userId từ localStorage hoặc cookie
const userId = localStorage.getItem("userId");

// ✅ Dùng chung origin với backend
// Khi chạy dev: http://localhost:5001
// Khi build và deploy: https://webchat-533n.onrender.com
const BASE_URL =
  import.meta.env.MODE === "production"
    ? window.location.origin
    : "http://localhost:5001";

export const socket = io(BASE_URL, {
  withCredentials: true,
  transports: ["websocket"], // Ưu tiên websocket
  query: { userId }, // Gửi userId cho backend
});
