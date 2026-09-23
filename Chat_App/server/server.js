import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const secretKey = "yaadfnfjnfl";
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

app.get("/login", (req, res) => {
  const token = jwt.sign(
    {
      _id: "ajfljkfwefklfm",
    },
    secretKey,
  );

  res
    .cookie("token", token, {
      httpOnly: true,
      secure: true, // Set to true if using HTTPS
      sameSite: "none", // Set to 'none' if using cross-site cookies
    })
    .json({ message: "Logged in successfully" });
});

const user = false;

// cheking if the socket is authenticated or not, if not then it will not allow the user to connect to the server.
io.use((socket, next) => {
  cookieParser()(socket.request, {}, (err) => {
    if (err) {
      return next(err);
    }
    const token = socket.request.cookies.token;

    if (!token) {
      return next(new Error("Authentication error: Token not found"));
    }

    const decoded = jwt.verify(token, secretKey);

    // if(!decoded) {
    //   return next(new Error("Authentication error: Invalid token"));
    // }

    next();
  });
});

io.on("connection", (socket) => {
  // console.log("A user connected");
  console.log("Socket ID:", socket.id);
  // socket.emit("Welcome", `Welcome to the server! to ID: ${socket.id}`);
  // socket.broadcast.emit("Welcome", `${socket.id} has joined the chat`);

  socket.on("message", ({ messages, room }) => {
    console.log(messages, room);
    // io.emit("receive-message", data);
    // socket.broadcast.emit("receive-message", data);
    socket.to(room).emit("receive-message", messages); // send message to all clients in the room & by adding 'to' to socket or io, it will send the message to all clients in the room except the sender.
  });

  socket.on("join-room", (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room: ${room}`);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
