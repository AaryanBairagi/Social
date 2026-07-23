

"use client";
import React, { useEffect, useState } from "react";

export function UserProfileCard({
  profilePhoto,
  username,
  mongoId,
  firstName,
  lastName,
  bio,
  interests,
  followersCount,
  followingCount,
  isFollowedByUser = false,
  hasSentRequest = false,
  hasReceivedRequest = false,
  showActions,
  onFollowChange,
}: {
  profilePhoto?: string;
  username: string;
  mongoId: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  interests?: string[];
  followersCount: number;
  followingCount: number;
  isFollowedByUser?: boolean;
  hasSentRequest?: boolean;
  hasReceivedRequest?: boolean;
  showActions?: boolean;
  onFollowChange?: (type: "follow" | "unfollow" | "accept") => void;
}) {
  const [followState, setFollowState] = useState({
    isFollowedByUser,
    hasSentRequest,
    hasReceivedRequest,
  });

  useEffect(() => {
    setFollowState({
      isFollowedByUser,
      hasSentRequest,
      hasReceivedRequest,
    });
  }, [isFollowedByUser, hasSentRequest, hasReceivedRequest]);

  const handleFollow = async () => {
    try {
      const res = await fetch(`/api/connections/${mongoId}/follow`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId: mongoId }),
      });

      if (!res.ok) throw new Error("Failed to send follow request");

      setFollowState((prev) => ({
        ...prev,
        hasSentRequest: true,
        hasReceivedRequest: false,
      }));

      onFollowChange?.("follow");
    } catch (err) {
      console.error("Follow error:", err);
    }
  };

  const handleUnfollow = async () => {
    try {
      const res = await fetch(`/api/connections/${mongoId}/unfollow`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId: mongoId }),
      });

      if (!res.ok) throw new Error("Failed to unfollow");

      setFollowState({
        isFollowedByUser: false,
        hasSentRequest: false,
        hasReceivedRequest: false,
      });

      onFollowChange?.("unfollow");
    } catch (err) {
      console.error("Unfollow error:", err);
    }
  };

  const handleAccept = async () => {
    try {
      const res = await fetch(`/api/connections/${mongoId}/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId: mongoId }),
      });

      if (!res.ok) throw new Error("Failed to accept request");

      setFollowState((prev) => ({
        ...prev,
        hasReceivedRequest: false,
      }));

      onFollowChange?.("accept");
    } catch (err) {
      console.error("Accept error:", err);
    }
  };

  const renderButton = () => {
    if (followState.hasReceivedRequest) {
      return (
        <button
          onClick={handleAccept}
          className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg shadow-md transition-all"
        >
          Accept
        </button>
      );
    } else if (followState.hasSentRequest) {
      return (
        <button
          disabled
          className="bg-gray-400 text-white px-5 py-2 rounded-lg shadow-md cursor-not-allowed"
        >
          Requested
        </button>
      );
    } else if (followState.isFollowedByUser) {
      return (
        <button
          onClick={handleUnfollow}
          className="bg-red-500 hover:bg-red-600 drop-shadow-lg text-white px-5 py-2 rounded-lg shadow-md transition-all"
        >
          Unfollow
        </button>
      );
    } else {
      return (
        <button
          onClick={handleFollow}
          className="bg-cyan-500 hover:bg-cyan-600 drop-shadow-lg text-white px-5 py-2 rounded-lg shadow-md transition-all"
        >
          Follow
        </button>
      );
    }
  };

  return (
    <div
      className="
        flex items-center bg-white/90 rounded-xl p-8 mb-10 max-w-3xl mx-auto w-full
        shadow-[0_0_24px_6px_rgba(22,210,255,0.75)]
        border border-cyan-400
        transition-shadow duration-300
        hover:shadow-[0_0_30px_10px_rgba(22,210,255,1)]
        select-none
      "
    >
      <img
        src={profilePhoto || "/User-Prof.png"}
        alt={username}
        className="w-28 h-28 rounded-full object-cover border-4 border-cyan-500 shadow-md mr-8"
        loading="lazy"
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-2">
          <div className="pr-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900 break-words whitespace-normal">
                {firstName} {lastName}
              </span>
              <span className="text-gray-400 ml-2 text-lg">@{username}</span>
            </div>
            {bio && <div className="mt-1 text-gray-700">{bio}</div>}
          </div>

          {showActions && <div className="ml-4 self-start">{renderButton()}</div>}
        </div>

        {interests && interests.length > 0 && (
          <div className="mb-3">
            <span className="font-semibold text-gray-800">Hobbies:</span>{" "}
            <span className="text-cyan-600">
              {interests.filter(Boolean).join(", ")}
            </span>
          </div>
        )}

        <div className="flex gap-8 mt-4 font-semibold text-cyan-700">
          <div>
            <span className="text-lg">{followersCount}</span>
            <span className="block text-gray-500 font-normal text-xs">
              Followers
            </span>
          </div>
          <div>
            <span className="text-lg">{followingCount}</span>
            <span className="block text-gray-500 font-normal text-xs">
              Following
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}



