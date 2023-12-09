import express from "express";
const app = express();

import http from "http";
import { Server } from "socket.io";

const server = http.createServer(app);
const io = new Server(server);

import cors from "cors";
import router from "../routes.mjs";

io.on("connection", (socket) => {
  console.log("User connected", socket.id);
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
