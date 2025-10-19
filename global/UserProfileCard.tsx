import React from "react";

export function UserProfileCard({
  profilePhoto,
  userId,
  firstName,
  lastName,
  bio,
  interests,
  followersCount,
  followingCount,
}: {
  profilePhoto?: string,
  userId: string,
  firstName?: string,
  lastName?: string,
  bio?: string,
  interests?: string[],
  followersCount: number,
  followingCount: number,
}) {
  return (
    <div
      className="
        flex items-center bg-white/90 rounded-xl p-8 mb-10 max-w-3xl mx-auto w-full
        shadow-[0_0_24px_6px_rgba(22,210,255,0.75)]
        border border-cyan-400
        transition-shadow duration-300
        hover:shadow-[0_0_30px_10px_rgba(22,210,255,1)]
        cursor-pointer
        select-none
      "
    >
      <img
        src={profilePhoto || '/User-Prof.png'}
        alt={userId}
        className="w-28 h-28 rounded-full object-cover border-4 border-cyan-500 shadow-md mr-8"
        loading="lazy"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl font-bold text-gray-900 break-words whitespace-normal">{firstName} {lastName}</span>
          <span className="text-gray-400 ml-2 text-lg">@{userId}</span>
        </div>
        {bio && <div className="mb-1 text-gray-700">{bio}</div>}
        {interests && interests.length > 0 && (
          <div className="mb-3">
            <span className="font-semibold text-gray-800">Hobbies:</span>{" "}
            <span className="text-cyan-600">{interests.filter(Boolean).join(", ")}</span>
          </div>
        )}
        <div className="flex gap-8 mt-4 font-semibold text-cyan-700">
          <div>
            <span className="text-lg">{followersCount}</span>
            <span className="block text-gray-500 font-normal text-xs">Followers</span>
          </div>
          <div>
            <span className="text-lg">{followingCount}</span>
            <span className="block text-gray-500 font-normal text-xs">Following</span>
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
// }: {
//   profilePhoto?: string,
//   userId: string,
//   firstName?: string,
//   lastName?: string,
//   bio?: string,
//   interests?: string[],
//   followersCount: number,
//   followingCount: number,
// }) {
//   return (
//     <div className="flex items-center bg-white/90 shadow-lg rounded-xl p-8 mb-10 max-w-3xl mx-auto w-full">
//       <img
//         src={profilePhoto || "/default-avatar.png"}
//         alt={userId}
//         className="w-28 h-28 rounded-full object-cover border-4 border-cyan-500 shadow-md mr-8"
//         loading="lazy"
//       />
//       <div className="flex-1 min-w-0">
//         <div className="flex items-center gap-2 mb-1">
//           <span className="text-2xl font-bold text-gray-900 truncate">{firstName} {lastName}</span>
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
