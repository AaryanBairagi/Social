import { connectDB } from "@/lib/db";
import { Message } from "@/models/chat.model";
import { User } from "@/models/user.model";
import { getAuth } from "@/lib/auth/getAuth";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function PATCH(
  req: NextRequest,
  context: { params: { targetId: string } }
) {
  try {
    await connectDB();

    const { userId } = await getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const params = await context.params;
    const targetId = params.targetId;

    if (!mongoose.Types.ObjectId.isValid(targetId)) {
      return NextResponse.json({ error: "Invalid targetId" }, { status: 400 });
    }

    const targetObjectId = new mongoose.Types.ObjectId(targetId);

    await Message.updateMany(
      {
        sender: targetObjectId,
        receiver: currentUser._id,
        read: false,
      },
      {
        $set: { read: true },
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Mark read error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}