import express from "express";
const app = express();
import http from "http";
import path from "path";
import { Server } from "socket.io";

const server = http.createServer(app);
const io = new Server(server);

import cors from "cors";
import router from "../routes.mjs";

const userSocketMap = {};
function getAllConnectedClients(roomId) {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap[socketId],
      };
    }
  );
}

io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  socket.on("join", ({ roomId, username }) => {
    // console.log("test");
    userSocketMap[socket.id] = username;
    socket.join(roomId);
    const clients = getAllConnectedClients(roomId);
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit("join", {
        clients,
        username,
        socketId: socketId,
      });
    });
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use(express.json());
app.use(cors());

app.use("/api", router);

// socket.on("startEditing", (fileId) => {
//   // Broadcast to all clients except the sender
//   socket.broadcast.emit("userStartedEditing", fileId);
// });

// socket.on("stopEditing", (fileId) => {
//   // Broadcast to all clients except the sender
//   socket.broadcast.emit("userStoppedEditing", fileId);
// });

// socket.on("contentChange", ({ fileId, newContent }) => {
//   // Broadcast the new content to all clients except the sender
//   socket.broadcast.emit("contentChanged", { fileId, newContent });
// });

// socket.on("disconnect", () => {
//   console.log("User disconnected");
// });
