import { NextRequest } from "next/server";
import { Post } from "@/models/post.model";
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

    const archivedPosts = await Post.find({
      user: user._id,
      isArchived: true,
    })
      .sort({ createdAt: -1 })
      .populate("user", "firstName lastName userId profilePhoto");

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
    const { postId , unarchive } = await req.json();

    if (!postId) {
      return Response.json({ error: "Missing postId" }, { status: 400 });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return Response.json({ error: "Post not found" }, { status: 404 });
    }

    post.isArchived = unarchive ? false : true;
    await post.save();

    return Response.json({ success: true });

  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}