import { WebSocketServer, WebSocket } from "ws";
import { wsArcjet } from "../arcjet.js";
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

  server.on("upgrade", async (req, socket, head) => {
    if (!wsArcjet) {
      wss.handleUpgrade(req, socket, head, (ws) =>
        wss.emit("connection", ws, req),
      );
      return;
    }

    try {
      const decision = await wsArcjet.protect(req);

      if (decision.isDenied()) {
        const isRateLimit = decision.reason?.isRateLimit?.() ?? false;
        const statusCode = isRateLimit ? 429 : 403;
        const statusText = isRateLimit ? "Too Many Requests" : "Forbidden";
        const body = statusText;

        socket.write(
          [
            `HTTP/1.1 ${statusCode} ${statusText}`,
            "Connection: close",
            "Content-Type: text/plain; charset=utf-8",
            `Content-Length: ${Buffer.byteLength(body)}`,
            "",
            "",
            body,
          ].join("\r\n"),
        );
        socket.destroy();
        return;
      }

      wss.handleUpgrade(req, socket, head, (ws) =>
        wss.emit("connection", ws, req),
      );
    } catch (error) {
      console.error("Error in Arcjet WebSocket security middleware:", error);
      socket.write(
        [
          "HTTP/1.1 503 Service Unavailable",
          "Connection: close",
          "Content-Length: 0",
          "",
          "",
        ].join("\r\n"),
      );
      socket.destroy();
    }
  });

  wss.on("connection", async (socket, req) => {
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
