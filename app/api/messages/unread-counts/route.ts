import { connectDB } from "@/lib/db";
import { Message } from "@/models/chat.model";
import { User } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@/lib/auth/getAuth";


export async function GET(req:NextRequest) {
  try {
    await connectDB();

    const { userId } = await getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const unread = await Message.aggregate([
      {
        $match: {
          receiver: user._id,
          read: false,
        },
      },
      {
        $group: {
          _id: "$sender",
          count: { $sum: 1 },
        },
      },
    ]);

    const counts: Record<string, number> = {};

    unread.forEach((item) => {
      counts[item._id.toString()] = item.count;
    });

    return NextResponse.json(counts);
  } catch (error) {
    console.error("Unread count error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}