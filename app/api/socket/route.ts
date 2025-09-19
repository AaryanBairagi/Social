import { NextRequest, NextResponse } from "next/server";
import {Server, Socket} from "socket.io";

let io:any;

export async function GET(req:NextRequest){
    //if socket conection dont exists then use nextJs internal server and make it listen to api/socket route
        if(!io){
            const httpServer:any = (req as any).socket?.server;
            io = new Server(httpServer,{path:"api/socket"});

            io.on("connection",(socket)=>{
                console.log("User Connected:",socket.id);

                socket.on("join",(userId)=>{
                    socket.join(userId);
                });
                socket.on("sendMessage",({sender,receiver,text})=>{
                    io.to(receiver).emit("receiverMessage",{sender,text,createdAt:new Date()});
                });
            });
        }

        return NextResponse.json({message:"Socket Server is running"},{status:200});
}