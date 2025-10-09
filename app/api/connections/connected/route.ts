import { connectDB } from "@/lib/db";
import { User } from "@/models/user.model";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { userId } = getAuth(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const currentUser = await User.findOne({ clerkId: userId }).select("connections");
    if (!currentUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Find all users in current user's connections
    const connectedUsers = await User.find({
      _id: { $in: currentUser.connections },
    }).select("firstName lastName userId profilePhoto");

    // Convert to plain objects
    return NextResponse.json(
      connectedUsers.map(user => ({
        _id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        userId: user.userId,
        profilePhoto: user.profilePhoto,
      })),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching connected users:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
