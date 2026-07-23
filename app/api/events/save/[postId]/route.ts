import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Post } from "@/models/post.model";
import { getAuth } from "@/lib/auth/getAuth";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ postId: string }> }
) {
  try {
    await connectDB();

    const { userId } = await getAuth(req);

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { postId } = await context.params;

    const post = await Post.findById(postId);

    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    const alreadySaved = post.savedBy?.some(
      (id: any) => id.toString() === userId
    );

    if (alreadySaved) {
      // Remove (unsave)
      post.savedBy = post.savedBy?.filter(
        (id: any) => id.toString() !== userId
      );
    } else {
      // Save
      post.savedBy?.push(userId);
    }

    await post.save();

    return NextResponse.json({
      success: true,
      saved: !alreadySaved,
    });

  } catch (error) {
    console.error("Save Event Error:", error);

    return NextResponse.json(
      { error: "Failed to save event" },
      { status: 500 }
    );
  }
}