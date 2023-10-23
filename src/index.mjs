import express, { json } from "express";
import cors from "cors";
import router from "../routes.mjs";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(json());
app.use(cors());

app.use("/api", router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("startEditing", (fileId) => {
    // Broadcast to all clients except the sender
    socket.broadcast.emit("userStartedEditing", fileId);
  });

  socket.on("stopEditing", (fileId) => {
    // Broadcast to all clients except the sender
    socket.broadcast.emit("userStoppedEditing", fileId);
  });

  socket.on("contentChange", ({ fileId, newContent }) => {
    // Broadcast the new content to all clients except the sender
    socket.broadcast.emit("contentChanged", { fileId, newContent });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});
