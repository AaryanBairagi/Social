import { Notification } from "@/models/notification.model";
import { NextResponse } from "next/server";

export const createNotification = async({userId,actorId,type,postId,commentId}:{userId:string,actorId:string,type:string,commentId?:string,postId?:string
}) => {
    try{

        if(userId===actorId) return;

        await Notification.create({
            user : userId,
            actor : actorId,
            type,
            post : postId,
            comment : commentId
        });

    }
    catch(error){
        console.error("Notification Creation Failed" , error);
        return NextResponse.json({message:"Internal Server Error"},{status:500});
    }
}