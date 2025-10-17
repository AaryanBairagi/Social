import { Server } from "socket.io";

export default function handler(req, res) {
  if (!res.socket.server.io) {
    console.log("🟢 Initializing Socket.io server...");

    const io = new Server(res.socket.server, {
      path: "/api/socket",
      cors: { origin: "*" },
    });

    io.on("connection", (socket) => {
      console.log("✅ User Connected:", socket.id);

      socket.on("join", (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined room`);
      });

      socket.on("sendMessage", ({ sender, receiver, text }) => {
        console.log("📨", sender, "→", receiver, ":", text);
        io.to(receiver).emit("receiveMessage", {
          sender,
          receiver,
          text,
          createdAt: new Date(),
        });
      });

      socket.on("disconnect", () => {
        console.log("❌ User Disconnected:", socket.id);
      });
    });

    res.socket.server.io = io;
  } else {
    console.log("Socket.io server already running ✅");
  }

  res.end();
}
