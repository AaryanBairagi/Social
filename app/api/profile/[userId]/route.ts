import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/user.model";
import { Post } from "@/models/post.model";
import { Connection } from "@/models/connection.model";
import { getAuth } from "@/lib/auth/getAuth";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    await connectDB();

    const { userId } = await context.params;

    const profileUser = await User.findOne({ username: userId })
      .select("firstName lastName username profilePhoto bio interests")
      .lean();

    if (!profileUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const profileMongoUser = await User.findOne({ username: userId })
      .select("_id")
      .lean();

    if (!profileMongoUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
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

    const { userId: currentUserId } = await getAuth(req);

    let isFollowing = false;
    let isRequestPending = false;
    let isRequestSent = false;

    if (currentUserId) {
      const [outgoingEdge, incomingEdge] = await Promise.all([
        Connection.findOne({
          type: "connection",
          fromUser: currentUserId,
          toUser: profileMongoUser._id,
        }).lean(),

        Connection.findOne({
          type: "connection",
          fromUser: profileMongoUser._id,
          toUser: currentUserId,
        }).lean(),
      ]);

      isFollowing = outgoingEdge?.status === "accepted";
      isRequestSent = outgoingEdge?.status === "pending";
      isRequestPending = incomingEdge?.status === "pending";
    }

    let recentPosts : (any[]) = [];

    if (isFollowing) {
      recentPosts = await Post.find({
        user: profileMongoUser._id,
      })
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
    console.error(
      "Error fetching profile user by userId:",
      error
    );

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}