// npm install ws
import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

// 0 - connecting
// 1 - open (for client)
// 2 - closing
// 3 - closed

// npm install --save-dev @types/node @types/ws  -> no squiggly lines in vs code
// connection event
wss.on("connection", (socket, request) => {
  const ip = request.socket.remoteAddress;

  socket.on("message", (rawData) => {
    const message = rawData.toString();
    console.log(`Received message at ${ip}: ${message}`);

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
  socket.on("error", (error) => {
    console.error(`Error occurred on connection with ${ip}:`, error);
  });

  socket.on("close", (code, reason) => {
    console.log(`Client disconnected: ${ip}, Code: ${code}, Reason: ${reason}`);
  });
});

console.log("WebSocket server is running on ws://localhost:8080");
