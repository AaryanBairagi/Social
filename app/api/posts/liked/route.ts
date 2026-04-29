import { connectDB } from "@/lib/db";
import { Post } from "@/models/post.model";
import { User } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const searchParams = new URL(req.url).searchParams;
    const clerkId = searchParams.get("userId");

    if (!clerkId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const user = await User.findOne({ clerkId });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const likedPosts = await Post.find({
      likes: user._id,
      isArchived: false,
    })
      .sort({ createdAt: -1 })
      .populate("user", "firstName lastName userId profilePhoto");

    return NextResponse.json(likedPosts);

  } catch (error) {
    console.error("Error fetching liked posts:", error);
    return NextResponse.json({ error: "Failed to fetch liked posts" }, { status: 500 });
  }
}