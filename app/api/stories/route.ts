import { connectDB } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { Story } from "@/models/story.model";
import { User } from "@/models/user.model";
import { Connection } from "@/models/connection.model";
import { checkLimiter } from "@/lib/rate/checkLimiter";
import { RATE_LIMITS } from "@/lib/rate/constants";

// GET STORIES
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const mongoId = url.searchParams.get("mongoId");

    if (!mongoId) {
      return NextResponse.json({ error: "UserID is Required" }, { status: 400 });
    }

    await connectDB();

    const user = await User.findById(mongoId).select("_id");
    if (!user) {
      return NextResponse.json({ error: "User Not Found" }, { status: 404 });
    }

    const followingEdges = await Connection.find({
      type: "connection",
      fromUser: user._id,
      status: "accepted",
    })
      .select("toUser")
      .lean();

    const followingUserIds = followingEdges.map((edge) =>
      edge.toUser.toString()
    );

    const storyUserIds = [mongoId, ...followingUserIds];

    const stories = await Story.find({
      user: { $in: storyUserIds },
      expiresAt: { $gt: new Date() },
    })
      .populate("user", "firstName lastName username profilePhoto")
      .sort({ createdAt: -1 });

    return NextResponse.json(stories);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// CREATE STORY
export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const body = await req.json();
    const { user, mediaUrl, fileType } = body;

    if (!user || !mediaUrl) {
      return NextResponse.json(
        { error: "User and mediaUrl required" },
        { status: 400 }
      );
    }

    checkLimiter(user, "STORY", RATE_LIMITS.POST);

    // Only one story per user
    await Story.deleteOne({ user });

    const story = new Story({
      user,
      mediaUrl,
      fileType: fileType || "image",
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    await story.save();

    return NextResponse.json(story, { status: 201 });
  } catch (error: any) {
    if (error.message.includes("Too many requests")) {
      return NextResponse.json(
        { error: "Rate Limit Exceeded" },
        { status: 429 }
      );
    }

    console.error("Story Error:", error);
    return NextResponse.json(
      { error: "Failed to create story" },
      { status: 500 }
    );
  }
}