import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/user.model";
import { Connection } from "@/models/connection.model";
import { getAuth } from "@/lib/auth/getAuth";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    await connectDB();

    const { userId: profileUserId } = await context.params;

    const user = await User.findOne({ username: profileUserId })
      .select("firstName lastName username profilePhoto bio interests")
      .lean();

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const targetMongoUser = await User.findOne({ username: profileUserId })
      .select("_id")
      .lean();

    if (!targetMongoUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const [followersCount, followingCount] = await Promise.all([
      Connection.countDocuments({
        type: "connection",
        status: "accepted",
        toUser: targetMongoUser._id,
      }),

      Connection.countDocuments({
        type: "connection",
        fromUser: targetMongoUser._id,
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
          toUser: targetMongoUser._id,
        }).lean(),

        Connection.findOne({
          type: "connection",
          fromUser: targetMongoUser._id,
          toUser: currentUserId,
        }).lean(),
      ]);

      isFollowing = outgoingEdge?.status === "accepted";
      isRequestSent = outgoingEdge?.status === "pending";
      isRequestPending = incomingEdge?.status === "pending";
    }

    return NextResponse.json(
      {
        ...user,
        mongoId: targetMongoUser._id.toString(),
        followersCount,
        followingCount,
        isFollowing,
        isRequestPending,
        isRequestSent,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user by userId:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}