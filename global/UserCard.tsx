import React, { useState } from "react";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";
import { useRouter } from "next/navigation";

type ConnectionUser = {
  _id: string;
  firstName: string;
  lastName: string;
  userId: string;
  profilePhoto?: string;
  initiallyFollowing?: boolean;
  isFollowedByUser?: boolean;
  hasSentRequest?: boolean;    // User has sent a follow request to this person
  hasReceivedRequest?: boolean; // User has received a follow request from this person
};

export function UserCard({ user, refresh }: { user: ConnectionUser; refresh?: () => void }) {
  const router = useRouter();
  const [isFollowing, setIsFollowing] = useState(user.initiallyFollowing || false);
  const [loading, setLoading] = useState(false);

  const handleNavigate = () => {
    router.push(`/profile/${user.userId}`);
  };

  const toggleFollow = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (loading) return;
    setLoading(true);
    try {
      if (isFollowing) {
        // Unfollow
        await fetch(`/api/connections/${user._id}/unfollow`, { method: "POST" });
        setIsFollowing(false);
      } else if (user.hasReceivedRequest) {
        // Accept the incoming follow request
        await fetch(`/api/connections/${user._id}/accept`, { method: "POST" });
        setIsFollowing(true);
      } else {
        // Send a new follow request
        await fetch(`/api/connections/${user._id}/follow`, { method: "POST" });
        setIsFollowing(true);
      }
      if (refresh) refresh();
    } catch (error) {
      console.error("Error toggling follow:", error);
    } finally {
      setLoading(false);
    }
  };

  let buttonLabel = "Follow";
  let buttonClasses = "bg-gray-900 text-cyan-400 hover:bg-cyan-900 hover:text-white border border-cyan-600";

  if (loading) {
    buttonLabel = "...";
  } else if (isFollowing) {
    buttonLabel = "Unfollow";
    buttonClasses = "bg-cyan-700 text-white hover:bg-cyan-800 border border-cyan-700";
  } else if (user.hasSentRequest) {
    buttonLabel = "Requested";
    buttonClasses = "bg-gray-800 text-gray-400 cursor-not-allowed border border-gray-600";
  } else if (user.hasReceivedRequest) {
    buttonLabel = "Accept";
    buttonClasses = "bg-green-600 text-white hover:bg-green-700 border border-green-700";
  }

  return (
    <CardContainer containerClassName="cursor-pointer" className="max-w-xs" onClick={handleNavigate}>
      <CardBody>
        <CardItem
          className="
            min-h-[280px]
            rounded-xl
            bg-gradient-to-br from-gray-900 to-gray-800
            shadow-lg
            border border-gray-700
            hover:shadow-cyan-600/30
            transition-all duration-150
            p-7 flex flex-col items-center justify-between
            hover:-translate-y-1 hover:border-cyan-500
          "
          translateZ={0}
        >
          <img
            src={user.profilePhoto || "/default-avatar.png"}
            alt={`${user.firstName} ${user.lastName}`}
            className="
              w-20 h-20 rounded-full object-cover
              border-4 border-white shadow
              transition-all duration-150
              hover:border-cyan-400
            "
            loading="lazy"
          />
          <h3 className="text-lg font-bold text-white text-center">
            {user.firstName} {user.lastName}
          </h3>
          <p className="text-cyan-400 text-xs font-mono mb-2">@{user.userId}</p>
          <button
            disabled={loading || buttonLabel === "Requested"}
            onClick={toggleFollow}
            aria-pressed={isFollowing}
            className={`mt-2 px-7 py-2 rounded-full font-semibold text-sm transition-colors border ${buttonClasses}`}
          >
            {buttonLabel}
          </button>
        </CardItem>
        <CardItem
          className="rounded-xl border border-cyan-600 opacity-25 pointer-events-none select-none"
          translateX={-10}
          translateY={-12}
          translateZ={-18}
          rotateX={8}
          rotateY={-7}
        />
        <CardItem
          className="rounded-xl border border-cyan-600 opacity-15 pointer-events-none select-none"
          translateX={13}
          translateY={19}
          translateZ={-24}
          rotateX={-9}
          rotateY={12}
        />
      </CardBody>
    </CardContainer>
  );
}







// import React, { useState } from "react";
// import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";
// import { useRouter } from "next/navigation";

// type ConnectionUser = {
//   _id: string;
//   firstName: string;
//   lastName: string;
//   userId: string;
//   profilePhoto?: string;
//   initiallyFollowing?: boolean;
//   isFollowedByCurrentUser?: boolean;
//   hasReceivedRequest?: boolean;  // If current user has received a follow request from this user
//   hasSentRequest?: boolean;      // If current user has sent a follow request to this user
// };

// export function UserCard({ user, refreshConnections }: { user: ConnectionUser; refreshConnections?: () => void }) {
//   const router = useRouter();
//   const [isFollowing, setIsFollowing] = useState(user.initiallyFollowing || false);
//   const [loading, setLoading] = useState(false);

//   const handleClick = () => {
//     router.push(`/profile/${user._id}`);
//   };

//   const toggleFollow = async (e: React.MouseEvent) => {
//     e.stopPropagation();
//     if (loading) return;

//     setLoading(true);
//     try {
//       if (isFollowing) {
//         // Unfollow
//         await fetch(`/api/connections/${user._id}/unfollow`, { method: "POST" });
//         setIsFollowing(false);
//       } else if (user.hasReceivedRequest) {
//         // Accept incoming request
//         await fetch(`/api/connections/${user._id}/accept`, { method: "POST" });
//         setIsFollowing(true);
//       } else {
//         // Send follow request
//         await fetch(`/api/connections/${user._id}/follow`, { method: "POST" });
//       }
//       if (refreshConnections) refreshConnections();
//     } catch (err) {
//       console.error("Error toggling follow", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Decide button label and style based on state
//   let buttonLabel = "Follow";
//   let buttonClasses =
//     "bg-gray-900 text-cyan-400 hover:bg-cyan-900 hover:text-white border border-cyan-600";

//   if (loading) {
//     buttonLabel = "...";
//   } else if (isFollowing) {
//     buttonLabel = "Unfollow";
//     buttonClasses = "bg-cyan-700 text-white hover:bg-cyan-800 border border-cyan-700";
//   } else if (user.hasSentRequest) {
//     buttonLabel = "Requested";
//     buttonClasses = "bg-gray-800 text-gray-400 cursor-not-allowed border border-gray-600";
//   } else if (user.hasReceivedRequest) {
//     buttonLabel = "Accept";
//     buttonClasses = "bg-green-600 text-white hover:bg-green-700 border border-green-700";
//   }

//   return (
//     <CardContainer containerClassName="cursor-pointer" className="max-w-xs" onClick={handleClick}>
//       <CardBody>
//         <CardItem
//           className="
//             min-h-[280px]
//             rounded-xl 
//             bg-gradient-to-br from-gray-900 to-gray-800 
//             shadow-lg 
//             border border-gray-700 
//             hover:shadow-cyan-600/30
//             transition-all duration-150
//             p-7 flex flex-col items-center justify-between
//             hover:-translate-y-1 hover:border-cyan-500
//           "
//           translateZ={0}
//         >
//           <img
//             src={user.profilePhoto || "/default-avatar.png"}
//             alt={`${user.firstName} ${user.lastName}`}
//             className="
//               w-20 h-20 rounded-full object-cover 
//               border-4 border-white shadow
//               transition-all duration-150
//               hover:border-cyan-400
//             "
//             loading="lazy"
//           />
//           <h3 className="text-lg font-bold text-white leading-tight text-center">
//             {user.firstName} {user.lastName}
//           </h3>
//           <p className="text-cyan-400 text-xs font-mono tracking-wide mb-2">@{user.userId}</p>
//           <button
//             onClick={toggleFollow}
//             disabled={loading || buttonLabel === "Requested"}
//             className={`mt-2 px-7 py-2 rounded-full font-semibold text-sm transition-colors border ${buttonClasses}`}
//             aria-pressed={isFollowing}
//           >
//             {buttonLabel}
//           </button>
//         </CardItem>
//         <CardItem
//           className="rounded-xl border border-cyan-600 opacity-25 pointer-events-none select-none"
//           translateX={-10}
//           translateY={-12}
//           translateZ={-18}
//           rotateX={8}
//           rotateY={-7}
//         />
//         <CardItem
//           className="rounded-xl border border-cyan-600 opacity-15 pointer-events-none select-none"
//           translateX={13}
//           translateY={19}
//           translateZ={-24}
//           rotateX={-9}
//           rotateY={12}
//         />
//       </CardBody>
//     </CardContainer>
//   );
// }













// import React, { useState } from "react";
// import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";
// import { useRouter } from "next/navigation";

// type ConnectionUser = {
//   _id: string;
//   firstName: string;
//   lastName: string;
//   userId: string;
//   profilePhoto?: string;
//   initiallyFollowing?: boolean;
//   isFollowedByCurrentUser?: boolean;
// };

// export function UserCard({ user, refreshConnections }: { user: ConnectionUser; refreshConnections?: () => void }) {
//   const router = useRouter();
//   const [isFollowing, setIsFollowing] = useState(user.initiallyFollowing || false);
//   const [loading, setLoading] = useState(false);

//   const handleClick = () => {
//     router.push(`/profile/${user.userId}`);
//   };

//   // const toggleFollow = async (e: React.MouseEvent) => {
//   //   e.stopPropagation();
//   //   if (loading) return;
//   //   setLoading(true);
//   //   try {
//   //     if (isFollowing) {
//   //       await fetch(`/api/connections/${user._id}/unfollow`, { method: "POST" });
//   //       setIsFollowing(false);
//   //     } else {
//   //       await fetch(`/api/connections/${user._id}/follow`, { method: "POST" });
//   //       setIsFollowing(true);
//   //     }
//   //     if (refreshConnections) refreshConnections();
//   //   } catch (err) {
//   //     console.error("Failed to toggle follow", err);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   const toggleFollow = async (e) => {
//   e.stopPropagation();
//   if (loading) return;
//   setLoading(true);
//   try {
//     if (isFollowing) {
//       await fetch(`/api/connections/${user._id}/unfollow`, { method: "POST" });
//       setIsFollowing(false);
//     } else {
//       await fetch(`/api/connections/${user._id}/follow`, { method: "POST" });
//       setIsFollowing(true);
//     }
//     refreshConnections?.();
//   } catch (err) {
//     console.error(err);
//   } finally {
//     setLoading(false);
//   }
// };


//   return (
//     <CardContainer containerClassName="cursor-pointer" className="max-w-xs" onClick={handleClick}>
//       <CardBody>
//         <CardItem
//           className="
//             min-h-[280px]
//             rounded-xl 
//             bg-gradient-to-br from-gray-900 to-gray-800 
//             shadow-lg 
//             border border-gray-700 
//             hover:shadow-cyan-600/30
//             transition-all duration-150
//             p-7 flex flex-col items-center justify-between
//             hover:-translate-y-1 hover:border-cyan-500
//           "
//           translateZ={0}
//         >
//           <img
//             src={user.profilePhoto || "/default-avatar.png"}
//             alt={`${user.firstName} ${user.lastName}`}
//             className="
//               w-20 h-20 rounded-full object-cover 
//               border-4 border-white shadow
//               transition-all duration-150
//               hover:border-cyan-400
//             "
//             loading="lazy"
//           />
//           <h3 className="text-lg font-bold text-white leading-tight text-center">
//             {user.firstName} {user.lastName}
//           </h3>
//           <p className="text-cyan-400 text-xs font-mono tracking-wide mb-2">@{user.userId}</p>
//           <button
//             onClick={toggleFollow}
//             disabled={loading}
//             className={`
//               mt-2 px-7 py-2 rounded-full font-semibold text-sm
//               transition-colors border border-cyan-600
//               ${isFollowing
//                 ? "bg-cyan-700 text-white hover:bg-cyan-800"
//                 : "bg-gray-900 text-cyan-400 hover:bg-cyan-900 hover:text-white"}
//               ${loading ? "opacity-70 cursor-not-allowed" : ""}
//             `}
//             aria-pressed={isFollowing}
//           >
//             {loading ? "..." : isFollowing ? "Unfollow" : "Follow"}
//           </button>
//         </CardItem>
//         <CardItem
//           className="rounded-xl border border-cyan-600 opacity-25 pointer-events-none select-none"
//           translateX={-10}
//           translateY={-12}
//           translateZ={-18}
//           rotateX={8}
//           rotateY={-7}
//         />
//         <CardItem
//           className="rounded-xl border border-cyan-600 opacity-15 pointer-events-none select-none"
//           translateX={13}
//           translateY={19}
//           translateZ={-24}
//           rotateX={-9}
//           rotateY={12}
//         />
//       </CardBody>
//     </CardContainer>
//   ); 
// }
