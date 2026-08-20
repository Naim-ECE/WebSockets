import { WebSocketServer, WebSocket } from "ws";
let wss = null; // 🔥 FIX: Store globally so we can access it

function sendJson(socket, data) {
  if (socket.readyState !== WebSocket.OPEN) {
    return;
  }
  socket.send(JSON.stringify(data));
}

function broadcastJson(data) {
  if (!wss) {
    console.log("⚠️ WebSocket server not initialized");
    return;
  }
  console.log(`📡 Broadcasting to ${wss.clients.size} clients`);

  let sentCount = 0;
  for (const client of wss.clients) {
    if (client.readyState !== WebSocket.OPEN) {
      continue;
    }
    client.send(JSON.stringify(data));
    sentCount++;
  }
  console.log(`📡 Sent to ${sentCount} clients`);
}

export function attachWebSocketServer(server) {
  if (wss) {
    console.log("⚠️ WebSocket server already exists, reusing it");
    return {
      broadcastMatchCreated: (match) => {
        console.log("📡 broadcastMatchCreated (reused)");
        broadcastJson({ type: "match_created", data: match });
      },
    };
  }

  wss = new WebSocketServer({
    server,
    path: "/ws",
    maxPayload: 1024 * 1024, // 1MB
  });

  wss.on("connection", (socket) => {
    socket.isAlive = true;
    socket.on("pong", () => {
      socket.isAlive = true;
    });
    console.log("🔌 New WebSocket client connected!");
    console.log("📊 Client readyState:", socket.readyState);
    socket.send("Hello from server - plain text!");

    sendJson(socket, {
      type: "welcome",
      message: "Welcome to the WebSocket server!",
    });

    socket.on("message", (data) => {
      try {
        const message = JSON.parse(data.toString());
        console.log("📨 Received:", message);

        // Echo back
        sendJson(socket, {
          type: "echo",
          data: message,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        console.error("❌ Error parsing message:", error);
        sendJson(socket, {
          type: "error",
          message: "Invalid JSON format",
        });
      }
    });

    socket.on("close", () => {
      console.log("🔌 WebSocket client disconnected");
    });
    socket.on("error", console.error);
  });

  const interval = setInterval(() => {
    wss.clients.forEach((ws) => {
      if (ws.isAlive === false) {
        console.log("🔌 Terminating dead client");
        return ws.terminate();
      }
      ws.isAlive = false;
      ws.ping();
    });
  }, 30000);

  wss.on("close", () => {
    clearInterval(interval);
  });

  function broadcastMatchCreated(match) {
    console.log("📡 broadcastMatchCreated called with match ID:", match.id);
    broadcastJson({
      type: "match_created",
      data: match,
    });
  }
  return { broadcastMatchCreated };
}
