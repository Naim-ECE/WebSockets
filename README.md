# WebSockets Learning

## Goals

- WebSocket basics
- HTTP vs WebSocket
- WebSocket lifecycle
- Client-server communication
- Sending and receiving messages
- Broadcasting
- Multiple clients
- Rooms
- Authentication
- Real-time notifications
- Reconnection
- Scaling

## Learning Order

1. HTTP basics
2. WebSocket fundamentals
3. WebSocket lifecycle
4. Client ↔ Server messaging
5. JSON messages
6. Multiple clients
7. Broadcasting
8. Chat application
9. Rooms
10. Authentication
11. React integration
12. Real-time notifications
13. Reconnection
14. Redis
15. Deployment

## Important Images

<img src="https://raw.githubusercontent.com/Naim-ECE/WebSockets/main/Shots/Websockets.png" alt="WebSockets Image" height="auto" width="250">
<br>
<img src="https://raw.githubusercontent.com/Naim-ECE/WebSockets/main/Shots/WebRTC.png" alt="WebRTC Image" height="auto" width="250">
<br>
<img src="https://raw.githubusercontent.com/Naim-ECE/WebSockets/main/Shots/WebTransport.png" alt="WebTransport Image" height="auto" width="250">
<br>
<img src="https://raw.githubusercontent.com/Naim-ECE/WebSockets/main/Shots/ServerSentEvents.png" alt="SSE Image" height="auto" width="250">

## WebSocket Lifecycle

```text
Client
  ↓
Connect
  ↓
Server
  ↓
OPEN
  ↓
Send / Receive
  ↓
CLOSE
```

## io -> whole circuit (a set of clients)
## socket -> individual client

# ⚡ Socket.IO Cheatsheet

![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

A comprehensive visual guide to Socket.IO methods for both the **Server** and **Client** sides. 

---

# ⚡ Socket.IO Cheatsheet

A comprehensive list of Socket.IO methods for both the **Server** and **Client** sides. Perfect for quick reference.

---

## 📑 Table of Contents
- [🖥️ Server-Side API](#️-server-side-api)
  - [Server Instance (`io`)](#server-instance-io)
  - [Socket Instance (Server)](#socket-instance-server)
  - [Broadcasting Patterns](#broadcasting-patterns)
- [💻 Client-Side API](#-client-side-api)
  - [Socket Instance (Client)](#socket-instance-client)
  - [Common Client Events](#common-client-events)
- [🌐 Common API (Both Client & Server)](#-common-api-both-client--server)
- [🏠 Rooms API (Server-Only Concept)](#-rooms-api-server-only-concept)
- [⚡ Acknowledgements](#-acknowledgements)
- [🏷️ Namespaces](#️-namespaces)
- [🔄 Common Patterns](#-common-patterns)

---

## 🖥️ Server-Side API

### Server Instance (`io`)

| Method | Description |
|---|---|
| `io.emit(eventName, ...args)` | Broadcasts to all connected clients |
| `io.to(room).emit(...)` | Emits to all clients in a specific room |
| `io.except(room).emit(...)` | Emits to all clients except those in a room |
| `io.of(namespace).emit(...)` | Emits to all clients in a namespace |
| `io.serverSideEmit(event, ...args)` | Emits to all Socket.IO servers in a cluster |
| `io.timeout(ms).emit(...)` | Adds a timeout for acknowledgements |
| `io.sockets` | Alias for the main namespace (`/`) |
| `io.on("connection", cb)` | Listens for new client connections |

### Socket Instance (Server)

| Method | Description |
|---|---|
| `socket.emit(event, ...args)` | Sends to the single connected client |
| `socket.broadcast.emit(...)` | Sends to all clients **except** the sender |
| `socket.to(room).emit(...)` | Sends to a room, excluding the sender |
| `socket.join(room)` | Subscribes the socket to a room |
| `socket.leave(room)` | Unsubscribes the socket from a room |
| `socket.disconnect(close?)` | Disconnects the client |
| `socket.emitWithAck(...)` | Emits and awaits an acknowledgement |
| `socket.timeout(ms).emit(...)` | Adds a timeout for acknowledgements |
| `socket.volatile.emit(...)` | Message may be dropped if not writable |
| `socket.compress(false).emit(...)` | Disables compression for a message |
| `socket.on("disconnecting", cb)` | Fired when the socket is leaving rooms |
| `socket.on("disconnect", cb)` | Fired when the socket disconnects |

### Broadcasting Patterns

| Pattern | Description |
|---|---|
| `io.emit("hello")` | To all connected clients |
| `socket.broadcast.emit("hello")` | To all except the sender |
| `io.to("room").emit("hello")` | To all in a room |
| `io.except("room").emit("hello")` | To all except a room |
| `io.to("r1").to("r2").except("r3").emit("hello")` | Chained filters |

---

## 💻 Client-Side API

### Socket Instance (Client)

| Method | Description |
|---|---|
| `socket.emit(event, ...args)` | Sends an event to the server |
| `socket.on(event, cb)` | Listens for an event from the server |
| `socket.once(event, cb)` | Listens once, then removes the listener |
| `socket.off(event)` | Removes a listener |
| `socket.emitWithAck(...)` | Emits and awaits an acknowledgement |
| `socket.timeout(ms).emit(...)` | Adds a timeout for acknowledgements |
| `socket.volatile.emit(...)` | Message may be dropped if not writable |
| `socket.compress(false).emit(...)` | Disables compression for a message |
| `socket.onAny(cb)` | Catch-all listener for incoming events |
| `socket.onAnyOutgoing(cb)` | Catch-all listener for outgoing events |
| `socket.disconnect()` | Disconnects from the server |
| `socket.active` | Whether the socket will try to reconnect |
| `socket.id` | The session ID of the socket |
| `socket.connected` | Whether the socket is connected |
| `socket.io` | Reference to the underlying Manager |

### Common Client Events

| Event | Description |
|---|---|
| `socket.on("connect", cb)` | Fired upon connection |
| `socket.on("disconnect", cb)` | Fired upon disconnection |
| `socket.on("connect_error", cb)` | Fired upon connection failure |

---

## 🌐 Common API (Both Client & Server)

| Method | Description |
|---|---|
| `socket.emit(event, ...args)` | Sends data to the other side |
| `socket.on(event, cb)` | Listens for events |
| `socket.once(event, cb)` | Listens once, then removes |
| `socket.off(event)` | Removes a listener |
| `socket.removeAllListeners(event?)` | Removes all listeners |

---

## 🏠 Rooms API (Server-Only Concept)

| Method | Description |
|---|---|
| `socket.join("room")` | Subscribes socket to a room |
| `socket.leave("room")` | Unsubscribes socket from a room |
| `io.to("room").emit(...)` | Emits to all in a room |
| `io.except("room").emit(...)` | Emits to all except a room |
| `socket.to("room").emit(...)` | Emits to a room, excluding sender |
| `socket.rooms` | Set of rooms the socket is in |
| `socket.on("disconnecting", cb)` | Fired before leaving rooms |

---

## ⚡ Acknowledgements

| Method | Description |
|---|---|
| `socket.emit("ev", data, (response) => {})` | Callback-based acknowledgement |
| `socket.emitWithAck("ev", data)` | Promise-based acknowledgement |
| `socket.timeout(ms).emit(...)` | Adds a timeout for ack |
| `io.timeout(ms).emit(...)` | Server-side ack with timeout |

---

## 🏷️ Namespaces

| Method | Description |
|---|---|
| `io.of("/namespace")` | Creates/accesses a namespace |
| `io.of("/ns").emit(...)` | Emits to all in a namespace |
| `io.of("/ns").on("connection", cb)` | Listens for connections to a namespace |

---

## 🔄 Common Patterns

### 1. Basic Chat Room (Server)
```javascript
io.on("connection", (socket) => {
  // Join a room
  socket.join("room1");

  // Send to everyone in the room
  io.to("room1").emit("message", "Hello Room!");

  // Send to everyone except sender
  socket.broadcast.to("room1").emit("message", "New user joined");

  // Listen for messages
  socket.on("chat", (msg) => {
    io.to("room1").emit("chat", msg);
  });
});
```

## 🔄 Visual Flow: How Events Travel

Here is a visual sequence diagram showing how `emit`, `io.emit`, and `socket.broadcast.emit` differ in a real-time chat scenario.

```mermaid
sequenceDiagram
    autonumber
    participant C1 as Client 1 (Sender)
    participant S as Server
    participant C2 as Client 2 (Receiver)
    participant C3 as Client 3 (Receiver)

    Note over C1, C3: All clients are connected

    C1->>S: socket.emit("chat", "Hello!")
    Note over S: Server processes the incoming message
    
    S-->>C1: io.emit("chat", "Hello!") <br/> (Echoes back to sender)
    S-->>C2: socket.broadcast.emit("chat", "Hello!") <br/> (Sent to everyone EXCEPT sender)
    S-->>C3: socket.broadcast.emit("chat", "Hello!") <br/> (Sent to everyone EXCEPT sender)
