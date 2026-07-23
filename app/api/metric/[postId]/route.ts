import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Post } from "@/models/post.model";
import { getAuth } from "@/lib/auth/getAuth";
import { Types } from "mongoose";
import { checkLimiter } from "@/lib/rate/checkLimiter";
import { createNotification } from "@/lib/notifications/notifications.service";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ postId: string }> }
) {
  try {
    await connectDB();

    const params = await context.params;
    const postId = params.postId;

    const post = await Post.findById(postId)
      .populate("user", "firstName lastName profilePhoto username")
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "firstName lastName profilePhoto username",
        },
      });

    if (!post) {
      return NextResponse.json(
        { message: "Post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error in GET post:", error);

    return NextResponse.json(
      { message: "Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ postId: string }> }
) {
  try {
    await connectDB();

    const { userId } = await getAuth(req);

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    checkLimiter(userId, "LIKE", {
      windowMs: 10 * 1000,
      max: 20,
    });

    const params = await context.params;
    const postId = params.postId;

    const post = await Post.findById(postId);

    if (!post) {
      return NextResponse.json(
        { message: "Post not found" },
        { status: 404 }
      );
    }

    const hasLikedIndex = post.likes!.findIndex(
      (id: Types.ObjectId) => id.toString() === userId
    );

    let liked = false;

    if (hasLikedIndex === -1) {
      // Add like
      post.likes?.push(new Types.ObjectId(userId));
      liked = true;
    } else {
      // Remove like
      post.likes?.splice(hasLikedIndex, 1);
      liked = false;
    }

    if (liked && post.user.toString() !== userId) {
      await createNotification({
        userId: post.user.toString(),
        actorId: userId,
        type: "LIKE",
        postId: post._id.toString(),
      });
    }

    await post.save();

    return NextResponse.json(
      {
        likeCount: post.likes?.length,
        liked,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    if (error.message?.includes("Too many requests")) {
      return NextResponse.json(
        { error: "Please try again later." },
        { status: 429 }
      );
    }

    console.error("Error in POST like toggle:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}