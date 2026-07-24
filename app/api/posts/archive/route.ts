import { NextRequest } from "next/server";
import { Post } from "@/models/post.model";
import { connectDB } from "@/lib/db";
import { getAuth } from "@/lib/auth/getAuth";
import { validate } from "@/lib/validation";
import { ArchivePostSchema } from "@/lib/validators";

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

    const archivedPosts = await Post.find({
      user: userId,
      isArchived: true,
    })
      .sort({ createdAt: -1 })
      .populate("user", "firstName lastName username profilePhoto");

    return Response.json(archivedPosts);

  } catch (err) {
    console.error(err);
    return Response.json(
      { error: "Failed to fetch archived posts" },
      { status: 500 }
    );
  }
}


export async function PATCH(req: NextRequest) {
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

    const validated = validate(ArchivePostSchema , body);
    if(!validated.success){
      return validated.response;
    }

    const { postId, unarchive } = validated.data;

    if (!postId) {
      return Response.json(
        { error: "Missing postId" },
        { status: 400 }
      );
    }

    const post = await Post.findOne({
      _id: postId,
      user: userId,
    });

    if (!post) {
      return Response.json(
        { error: "Post not found or access denied" },
        { status: 404 }
      );
    }

    post.isArchived = !unarchive;
    await post.save();

    return Response.json(
      {
        success: true,
        post,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error updating archive status:", err);

    return Response.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}