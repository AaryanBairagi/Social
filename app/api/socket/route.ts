import { NextResponse } from "next/server";
import { Server } from "socket.io";

export const dynamic = "force-dynamic";      // ensure Node.js runtime
export const runtime = "nodejs";             // <-- important!

let io: any = (global as any).io;

export async function GET() {
  if (!io) {
    console.log("🟢 Initializing Socket.io server...");

    const httpServer: any = (global as any)._server;
    if (!httpServer?.listen) {
      console.error("❌ Socket.io: No Node.js HTTP server found");
      return NextResponse.json({ error: "No HTTP server" }, { status: 500 });
    }

    io = new Server(httpServer, {
      path: "/api/socket",
      addTrailingSlash: false,
      cors: { origin: "*" },
    });

    (global as any).io = io;

    io.on("connection", (socket) => {
      console.log("User connected:", socket.id);

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
        console.log("User disconnected:", socket.id);
      });
    });
  }

  return NextResponse.json({ message: "Socket.io running ✅" });
}










// import { NextRequest, NextResponse } from "next/server";
// import {Server, Socket} from "socket.io";

// let io:any;

// export async function GET(req:NextRequest){
//     //if socket conection dont exists then use nextJs internal server and make it listen to api/socket route
//         if(!io){
//             const httpServer:any = (req as any).socket?.server;
//             io = new Server(httpServer,{path:"/api/socket"});

//             io.on("connection",(socket)=>{
//                 console.log("User Connected:",socket.id);

//                 socket.on("join",(userId)=>{
//                     socket.join(userId);
//                 });
//                 socket.on("sendMessage",({sender,receiver,text})=>{
//                     io.to(receiver).emit("receiveMessage",{sender,text,createdAt:new Date()});
//                 });
//             });
//         }

//         return NextResponse.json({message:"Socket Server is running"},{status:200});
// }