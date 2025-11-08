import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./libs/db.js";
import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import friendRoute from "./routes/friendRoute.js";
import messageRoute from "./routes/messageRoute.js";
import groupRoute from "./routes/groupRoute.js";
import uploadRoute from "./routes/uploadRoute.js";
import chatCustomizationRoute from "./routes/chatCustomizationRoute.js";
import { fileURLToPath } from "url";
import path from "path";
import cookieParser from "cookie-parser";
import { protectedRoute } from "./middlewares/authMiddleware.js";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { chatSocket } from "./sockets/chatSocket.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);

// ✅ Socket.IO
const io = new Server(server, {
  cors: {
    origin:
      process.env.NODE_ENV === "production"
        ? "https://webchat-533n.onrender.com"
        : ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  },
});

const PORT = process.env.PORT || 5001;

// ✅ Cho phép CORS cho REST API luôn
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "https://webchat-533n.onrender.com"
        : ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);

// =======================
// 🧩 MIDDLEWARES
// =======================
app.use(express.json());
app.use(cookieParser());

// ✅ Serve static uploads
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use(
  "/uploads/avatars",
  express.static(path.join(__dirname, "../uploads/avatars"))
);

// =======================
// 🌐 ROUTES (API)
// =======================
app.use("/api/auth", authRoute);
app.use(protectedRoute);
app.use("/api/users", userRoute);
app.use("/api/friends", friendRoute);
app.use("/api/messages", messageRoute);
app.use("/api/groups", groupRoute);
app.use("/api/upload", uploadRoute);
app.use("/api/chat-customizations", chatCustomizationRoute);

// =======================
// 🧩 FRONTEND SERVE (luôn ở CUỐI FILE)
// =======================
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../dist")));
  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, "../dist/index.html"));
  });
}

// =======================
// 💬 SOCKET.IO EVENTS
// =======================
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) {
    socket.join(userId);
    io.emit("user_status_changed", { userId, status: "online" });

    socket.on("disconnect", () => {
      io.emit("user_status_changed", { userId, status: "offline" });
    });
  }
});

// =======================
// ⚙️ DATABASE & SERVER START
// =======================
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`✅ Server đang chạy trên cổng ${PORT}`);
  });
});

// ✅ Setup chat socket logic
chatSocket(io);
