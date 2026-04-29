import { NextRequest } from "next/server";
import { Post } from "@/models/post.model";
import mongoose from "mongoose";

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

    const userObjectId = new mongoose.Types.ObjectId(userId);

    const alreadySaved = post?.savedPostsBy?.some(
      (id: mongoose.Types.ObjectId) => id.equals(userObjectId)
    );

    if (alreadySaved) {
      //UNSAVE
      post.savedPostsBy = post?.savedPostsBy?.filter(
        (id: mongoose.Types.ObjectId) => !id.equals(userObjectId)
      );
    } else {
      //SAVE
      post?.savedPostsBy?.push(userObjectId);
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