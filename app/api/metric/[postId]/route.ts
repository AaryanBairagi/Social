import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Post } from "@/models/post.model";
import { User } from "@/models/user.model";
import { getAuth } from "@clerk/nextjs/server";
import { Types } from "mongoose";

export async function GET(req: NextRequest, { params }: { params: { postId: string } }) {
  await connectDB();

  const post = await Post.findById(params.postId)
    .populate("user", "firstName lastName profilePhoto userId")
    .populate({
      path: "comments",
      populate: {
        path: "user",
        select: "firstName lastName profilePhoto userId",
      },
    });

  if (!post) return NextResponse.json({ message: "Post not found" }, { status: 404 });

  return NextResponse.json(post);
}

// export async function POST(req: NextRequest, { params }: { params: { postId: string } }) {
  export async function POST(req: NextRequest, context: { params: Promise<{ postId: string }> }) {
  await connectDB();

  // Authenticate user
  const { userId: clerkUserId } = getAuth(req);
  if (!clerkUserId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  console.log(clerkUserId);
  // Find user by clerkId to get userId (string)
  const clerkUser = await User.findOne({ clerkId: clerkUserId });
  if (!clerkUser || !clerkUser.userId) return NextResponse.json({ message: "User not found" }, { status: 404 });
  console.log(clerkUser);

  const params = await context.params;
  const postId = params.postId;
  const post = await Post.findById(postId);
  console.log(postId);
  if (!post) return NextResponse.json({ message: "Post not found" }, { status: 404 });

  post.likes = post.likes || [];
  const userObjId = clerkUser._id;

  const hasLikedIndex = post.likes.findIndex((id: Types.ObjectId) => id.equals(userObjId));
  
  let liked = false;

  if (hasLikedIndex === -1) {
    // User hasn't liked yet, add like
    post.likes.push(userObjId);
    liked = true;
  } else {
    // User already liked, remove the like instead (toggle)
    post.likes.splice(hasLikedIndex,1);
    liked=false;
  }

  await post.save();

  return NextResponse.json({ likeCount: post.likes.length, liked }, { status: 200 });
}


// export async function PUT(req: NextRequest, { params }: { params: { postId: string } }) {
//   await connectDB();

//   // TODO: Add user authorization

//   const body = await req.json();

//   const updated = await Post.findByIdAndUpdate(params.postId, body, { new: true });

//   if (!updated) return NextResponse.json({ message: "Post not found" }, { status: 404 });

//   return NextResponse.json(updated);
// }

// export async function DELETE(req: NextRequest, { params }: { params: { postId: string } }) {
//   await connectDB();

//   const deleted = await Post.findByIdAndDelete(params.postId);

//   if (!deleted) return NextResponse.json({ message: "Post not found" }, { status: 404 });

//   return new Response(null, { status: 204 });
// }