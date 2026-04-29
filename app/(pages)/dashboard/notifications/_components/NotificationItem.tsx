"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function NotificationItem({ notification }: any) {
  const { actor, type, isRead, createdAt } = notification;
  const router = useRouter();

  const getMessage = () => {
    switch (type) {
      case "FOLLOW_REQUEST":
        return "sent you a connection request";
      case "FOLLOW_ACCEPT":
        return "accepted your request";
      case "LIKE":
        return "liked your post";
      case "COMMENT":
        return "commented on your post";
      default:
        return "";
    }
  };

  return (
    <div
    onClick={async () => {
    //  mark THIS notification as read
    await fetch("/api/notifications", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ notificationId: notification._id }),
    });

    //  navigation logic
    if (type === "FOLLOW_REQUEST" || type === "FOLLOW_ACCEPT") {
      router.push(`/dashboard/profile/${actor.userId}`);
    } else {
      router.push(`/dashboard/posts/${notification.postId}`);
    }
    }}
      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition ${
        !isRead ? "bg-blue-50" : "hover:bg-gray-100"
      }`}
    >
      <Image
        src={actor.profilePhoto}
        alt="avatar"
        width={40}
        height={40}
        className="rounded-full"
      />

      <div className="flex flex-col">
        <p className="text-sm">
          <span className="font-semibold">
            {actor.firstName} {actor.lastName}
          </span>{" "}
          {getMessage()}
        </p>

        <span className="text-xs text-gray-500">
          {new Date(createdAt).toLocaleString()}
        </span>
      </div>
    </div>
  );
}