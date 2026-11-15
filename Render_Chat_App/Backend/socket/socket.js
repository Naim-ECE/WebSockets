import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://your-render-app-url.onrender.com",
    ],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  },
});

const userSocketMap = {};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId && userId !== "undefined") {
    if (!userSocketMap[userId]) {
      userSocketMap[userId] = [];
    }
    userSocketMap[userId].push(socket.id);
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Listen for manual socket event to mark seen (backup)
  socket.on("markMessagesSeen", async ({ senderId }) => {
    const senderSocketId = getReceiverSocketId(senderId);
    if (senderSocketId) {
      io.to(senderSocketId).emit("messagesSeen", { conversationId: senderId });
    }
  });

  socket.on("disconnect", () => {
    if (userId && userSocketMap[userId]) {
      userSocketMap[userId] = userSocketMap[userId].filter(
        (id) => id !== socket.id,
      );
      if (userSocketMap[userId].length === 0) {
        delete userSocketMap[userId];
      }
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export const getReceiverSocketId = (receiverId) => {
  const sockets = userSocketMap[receiverId];
  return sockets && sockets.length > 0 ? sockets[sockets.length - 1] : null;
};

export { app, server, io };
