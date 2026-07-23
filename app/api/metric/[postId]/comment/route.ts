import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Post } from "@/models/post.model";
import { Comment } from "@/models/comment.model";
import { checkLimiter } from "@/lib/rate/checkLimiter";
import { RATE_LIMITS } from "@/lib/rate/constants";
import { createNotification } from "@/lib/notifications/notifications.service";
import mongoose from "mongoose";
import { getAuth } from "@/lib/auth/getAuth";

export async function GET(req: NextRequest, context: { params: Promise<{ postId: string }> }) {
  try {
    await connectDB();

    const params = await context.params;
    const postId = params.postId;

    const post = await Post.findById(postId).populate({
      path: "comments",
      populate: {
        path: "user",
        select: "firstName lastName username",
      },
    });

    if (!post) return NextResponse.json([], { status: 200 });
    return NextResponse.json(post.comments, { status: 200 });
  } catch (error) {
    console.error("Error in GET comments:", error);
    return NextResponse.json([], { status: 500 });
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

    checkLimiter(userId, "COMMENT", RATE_LIMITS.COMMENT);

    const params = await context.params;
    const postId = params.postId;

    const { textMessage } = await req.json();

    if (!textMessage || !textMessage.trim()) {
      return NextResponse.json(
        { message: "Comment text is required" },
        { status: 400 }
      );
    }

    const post = await Post.findById(postId);

    if (!post) {
      return NextResponse.json(
        { message: "Post not found" },
        { status: 404 }
      );
    }

    const newComment = new Comment({
      textMessage,
      user: userId,
    });

    await newComment.save();

    post.comments = post.comments || [];
    post.comments.push(newComment._id as mongoose.Types.ObjectId);

    await post.save();

    const populatedComment = await Comment.findById(
      newComment._id
    ).populate(
      "user",
      "firstName lastName username"
    );

    await createNotification({
      userId: post.user.toString(),
      actorId: userId,
      type: "COMMENT",
      postId: post._id.toString(),
      commentId: newComment._id.toString(),
    });

    return NextResponse.json(
      populatedComment,
      { status: 201 }
    );

  } catch (error) {
    console.error(
      "Error in POST comment:",
      error
    );

    return NextResponse.json(
      { message: "Server Error" },
      { status: 500 }
    );
  }
}