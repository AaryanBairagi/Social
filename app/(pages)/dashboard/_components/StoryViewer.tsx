"use client";

import { useEffect, useState } from "react";

export default function StoryViewer({ story, onClose }: any) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
  if (!story?._id) return;

  const viewed = JSON.parse(localStorage.getItem("viewedStories") || "{}");

  viewed[story._id] = true;

  localStorage.setItem("viewedStories", JSON.stringify(viewed));
}, [story]);

  useEffect(() => {

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => onClose(), 0);
          return 100;
        }
        return prev + (100 / 150);
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0  flex items-start pt-15 justify-center z-50">

      {/* STORY CONTAINER */}
      <div className="relative w-[360px] max-h-[80vh] bg-black rounded-xl overflow-hidden shadow-xl flex items-center justify-center">

        {/* PROGRESS BAR */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gray-600">
          <div
            className="h-full bg-white transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* USER HEADER */}
        <div className="absolute top-3 left-3 flex items-center gap-2 z-10">

        {/* PROFILE */}
        <img
          src={story.user?.profilePhoto}
          className="w-8 h-8 rounded-full object-cover border border-white/30"
        />

        {/* NAME */}
          <div className="flex flex-col text-white hover:text-white/90 cursor-pointer">
            <span className="text-xs font-semibold leading-none">
              {story.user?.firstName}
            </span>

            <span className="text-xs font-medium text-white hover:text-white/90 cursor-pointer">
              @{story.user?.userId}
            </span>
          </div>

        </div>

        {/* IMAGE WRAPPER */}
        <div className="w-full h-full flex items-center justify-center">
          <img
            src={story.mediaUrl}
            className="max-w-full max-h-[80vh] object-contain"
          />
        </div>

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-5 h-5 flex items-center justify-center backdrop-blur-md text-white bg-cyan-600 hover:bg-cyan-800 rounded-full p-2 text-md transition duration-20"
        >
          ✕
        </button>
      </div>
    </div>
  );
}