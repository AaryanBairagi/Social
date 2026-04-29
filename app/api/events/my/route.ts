import { connectDB } from "@/lib/db";
import { Post } from "@/models/post.model";
import { User } from "@/models/user.model";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest){
    try{
        await connectDB();

        const { userId: clerkId } = getAuth(req);

        const user = await User.findOne({ clerkId });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const mongoUserId = user._id;

        const events = await Post.find({
          type: "event",
          savedBy: mongoUserId,
        })
        .populate("user", "firstName lastName userId")
        .sort({ eventDate: 1 });

    return NextResponse.json(events);

    }catch(error){
        console.log(error);
        return NextResponse.json({error : "Internal Server Error"},{status:500});
    }
}