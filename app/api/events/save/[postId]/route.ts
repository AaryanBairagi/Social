import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Post } from "@/models/post.model";

// 🔥 IMPORTANT: you must identify user (adjust if needed)
import { getAuth } from "@clerk/nextjs/server";
import { User } from "@/models/user.model";

export async function POST(
  req: NextRequest,
  context: { params: { postId: string } }
) {
  try {
    await connectDB();

    const { userId:clerkId } = getAuth(req); // Clerk userId
    const user = await User.findOne({ clerkId });

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const mongoUserId = user._id;
    const { postId } = await context.params;

    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // 🔥 TOGGLE LOGIC
    const alreadySaved = post.savedBy?.includes(mongoUserId);

    if (alreadySaved) {
      // ❌ remove (unsave)
      post.savedBy = post.savedBy?.filter(
        (id: any) => id.toString() !== mongoUserId?.toString()
      );
    } else {
      post.savedBy?.push(mongoUserId);
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