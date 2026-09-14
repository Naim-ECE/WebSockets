import React from "react";
import { useEffect } from "react";
import { io } from "socket.io-client";

export default function App() {
  const socket = io("http://localhost:3000");

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server with ID:", socket.id);
    });
    socket.on("Welcome", (message) => {
      console.log(message);
    });
  }, []);

  return <div>App</div>;
}
