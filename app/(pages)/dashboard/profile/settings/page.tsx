"use client";

import { useRouter } from "next/navigation";
import {
  Activity,
  Bookmark,
  Archive,
  Clock,
  Shield,
  ChevronRight,
} from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();

  const options = [
    {
      label: "Your Activity",
      icon: Activity,
      desc: "See your posts, likes, and interactions",
      route: "your-activity",
    },
    {
      label: "Saved Posts",
      icon: Bookmark,
      desc: "View posts you’ve bookmarked",
      route: "saved",
    },
    {
      label: "Archive",
      icon: Archive,
      desc: "Hidden or archived content",
      route: "archive",
    },
    {
      label: "Time Management",
      icon: Clock,
      desc: "Track your app usage",
      route: "time-management",
    },
    {
      label: "Security",
      icon: Shield,
      desc: "Manage password & account safety",
      route: "security",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-white flex items-center justify-center px-4">
      
      <div className="w-full max-w-md">
        
        {/* Title */}
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Settings
        </h1>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {options.map((opt, i) => {
            const Icon = opt.icon;

            return (
              <div
                key={i}
                onClick={() => router.push(`/dashboard/profile/settings/${opt.route}`)}
                className="flex items-center justify-between p-4 cursor-pointer group transition hover:bg-cyan-50"
              >
                {/* Left */}
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-xl bg-cyan-100 text-cyan-700 group-hover:scale-110 transition">
                    <Icon size={18} />
                  </div>

                  <div>
                    <p className="font-semibold text-gray-800">
                      {opt.label}
                    </p>
                    <p className="text-sm text-gray-500">
                      {opt.desc}
                    </p>
                  </div>
                </div>

                {/* Right Arrow */}
                <ChevronRight className="text-gray-400 group-hover:translate-x-1 transition" />
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}