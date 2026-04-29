import React, { useState } from "react";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";
import { useRouter } from "next/navigation";

type ConnectionUser = {
  _id: string;
  firstName: string;
  lastName: string;
  userId: string;
  profilePhoto?: string;
  isFollowedByUser?: boolean;
  hasSentRequest?: boolean;    // User has sent a follow request to this person
  hasReceivedRequest?: boolean; // User has received a follow request from this person
};

export function UserCard({ user, refresh }: { user: ConnectionUser; refresh?: () => void }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleNavigate = () => {
    router.push(`/profile/${user.userId}`);
  };

  const toggleFollow = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (loading) return;
    setLoading(true);
    try {
      if (user.isFollowedByUser) {
        // Unfollow
        await fetch(`/api/connections/${user._id}/unfollow`, { method: "POST" });
      } 
      else if (user.hasReceivedRequest) {
        // Accept the incoming follow request
        await fetch(`/api/connections/${user._id}/accept`, { method: "POST" });
      } 
      else if(!user.hasSentRequest) {
        // Send a new follow request
        await fetch(`/api/connections/${user._id}/follow`, { method: "POST" });
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
    buttonLabel = "Proceeding";
    buttonClasses="bg-blue-400 text-white border border-blue-500"
  } else if (user.isFollowedByUser) {
    buttonLabel = "Unfollow";
    buttonClasses = "bg-[#f87171] text-white hover:bg-[#dc2626] border border-[#f87171]";
  } else if (user.hasSentRequest) {
    buttonLabel = "Requested";
    buttonClasses = "bg-gray-800 text-gray-400 cursor-not-allowed border border-gray-600";
  } else if (user.hasReceivedRequest) {
    buttonLabel = "Accept";
    buttonClasses = "bg-[#22c55e] text-white hover:bg-[#16a34a] border border-[#22c55e]";
  } else{
      buttonLabel = "Follow"
      buttonClasses = "bg-[#06b6d4] text-white hover:bg-[#0891b2] border border-[#06b6d4]"; 
  }

  return (
    <div className="cursor-pointer max-w-xs" onClick={handleNavigate}>
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
            // aria-pressed={isFollowing}
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
    </div>
  );
}

