import { connectDB } from "@/lib/db";
import { Message } from "@/models/chat.model";
import { User } from "@/models/user.model";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest , context : {params : {targetID : string} }){
    try{
        await connectDB();
        const params = await context.params;
        const targetID = params.targetID;
        const { userId } = getAuth(req);

        if(!targetID || !userId) return NextResponse.json({error:"Unauthorized"},{status:401});

        const user = await User.findOne({ clerkId: userId });
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        const messages = await Message.find({ 
                $or : [
                    { sender: user._id, receiver: targetID },
                    { sender: targetID, receiver: user._id }
                ]
            }).sort({createdAt:1});
        
        return NextResponse.json(messages , {status:200});

    }catch(error){
        console.error("Fetch messages error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest, context: { params: { targetID: string } }) {
    try {
        await connectDB();
        const { userId } = getAuth(req);
        console.log("User done getAuth" , userId);

        const params = await context.params;
        const targetID = params.targetID;

        if (!userId || !targetID) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const senderUser = await User.findOne({ clerkId: userId });
        if (!senderUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

        const { text } = await req.json();
        const message = await Message.create({
            sender: senderUser._id,
            receiver: targetID,
            text
        });
        return NextResponse.json(message, { status: 201 });
    } catch (error) {
        console.error("Send message error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}