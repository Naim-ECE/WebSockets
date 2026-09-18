import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";

const PORT = 3000;

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

io.on("connection", (socket) => {
  // console.log("A user connected");
  console.log("Socket ID:", socket.id);
  // socket.emit("Welcome", `Welcome to the server! to ID: ${socket.id}`);
  // socket.broadcast.emit("Welcome", `${socket.id} has joined the chat`);

  socket.on("message", (data) => {
    console.log(data);
    // io.emit("receive-message", data);
    socket.broadcast.emit("receive-message", data);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
