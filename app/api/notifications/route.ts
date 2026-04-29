import { connectDB } from "@/lib/db";
import { Notification } from "@/models/notification.model";
import { User } from "@/models/user.model";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import "@/models/post.model";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { userId: clerkId } = getAuth(req);
    if (!clerkId) {
      return NextResponse.json(
        { message: "Unauthorized User" },
        { status: 401 }
      );
    }

    const user = await User.findOne({ clerkId });
    if (!user) {
      return NextResponse.json(
        { message: "User Not Found!" },
        { status: 404 }
      );
    }

    const [notifications, unreadCount] = await Promise.all([
      Notification.find({ user: user._id })
        .populate("actor", "firstName lastName profilePhoto userId")
        .populate("post" , "_id")
        .sort({ createdAt: -1 })
        .limit(20),

      Notification.countDocuments({
        user: user._id,
        isRead: false,
      }),
    ]);

    const formattedNotifications = notifications.map((n) => ({
    ...n.toObject(),
    postId: n.post?._id || null, 
    }));

    return NextResponse.json({
      notifications : formattedNotifications,
      unreadCount,
    });
  } catch (error) {
    console.error("Error fetching Notifications:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await connectDB();

    const { userId: clerkId } = getAuth(req);
    if (!clerkId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ clerkId });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const { notificationId } = await req.json();

    const updated = await Notification.findOneAndUpdate(
      {
        _id: notificationId,
        user: user._id, // 🔥 SECURITY CHECK
      },
      { isRead: true },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { message: "Notification not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating notification:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}