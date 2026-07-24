import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuth } from "@/lib/auth/getAuth";
import { Post } from "@/models/post.model";
import mongoose from "mongoose";
import { validate } from "@/lib/validation";
import { SavePostSchema } from "@/lib/validators";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { userId } = await getAuth(req);

    if (!userId) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const savedPosts = await Post.find({
      savedPostsBy: userId,
    })
      .sort({ createdAt: -1 })
      .populate("user", "firstName lastName username profilePhoto");

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
    await connectDB();

    const { userId } = await getAuth(req);

    if (!userId) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    
    const validated = validate(SavePostSchema,body);
    if(!validated.success) return validated.response;

    const { postId } = validated.data;

    if (!postId) {
      return Response.json(
        { error: "Missing postId" },
        { status: 400 }
      );
    }

    const post = await Post.findById(postId);

    if (!post) {
      return Response.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    const alreadySaved = post.savedPostsBy?.some(
      (id: mongoose.Types.ObjectId) => id.equals(userObjectId)
    );

    if (alreadySaved) {
      post.savedPostsBy = (post.savedPostsBy || []).filter(
        (id: mongoose.Types.ObjectId) => !id.equals(userObjectId)
      );
    } else {
      post.savedPostsBy = [
        ...(post.savedPostsBy || []),
        userObjectId,
      ];
    }

    await post.save();

    return Response.json({
      success: true,
      saved: !alreadySaved,
    });
  } catch (err) {
    console.error(err);

    return Response.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}