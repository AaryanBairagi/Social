import { connectDB } from "@/lib/db";
import { User } from "@/models/user.model";
import { Post } from "@/models/post.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, context : { params: { userId: string } }) {
  await connectDB();
  try {
    // 1. Look up the user ObjectId using their userId string
    const params = await context.params;
    const user = await User.findOne({ userId: params.userId }).select("_id");
    if (!user) return NextResponse.json([], { status: 200 }); // No posts if user not found

    // 2. Then find their posts
    const posts = await Post.find({ user: user._id })
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();

    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error("Posts fetch error:", error);
    return NextResponse.json([], { status: 500 });
  }
}
