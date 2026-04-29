import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/user.model";
import { Post } from "@/models/post.model";
import { Connection } from "@/models/connection.model";
import { getAuth } from "@clerk/nextjs/server";

export async function GET(
  req: NextRequest,
  context: { params: { userId: string } }
) {
  try {
    await connectDB();

    const { userId } = await context.params;

    const profileUser = await User.findOne({ userId })
      .select("firstName lastName userId profilePhoto bio interests clerkId")
      .lean();

    if (!profileUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const profileMongoUser = await User.findOne({ userId }).select("_id").lean();
    if (!profileMongoUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const [followersCount, followingCount] = await Promise.all([
      Connection.countDocuments({
        type: "connection",
        status: "accepted",
        toUser: profileMongoUser._id,
      }),
      Connection.countDocuments({
        type: "connection",
        fromUser: profileMongoUser._id,
        status: { $in: ["pending", "accepted"] },
      }),
    ]);

    const { userId: currentClerkId } = getAuth(req);

    let isFollowing = false;
    let isRequestPending = false;
    let isRequestSent = false;

    if (currentClerkId) {
      const currentMongoUser = await User.findOne({ clerkId: currentClerkId })
        .select("_id")
        .lean();

      if (currentMongoUser) {
        const [outgoingEdge, incomingEdge] = await Promise.all([
          Connection.findOne({
            type: "connection",
            fromUser: currentMongoUser._id,
            toUser: profileMongoUser._id,
          }).lean(),
          Connection.findOne({
            type: "connection",
            fromUser: profileMongoUser._id,
            toUser: currentMongoUser._id,
          }).lean(),
        ]);

        isFollowing = outgoingEdge?.status === "accepted";
        isRequestSent = outgoingEdge?.status === "pending";
        isRequestPending = incomingEdge?.status === "pending";
      }
    }

    let recentPosts = [];
    if (isFollowing) {
      recentPosts = await Post.find({ user: profileMongoUser._id })
        .sort({ createdAt: -1 })
        .limit(3)
        .lean();
    }

    return NextResponse.json(
      {
        ...profileUser,
        mongoId: profileMongoUser._id.toString(),
        followersCount,
        followingCount,
        isFollowing,
        isRequestPending,
        isRequestSent,
        recentPosts,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching profile user by userId:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}







// import { NextResponse } from "next/server";
// import { connectDB, getUserIdMongo } from "@/lib/db";
// import { User } from "@/models/user.model";
// import { Post } from "@/models/post.model";

// // Assumes getUserIdMongo(req) returns the current user's Mongo ObjectId as a string
// export async function GET(req: Request, context: { params: { userId: string } }) {
//   try {
//     await connectDB();

//     const { userId } = await context.params;
//     const user = await User.findOne({ userId }).select(
//       "firstName lastName userId profilePhoto bio interests clerkId connections sentRequests receivedRequests"
//     ).lean();

//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     // Get current logged-in user's Mongo _id from session or JWT
//     const currentUserMongoId = await getUserIdMongo(req); // <---- The logged-in user's Mongo ObjectId as string

//     // connections is array of ObjectIds. Convert all to string for comparison.
//     const connections = (user.connections || []).map(id => id.toString());

//     // Is the logged-in user following this profile user?
//     const isFollowing = currentUserMongoId ? connections.includes(currentUserMongoId.toString()) : false;

//     // For completeness, you can prepare sent/received requests too if you need:
//     const sentRequests = (user.sentRequests || []).map(id => id.toString());
//     const receivedRequests = (user.receivedRequests || []).map(id => id.toString());

//     // Fetch posts only if followed
//     let recentPosts = [];
//     if (isFollowing) {
//       recentPosts = await Post.find({ user: user._id })
//         .sort({ createdAt: -1 })
//         .limit(3)
//         .lean();
//     }

//     return NextResponse.json({
//       ...user,
//       isFollowing,
//       recentPosts
//     }, { status: 200 });

//   } catch (error) {
//     console.error("Error fetching profile user by userId:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }

