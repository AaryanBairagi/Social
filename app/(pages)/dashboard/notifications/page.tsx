"use client";

import { useEffect, useState } from "react";
import NotificationGroup from "./_components/NotificationGroup";
import { groupNotifications } from "@/lib/groupNotification";
import { Bell } from "lucide-react";

export default function NotificationsPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/api/notifications")
      .then((res) => res.json())
      .then((res) => setData(res.notifications || res));
  }, []);

  const grouped = groupNotifications(data);

  return (
    <div className="mx-auto p-4">
        <div className="flex items-center justify-between px-6 py-4 bg-white/60 rounded-t-2xl shadow border-b border-gray-200 mb-4">
        <div className="flex w-full items-center gap-3">
        {/* Bell Icon (same style as posts SVG) */}
            <svg
            className="w-7 h-7 text-cyan-600"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            >
                <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 17h5l-1.405-1.405C18.79 14.79 18 13.42 18 12V9a6 6 0 10-12 0v3c0 1.42-.79 2.79-1.595 3.595L3 17h5m7 0a3 3 0 11-6 0"
                />
            </svg>

            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
                Notifications
            </h1>
        </div>
        </div>
      <NotificationGroup title="Today" items={grouped.today} />
      <NotificationGroup title="Yesterday" items={grouped.yesterday} />
      <NotificationGroup title="Earlier" items={grouped.earlier} />
    </div>
  );
}