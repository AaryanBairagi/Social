"use client";

import { useEffect, useState } from "react";
import {
  MessageCircle,
  Image,
  Users,
  Network,
  Trophy,
  Calendar,
  FileText,
  Sparkles,
} from "lucide-react";

const features = [
  { icon: MessageCircle, text: "Encrypted real-time messaging" },
  { icon: Image, text: "Share stories & stay connected" },
  { icon: Users, text: "Create groups & collaborate" },
  { icon: Network, text: "Visualize your network" },
  { icon: Trophy, text: "Showcase your achievements" },
  { icon: Calendar, text: "Create & join events" },
  { icon: FileText, text: "Smart file sharing & previews" },
  { icon: Sparkles, text: "Engage with posts & discussions" },
];

export default function WhatsNewModal({ userId, createdAt }: any) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!userId || !createdAt) return;

    const createdTime = new Date(createdAt).getTime();
    const now = Date.now();

    const THREE_DAYS = 3 * 24 * 60 * 60 * 1000;

    const key = `whatsNewSeen_${userId}`;
    const seen = localStorage.getItem(key);
    
    console.log("createdAt:", createdAt);
    console.log("userId:", userId);

    if (now - createdTime <= THREE_DAYS && !seen) {
      setOpen(true);
      localStorage.setItem(key, "true");
    }
  }, [userId, createdAt]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-start pt-10 justify-center z-50">

      <div className="bg-white w-[400px] rounded-xl p-6 shadow-2xl">

        <h2 className="text-xl text-center font-bold text-gray-800 mb-4">
           Welcome to Social!
        </h2>

        <p className="text-sm text-gray-500 mb-4">
          Here's what you can do:
        </p>

        <div className="flex flex-col gap-3">
          {features.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="flex items-center gap-3">
                <Icon className="text-cyan-500 w-5 h-5" />
                <span className="text-sm text-gray-700">
                  {item.text}
                </span>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => setOpen(false)}
          className="mt-6 w-full bg-cyan-600 text-white py-2 rounded-lg hover:bg-cyan-700 transition"
        >
          Got it
        </button>
      </div>
    </div>
  );
}