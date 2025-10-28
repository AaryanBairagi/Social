"use client";
import React, { useState } from "react";

export function UserProfileCard({
  profilePhoto,
  userId,
  firstName,
  lastName,
  bio,
  interests,
  followersCount,
  followingCount,
  isFollowedByUser = false,
  hasSentRequest = false,
  hasReceivedRequest = false,
}: {
  profilePhoto?: string;
  userId: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  interests?: string[];
  followersCount: number;
  followingCount: number;
  isFollowedByUser?: boolean;
  hasSentRequest?: boolean;
  hasReceivedRequest?: boolean;
}) {
  const [followState, setFollowState] = useState({
    isFollowedByUser,
    hasSentRequest,
    hasReceivedRequest,
  });

  const handleFollow = async () => {
    try {
      const res = await fetch("/api/connections/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId: userId }),
      });
      if (!res.ok) throw new Error("Failed to send follow request");
      setFollowState((prev) => ({ ...prev, hasSentRequest: true }));
    } catch (err) {
      console.error("Follow error:", err);
    }
  };

  const handleUnfollow = async () => {
    try {
      const res = await fetch("/api/connections/unfollow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId: userId }),
      });
      if (!res.ok) throw new Error("Failed to unfollow");
      setFollowState((prev) => ({ ...prev, isFollowedByUser: false }));
    } catch (err) {
      console.error("Unfollow error:", err);
    }
  };

  const handleAccept = async () => {
    try {
      const res = await fetch("/api/connections/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId: userId }),
      });
      if (!res.ok) throw new Error("Failed to accept request");
      setFollowState({ isFollowedByUser: true, hasSentRequest: false, hasReceivedRequest: false });
    } catch (err) {
      console.error("Accept error:", err);
    }
  };

  const renderButton = () => {
    if (followState.hasReceivedRequest) {
      return (
        <button
          onClick={handleAccept}
          className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg transition-all shadow-md"
        >
          Accept
        </button>
      );
    } else if (followState.hasSentRequest) {
      return (
        <button
          disabled
          className="bg-gray-400 text-white px-5 py-2 rounded-lg cursor-not-allowed shadow-md"
        >
          Requested
        </button>
      );
    } else if (followState.isFollowedByUser) {
      return (
        <button
          onClick={handleUnfollow}
          className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg transition-all shadow-md"
        >
          Unfollow
        </button>
      );
    } else {
      return (
        <button
          onClick={handleFollow}
          className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg transition-all shadow-md"
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
        alt={userId}
        className="w-28 h-28 rounded-full object-cover border-4 border-cyan-500 shadow-md mr-8"
        loading="lazy"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900 break-words whitespace-normal">
                {firstName} {lastName}
              </span>
              <span className="text-gray-400 ml-2 text-lg">@{userId}</span>
            </div>
            {bio && <div className="mb-1 text-gray-700">{bio}</div>}
          </div>
          {renderButton()}
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



// import React from "react";

// export function UserProfileCard({
//   profilePhoto,
//   userId,
//   firstName,
//   lastName,
//   bio,
//   interests,
//   followersCount,
//   followingCount,
//   isFollowedByUser,
//   hasSentRequest,
//   hasReceivedRequest
// }: {
//   profilePhoto?: string,
//   userId: string,
//   firstName?: string,
//   lastName?: string,
//   bio?: string,
//   interests?: string[],
//   followersCount: number,
//   followingCount: number,
//   isFollowedByUser?: boolean,
//   hasSentRequest? : boolean,
//   hasReceivedRequest? : boolean
// }) {

//     const [followState, setFollowState] = useState({
//     isFollowedByUser,
//     hasSentRequest,
//     hasReceivedRequest,
//   });

//   const handleFollow = async () => {
//     try {
//       const res = await fetch("/api/connections/follow", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ targetUserId: userId }),
//       });
//       if (!res.ok) throw new Error("Failed to send follow request");
//       setFollowState((prev) => ({ ...prev, hasSentRequest: true }));
//     } catch (err) {
//       console.error("Follow error:", err);
//     }
//   };

//   const handleUnfollow = async () => {
//     try {
//       const res = await fetch("/api/connections/unfollow", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ targetUserId: userId }),
//       });
//       if (!res.ok) throw new Error("Failed to unfollow");
//       setFollowState((prev) => ({ ...prev, isFollowedByUser: false }));
//     } catch (err) {
//       console.error("Unfollow error:", err);
//     }
//   };

//   const handleAccept = async () => {
//     try {
//       const res = await fetch("/api/connections/accept", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ targetUserId: userId }),
//       });
//       if (!res.ok) throw new Error("Failed to accept request");
//       setFollowState({ isFollowedByUser: true, hasSentRequest: false, hasReceivedRequest: false });
//     } catch (err) {
//       console.error("Accept error:", err);
//     }
//   };

//   const renderButton = () => {
//     if (followState.hasReceivedRequest) {
//       return (
//         <button
//           onClick={handleAccept}
//           className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg transition-all shadow-md"
//         >
//           Accept
//         </button>
//       );
//     } else if (followState.hasSentRequest) {
//       return (
//         <button
//           disabled
//           className="bg-gray-400 text-white px-5 py-2 rounded-lg cursor-not-allowed shadow-md"
//         >
//           Requested
//         </button>
//       );
//     } else if (followState.isFollowedByUser) {
//       return (
//         <button
//           onClick={handleUnfollow}
//           className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg transition-all shadow-md"
//         >
//           Unfollow
//         </button>
//       );
//     } else {
//       return (
//         <button
//           onClick={handleFollow}
//           className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg transition-all shadow-md"
//         >
//           Follow
//         </button>
//       );
//     }
//   };

//   return (
//     <div
//       className="
//         flex items-center bg-white/90 rounded-xl p-8 mb-10 max-w-3xl mx-auto w-full
//         shadow-[0_0_24px_6px_rgba(22,210,255,0.75)]
//         border border-cyan-400
//         transition-shadow duration-300
//         hover:shadow-[0_0_30px_10px_rgba(22,210,255,1)]
//         cursor-pointer
//         select-none
//       "
//     >
//       <img
//         src={profilePhoto || '/User-Prof.png'}
//         alt={userId}
//         className="w-28 h-28 rounded-full object-cover border-4 border-cyan-500 shadow-md mr-8"
//         loading="lazy"
//       />
//       <div className="flex-1 min-w-0">
//         <div className="flex items-center gap-2 mb-1">
//           <span className="text-2xl font-bold text-gray-900 break-words whitespace-normal">{firstName} {lastName}</span>
//           <span className="text-gray-400 ml-2 text-lg">@{userId}</span>
//         </div>
//         {bio && <div className="mb-1 text-gray-700">{bio}</div>}
//         {interests && interests.length > 0 && (
//           <div className="mb-3">
//             <span className="font-semibold text-gray-800">Hobbies:</span>{" "}
//             <span className="text-cyan-600">{interests.filter(Boolean).join(", ")}</span>
//           </div>
//         )}
//         <div className="flex gap-8 mt-4 font-semibold text-cyan-700">
//           <div>
//             <span className="text-lg">{followersCount}</span>
//             <span className="block text-gray-500 font-normal text-xs">Followers</span>
//           </div>
//           <div>
//             <span className="text-lg">{followingCount}</span>
//             <span className="block text-gray-500 font-normal text-xs">Following</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




