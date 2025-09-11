import { connectDB } from "@/lib/db";
import { Connection } from "@/models/connection.model";
import { User } from "@/models/user.model";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req:NextRequest , context:{ params: Promise<{userId:string}> } ){
    try{
        await connectDB();
        const { userId: followerClerkId } = getAuth(req);
        if(!followerClerkId) return NextResponse.json({message:"Unauthorized User"},{status:401});

        const follower = await User.findOne({clerkId:followerClerkId});
        if(!follower) return NextResponse.json({message:"User Not Found"},{status:404});

        const params = await context.params;
        const followingUserId = params.userId;
        if(!followingUserId) return NextResponse.json({message:"Invalid User ID"},{status:400});

        //Cannot self follow
        if(follower._id.toString() === followingUserId) return NextResponse.json({message:"Cannot Follow Yourself"},{status:400});

        const existing = await Connection.findOne({
            follower: follower._id,
            following: followingUserId
        });
        
        if(existing) return NextResponse.json({message:"Already Followed"},{status:200});
        await Connection.create({follower:follower._id , following:followingUserId});

        return NextResponse.json({message:"Added to Following Successfully"},{status:201})

    }catch(error){
        console.error("Internal Server Error. Complete Error Message : ", error);
        return NextResponse.json({message:"Could not Foolow the User"} , {status:500});
    }
}