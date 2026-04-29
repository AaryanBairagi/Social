import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Post } from "@/models/post.model";
import { User } from "@/models/user.model";
import { getAuth } from "@clerk/nextjs/server";
import { Types } from "mongoose";
import { checkLimiter } from "@/lib/rate/checkLimiter";
import { createNotification } from "@/lib/notifications/notifications.service";

export async function GET(req: NextRequest, context: { params: Promise<{ postId: string }> }) {
  try {
    await connectDB();
    const params = await context.params;
    const postId = params.postId;

    const post = await Post.findById(postId)
      .populate("user", "firstName lastName profilePhoto userId")
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "firstName lastName profilePhoto userId",
        },
      });

    if (!post) return NextResponse.json({ message: "Post not found" }, { status: 404 });
    return NextResponse.json(post);
  } catch (error) {
    console.error("Error in GET post:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, context: { params: Promise<{ postId: string }> }) {
  try {
    await connectDB();

    const { userId: clerkUserId } = getAuth(req);
    if (!clerkUserId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const clerkUser = await User.findOne({ clerkId: clerkUserId });
    if (!clerkUser) return NextResponse.json({ message: "User not found" }, { status: 404 });

    checkLimiter(clerkUser._id.toString() , "LIKE" , {
      windowMs : 10 * 1000,
      max : 20
    })

    const params = await context.params;
    const postId = params.postId;

    const post = await Post.findById(postId);
    if (!post) return NextResponse.json({ message: "Post not found" }, { status: 404 });

    const userObjId = clerkUser._id;
    const hasLikedIndex = post.likes?.findIndex((id: Types.ObjectId) => id.equals(userObjId));

    let liked = false;
    if (hasLikedIndex === -1) {
      // Add like
      post.likes?.push(userObjId);
      liked = true;
    } else {
      // Remove like
      post.likes?.splice(hasLikedIndex, 1);
      liked = false;
    }

    if(liked && post.user.toString() !== clerkUser._id.toString()){
      await createNotification({
        userId : post.user.toString(),
        actorId : clerkUser._id.toString(),
        type:"LIKE",
        postId : post._id.toString()
      })
    }

    await post.save();

    return NextResponse.json({ likeCount: post.likes?.length, liked }, { status: 200 });
  } catch (error : any) {
    if(error.message.includes("Too many requests")){
      return NextResponse.json({error : "Please try again later."},{status : 429});
    }
    console.error("Error in POST like toggle:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
