import { connectDB } from "@/lib/db";
import { Connection } from "@/models/connection.model";
import { NextRequest , NextResponse } from "next/server";

export async function GET(req:NextRequest , context:{ params: Promise<{userId:string}> }){
    try{
        await connectDB();
        const params = await context.params;
        const userId = params.userId;

        const connections = await Connection.find({follower:userId}).populate("following", "firstName lastName userId profilePhoto");
        const followings = connections.map((connection)=> connection.following);

        return NextResponse.json(followings,{status:200});

    }catch(error){
        console.error("Internal Server Error. Complete Error Message : ",error);
        return NextResponse.json({message:"Internal Server Error"},{status:500});
    }
}