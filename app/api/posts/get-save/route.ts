import { NextRequest } from "next/server";
import { Post } from "@/models/post.model";
import mongoose from "mongoose";
import { User } from "@/models/user.model";

export async function GET(req: NextRequest) {
  try {
    const searchParams = new URL(req.url).searchParams;
    const clerkId = searchParams.get("userId");

    if (!clerkId) {
      return Response.json({ error: "Missing userId" }, { status: 400 });
    }

    const user = await User.findOne({ clerkId });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const savedPosts = await Post.find({
      savedPostsBy: user._id,
    })
      .sort({ createdAt: -1 })
      .populate("user", "firstName lastName userId profilePhoto");

    return Response.json(savedPosts);

  } catch (err) {
    console.error(err);
    return Response.json(
      { error: "Failed to fetch saved posts" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { postId, userId } = await req.json();

    if (!postId || !userId) {
      return Response.json({ error: "Missing data" }, { status: 400 });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return Response.json({ error: "Post not found" }, { status: 404 });
    }


  const user = await User.findOne({ clerkId: userId });

  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

    const userObjectId = user._id as  mongoose.Types.ObjectId;

    const alreadySaved = post?.savedPostsBy?.some(
      (id: mongoose.Types.ObjectId) => id.equals(userObjectId)
    );

    if (alreadySaved) {
      post.savedPostsBy = (post.savedPostsBy || []).filter(
      (id: mongoose.Types.ObjectId) => !id.equals(userObjectId)
      );
    } else {
      post.savedPostsBy = [...(post.savedPostsBy || []), userObjectId];
    }

    await post.save();

    return Response.json({
      success: true,
      saved: !alreadySaved,
    });

  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}