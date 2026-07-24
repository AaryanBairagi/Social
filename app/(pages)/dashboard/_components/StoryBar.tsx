"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import AddStory from "./AddStory";
import StoryViewer from "./StoryViewer";

export default function StoryBar({ userId }: any) {
  const [stories, setStories] = useState<any[]>([]);
  const [selectedStory, setSelectedStory] = useState<any>(null);

  // Store viewed stories in state
  const [viewedStories, setViewedStories] = useState<Record<string, boolean>>(
    {}
  );

  // Load viewed stories once
  useEffect(() => {
    const viewed = JSON.parse(
      localStorage.getItem("viewedStories") || "{}"
    );

    setViewedStories(viewed);
  }, []);

  const fetchStories = async () => {
    try {
      const res = await axios.get(`/api/stories?mongoId=${userId}`);

      let data = res.data;

      // Current user first
      data = data.sort((a: any, b: any) =>
        a.user._id === userId ? -1 : b.user._id === userId ? 1 : 0
      );

      setStories(data);
    } catch (err) {
      console.error("Failed to fetch stories", err);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchStories();
    }
  }, [userId]);

  return (
    <>
      <div className="flex gap-4 overflow-x-auto p-4">

        <AddStory
          userId={userId}
          onUpload={fetchStories}
        />

        {stories.map((story) => (
          <div
            key={story._id}
            onClick={() => setSelectedStory(story)}
            className="flex flex-col items-center cursor-pointer"
          >
            <img
              src={story.user.profilePhoto || "/User-Prof.png"}
              className={`w-16 h-16 rounded-full border-3 ${
                viewedStories[story._id]
                  ? "border-gray-600"
                  : "border-pink-700"
              }`}
            />

            <span className="text-xs mt-1 text-gray-600 hover:text-gray-700">
              {story.user.username}
            </span>
          </div>
        ))}
      </div>

      {selectedStory && (
        <StoryViewer
          story={selectedStory}
          onClose={() => {
            setSelectedStory(null);

            // Reload viewed stories after viewer updates localStorage
            const viewed = JSON.parse(
              localStorage.getItem("viewedStories") || "{}"
            );

            setViewedStories(viewed);
          }}
        />
      )}
    </>
  );
}