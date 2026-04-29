import { connectDB } from "@/lib/db";
import { Notification } from "@/models/notification.model";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req:NextRequest){
    try{
        await connectDB();
        await Notification.updateMany({isRead:false},{$set:{isRead:true}});
        return NextResponse.json({message:"Successfully updated notifications as Read"},{status:200});
    }catch(error){
        console.error("Error marking messages as Read", error);
        return NextResponse.json({error:"Internal Server Error"},{status:500});
    }
}