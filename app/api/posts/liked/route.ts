import { connectDB } from "@/lib/db";
import { Post } from "@/models/post.model";
import { getAuth } from "@/lib/auth/getAuth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { userId } = await getAuth(req);

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const likedPosts = await Post.find({
      likes: userId,
      isArchived: false,
    })
      .sort({ createdAt: -1 })
      .populate("user", "firstName lastName username profilePhoto");

    return NextResponse.json(likedPosts);
  } catch (error) {
    console.error("Error fetching liked posts:", error);

    return NextResponse.json(
      { error: "Failed to fetch liked posts" },
      { status: 500 }
    );
  }
}