import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Post } from "@/models/post.model";
import { Comment } from "@/models/comment.model";
import { User } from "@/models/user.model";
import { getAuth } from "@clerk/nextjs/server";

// GET Route to fetch posts with populated user data including comment authors
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // Fetch all posts with user info and comments including each comment's user info
    const posts = await Post.find()
      .populate("user", "firstName lastName profilePhoto userId")
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "firstName lastName userId",
        },
      });

    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}

// POST route to add a new comment to a given post
export async function POST(req: NextRequest, context: { params: Promise<{ postId: string }> }) {
  try {
    await connectDB();

    // Clerk authentication
    const { userId: clerkUserId } = getAuth(req);
    if (!clerkUserId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const clerkUser = await User.findOne({ clerkId: clerkUserId });
    if (!clerkUser) return NextResponse.json({ message: "User not found" }, { status: 404 });

    // Get postId from route params
    const params = await context.params;
    const postId = params.postId;
    if (!postId) return NextResponse.json({ message: "Invalid Post ID" }, { status: 400 });

    // Validate request body
    const body = await req.json();
    const { textMessage } = body;
    if (!textMessage || !textMessage.trim()) {
      return NextResponse.json({ message: "Comment text is required" }, { status: 400 });
    }

    // Find the post document
    const post = await Post.findById(postId);
    if (!post) return NextResponse.json({ message: "Post not found" }, { status: 404 });

    // Create and save the new comment
    const newComment = new Comment({ textMessage, user: clerkUser._id });
    await newComment.save();

    // Add comment reference to post and save
    post.comments = post.comments || [];
    post.comments.push(newComment._id);
    await post.save();

    // Populate new comment's user field for return
    const populatedComment = await Comment.findById(newComment._id).populate("user", "firstName lastName userId");

    return NextResponse.json(populatedComment, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}


// import { NextRequest, NextResponse } from "next/server";
// import { connectDB } from "@/lib/db";
// import { Post } from "@/models/post.model";
// import { Comment } from "@/models/comment.model";
// import { User } from "@/models/user.model";
// import { getAuth } from "@clerk/nextjs/server";

// export async function GET(req: NextRequest) {
//   try {
//     await connectDB();
//     const posts = await Post.find()
//       .populate("user", "firstName lastName profilePhoto userId")
//       .populate({
//         path: "comments",
//         populate: {
//           path: "user",
//           select: "firstName lastName userId",
//         },
//       });
//     return NextResponse.json(posts, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching posts:", error);
//     return NextResponse.json({ message: "Server Error" }, { status: 500 });
//   }
// }

// export async function POST(req: NextRequest, context: { params: Promise<{ postId: string }> }) {
//   try {
//     await connectDB();

//     const { userId: clerkUserId } = getAuth(req);
//     if (!clerkUserId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

//     const clerkUser = await User.findOne({ clerkId: clerkUserId });
//     if (!clerkUser) return NextResponse.json({ message: "User not found" }, { status: 404 });

//     const params = await context.params;
//     const postId = params.postId;
//     if (!postId) return NextResponse.json({ message: "Invalid Post ID" }, { status: 400 });

//     const body = await req.json();
//     const { textMessage } = body;
//     if (!textMessage?.trim()) {
//       return NextResponse.json({ message: "Comment text is required" }, { status: 400 });
//     }

//     const post = await Post.findById(postId);
//     if (!post) return NextResponse.json({ message: "Post not found" }, { status: 404 });

//     const newComment = new Comment({ textMessage, user: clerkUser._id });
//     await newComment.save();

//     post.comments = post.comments || [];
//     post.comments.push(newComment._id);
//     await post.save();

//     return NextResponse.json(newComment, { status: 201 });
//   } catch (error) {
//     console.error("Error creating comment:", error);
//     return NextResponse.json({ message: "Server Error" }, { status: 500 });
//   }
// }










// // import { NextRequest, NextResponse } from "next/server";
// // import { connectDB } from "@/lib/db";
// // import { Post } from "@/models/post.model";
// // import { Comment } from "@/models/comment.model";
// // import { User } from "@/models/user.model";
// // import { getAuth } from "@clerk/nextjs/server";

// // export async function POST(req: NextRequest, context: { params: Promise<{ postId: string }> }) {
// //   try {
// //     await connectDB();

// //     const { userId: clerkUserId } = getAuth(req);
// //     if (!clerkUserId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

// //     const clerkUser = await User.findOne({ clerkId: clerkUserId });
// //     if (!clerkUser) return NextResponse.json({ message: "User not found" }, { status: 404 });

// //     const params = await context.params;
// //     const postId = params.postId;
// //     if (!postId) return NextResponse.json({ message: "Invalid Post ID" }, { status: 400 });

// //     const body = await req.json();
// //     const { textMessage } = body;
// //     if (!textMessage?.trim()) {
// //       return NextResponse.json({ message: "Comment text is required" }, { status: 400 });
// //     }

// //     const post = await Post.findById(postId);
// //     if (!post) return NextResponse.json({ message: "Post not found" }, { status: 404 });

// //     // Create comment with userId string instead of _id ObjectId
// //     const newComment = new Comment({ textMessage, user: clerkUser._id });
// //     await newComment.save();

// //     post.comments = post.comments || [];
// //     post.comments.push(newComment._id);
// //     await post.save();

// //     return NextResponse.json(newComment, { status: 201 });
// //   } catch (error) {
// //     console.error("Error creating comment:", error);
// //     return NextResponse.json({ message: "Server Error" }, { status: 500 });
// //   }
// // }

