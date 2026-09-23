import { useMemo, useEffect, useState } from "react";
import { io } from "socket.io-client";
import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

export default function App() {
  const socket = useMemo(() => io("http://localhost:3000",{
    withCredentials: true,
  }), []);

  const [receivedMessages, setReceivedMessages] = useState([]);
  const [messages, setMessages] = useState("");
  const [room, setRoom] = useState("");
  const [socketId, setSocketId] = useState("");

  console.log("Received messages:", receivedMessages);

  const joinRoomHandler = (e) => {
    e.preventDefault();
    socket.emit("join-room", room);
    setRoom("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { messages, room });
    setMessages("");
  };

  useEffect(() => {
    socket.on("connect", () => {
      const socketId = socket.id;
      setSocketId(socketId);
      console.log("Connected to server with ID:", socket.id);
    });
    socket.on("receive-message", (data) => {
      console.log("Received message:", data);
      setReceivedMessages((prev) => [...prev, data]);
    });
    socket.on("Welcome", (message) => {
      console.log(message);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Container maxWidth="sm">
      {/* <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      /> */}
      <Typography variant="h4" align="center" gutterBottom>
        Welcome to the Chat App! Open the console to see the connection status
        and messages from the server.
      </Typography>

      <Typography variant="h6" align="center" gutterBottom>
        Your Socket ID: {socketId}
      </Typography>

      <form onSubmit={joinRoomHandler}>
        <h3>Join Room</h3>
        <TextField
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          id="outlined-basic"
          label="Room Name"
          variant="outlined"
          fullWidth
          margin="normal"
        ></TextField>
        <Button type="submit" variant="contained" color="primary">
          Join Room
        </Button>
      </form>

      <form action="" onSubmit={handleSubmit}>
        <TextField
          value={messages}
          onChange={(e) => setMessages(e.target.value)}
          id="outlined-basic"
          label="Type your message"
          variant="outlined"
          fullWidth
          margin="normal"
        ></TextField>
        <TextField
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          id="outlined-basic"
          label="Room"
          variant="outlined"
          fullWidth
          margin="normal"
        ></TextField>
        <Button type="submit" variant="contained" color="primary">
          Send
        </Button>
      </form>

      <Stack>
        {receivedMessages.map((msg, index) => (
          <Typography
            key={index}
            variant="body1"
            gutterBottom
            color="textSecondary"
            component="p"
          >
            {msg}
          </Typography>
        ))}
      </Stack>
    </Container>
  );
}
