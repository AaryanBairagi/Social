import { connectDB } from "@/lib/db";
import { Notification } from "@/models/notification.model";
import { User } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import "@/models/post.model";
import { getAuth } from "@/lib/auth/getAuth";
import { validate } from "@/lib/validation";
import { MarkNotificationSchema } from "@/lib/validators/notification";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { userId } = await getAuth(req);
    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized User" },
        { status: 401 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { message: "User Not Found!" },
        { status: 404 }
      );
    }

    const [notifications, unreadCount] = await Promise.all([
      Notification.find({ user: userId })
        .populate("actor", "firstName lastName profilePhoto username")
        .populate("post" , "_id")
        .sort({ createdAt: -1 })
        .limit(20),

      Notification.countDocuments({
        user: userId,
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

    const { userId} = await getAuth(req);
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const body = await req.json();

    const validated = validate(MarkNotificationSchema , body);
    if(!validated.success){
      return validated.response;
    }

    const { notificationId } = validated.data;
    const updated = await Notification.findOneAndUpdate(
      {
        _id: notificationId,
        user: userId, // SECURITY CHECK
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