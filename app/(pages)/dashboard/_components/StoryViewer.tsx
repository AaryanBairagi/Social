"use client";

import { useEffect, useState } from "react";

export default function StoryViewer({ story, onClose }: any) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!story?._id) return;

    const viewed = JSON.parse(
      localStorage.getItem("viewedStories") || "{}"
    );

    viewed[story._id] = true;

    localStorage.setItem(
      "viewedStories",
      JSON.stringify(viewed)
    );
  }, [story]);

  useEffect(() => {
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);

          setTimeout(() => onClose(), 0);

          return 100;
        }

        return prev + 100 / 150;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [story, onClose]);

  return (
    <div className="fixed inset-0 flex items-start pt-35 justify-center z-40">

      <div className="relative w-[360px] max-h-[80vh] bg-black rounded-xl overflow-hidden shadow-xl flex items-center justify-center">

        <div className="absolute top-0 left-0 w-full h-1 bg-gray-600">
          <div
            className="h-full bg-white transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
          <img
            src={story.user?.profilePhoto || "/User-Prof.png"}
            className="w-8 h-8 rounded-full object-cover border border-white/30"
          />

          <div className="flex flex-col text-white">
            <span className="text-xs font-semibold">
              {story.user?.firstName}
            </span>

            <span className="text-xs">
              @{story.user?.username}
            </span>
          </div>
        </div>

        <div className="w-full h-full flex items-center justify-center">
          {story.fileType === "video" ? (
            <video
              src={story.mediaUrl}
              autoPlay
              muted
              playsInline
              loop={false}
              controls={false}
              className="max-w-full max-h-[80vh] object-contain"
            />
          ) : (
            <img
              src={story.mediaUrl}
              className="max-w-full max-h-[80vh] object-contain"
            />
          )}
        </div>

        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-5 h-5 flex items-center justify-center backdrop-blur-md text-white bg-cyan-600 hover:bg-cyan-800 rounded-full p-2"
        >
          ✕
        </button>

      </div>
    </div>
  );
}