const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room`);
  });

  socket.on("sendMessage", ({ sender, receiver, text }) => {
    console.log("📨", sender, "→", receiver, ":", text);

    const message = {
      sender,
      receiver,
      text,
      createdAt: new Date(),
    };

    io.to(receiver).emit("receiveMessage", message);
    io.to(receiver).emit("newMessageNotification", { sender });
  });

  socket.on("typing", ({ sender, receiver }) => {
    io.to(receiver).emit("typing", { sender });
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);
  });
});

app.get("/", (req, res) => {
  res.send("Socket server running");
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});