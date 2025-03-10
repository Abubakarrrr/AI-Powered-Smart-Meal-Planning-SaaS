import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

// Explicitly define a type for the userSocketMap
const userSocketMap: Record<string, string> = {}; // { userId: socketId }

export function getReceiverSocketId(userId: string): string | undefined {
  return userSocketMap[userId];
}

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId as string; // Ensure it's treated as a string
  if (userId) userSocketMap[userId] = socket.id;

  // Send updated online users list
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    if (userId) delete userSocketMap[userId]; // Ensure userId exists before deleting
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
