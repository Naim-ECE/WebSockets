import { WebSocketServer, WebSocket } from "ws";
import { wsArcjet } from "../arcjet.js";
let wss = null; // 🔥 FIX: Store globally so we can access it

const matchSubscribers = new Map();

function subscribe(matchId, socket) {
  if (!matchSubscribers.has(matchId)) {
    matchSubscribers.set(matchId, new Set());
  }
  matchSubscribers.get(matchId).add(socket);
}

function unsubscribe(matchId, socket) {
  const subscribers = matchSubscribers.get(matchId);
  if (!subscribers) return;

  subscribers.delete(socket);

  if (subscribers.size === 0) {
    matchSubscribers.delete(matchId);
  }
}

function cleanupDeadSubscriptions(socket) {
  for (const matchId of socket.subscriptions) {
    unsubscribe(matchId, socket);
  }
}

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

function broadcastToMatch(matchId, data) {
  const subscribers = matchSubscribers.get(matchId);
  if (!subscribers || subscribers.size === 0) return;

  const message = JSON.stringify(data);

  for (const client of subscribers) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  }
}

function handleMessage(socket, data) {
  let message;
  try {
    message = JSON.parse(data.toString());
  } catch (error) {
    console.error("❌ Error parsing message:", error);
    sendJson(socket, {
      type: "error",
      message: "Invalid JSON format",
    });
    return;
  }

  console.log("📨 Received:", message);

  if (message?.type === "subscribe" && Number.isInteger(message.matchId)) {
    subscribe(message.matchId, socket);
    socket.subscriptions.add(message.matchId);
    sendJson(socket, {
      type: "subscribed",
      matchId: message.matchId,
    });
    return;
  }

  if (message?.type === "unsubscribe" && Number.isInteger(message.matchId)) {
    unsubscribe(message.matchId, socket);
    socket.subscriptions.delete(message.matchId);
    sendJson(socket, {
      type: "unsubscribed",
      matchId: message.matchId,
    });
    return;
  }

  // Fallback: echo anything that isn't a subscribe/unsubscribe
  sendJson(socket, {
    type: "echo",
    data: message,
    timestamp: new Date().toISOString(),
  });
}

export function attachWebSocketServer(server) {
  if (wss) {
    console.log("⚠️ WebSocket server already exists, reusing it");
    return {
      broadcastMatchCreated: (match) => {
        console.log("📡 broadcastMatchCreated (reused)");
        broadcastJson({ type: "match_created", data: match });
      },
      broadcastCommentary: (matchId, commentary) => {
        broadcastJson({ type: "commentary", data: { matchId, commentary } });
      },
    };
  }

  wss = new WebSocketServer({
    noServer: true, // 🔥 FIX: we handle 'upgrade' manually below — don't let ws also auto-attach
    path: "/ws",
    maxPayload: 1024 * 1024, // 1MB
    perMessageDeflate: false, // 🔥 FIX: avoids "Invalid WebSocket frame: RSV1 must be clear"
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

  wss.on("connection", (socket, req) => {
    socket.isAlive = true;
    socket.subscriptions = new Set();

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
      handleMessage(socket, data);
    });

    socket.on("close", () => {
      console.log("🔌 WebSocket client disconnected");
      cleanupDeadSubscriptions(socket);
    });

    socket.on("error", (error) => {
      console.error("❌ WebSocket error:", error);
      socket.terminate();
    });
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

  function broadcastCommentary(matchId, commentary) {
    console.log("📡 broadcastCommentary called with match ID:", matchId);
    broadcastToMatch(matchId, {
      type: "commentary",
      data: { matchId, commentary },
    });
  }

  return { broadcastMatchCreated, broadcastCommentary };
}