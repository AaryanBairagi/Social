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
};

export function UserCard({ user }: { user: ConnectionUser }) {
  const router = useRouter();
  const [isFollowing, setIsFollowing] = useState(user.initiallyFollowing || false);
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    router.push(`/profile/${user.userId}`);
  };

  const toggleFollow = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card navigation on button click
    if (loading) return; // Prevent multiple clicks

    setLoading(true);
    try {
      if (isFollowing) {
        await fetch(`/api/connections/${user.userId}/unfollow`, { method: "POST" });
        setIsFollowing(false);
      } else {
        await fetch(`/api/connections/${user.userId}/follow`, { method: "POST" });
        setIsFollowing(true);
      }
    } catch (err) {
      console.error("Failed to toggle follow", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CardContainer containerClassName="cursor-pointer" className="max-w-xs" onClick={handleClick}>
      <CardBody>
        <CardItem
          className="rounded-xl bg-white shadow-md p-6 flex flex-col items-center justify-center space-y-4"
          translateZ={0}
        >
          <img
            src={user.profilePhoto || "/default-avatar.png"}
            alt={`${user.firstName} ${user.lastName}`}
            className="w-24 h-24 rounded-full object-cover border-4 border-cyan-500 shadow-lg"
            loading="lazy"
          />
          <h3 className="text-xl font-semibold text-gray-900 truncate">
            {user.firstName} {user.lastName}
          </h3>
          <p className="text-cyan-600 text-sm truncate">@{user.userId}</p>

          <button
            onClick={toggleFollow}
            disabled={loading}
            className={`px-6 py-2 rounded-md font-semibold transition ${
              isFollowing
                ? "bg-cyan-600 text-white hover:bg-cyan-700"
                : "bg-white border border-cyan-600 text-cyan-600 hover:bg-cyan-100"
            } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {loading ? "..." : isFollowing ? "Unfollow" : "Follow"}
          </button>
        </CardItem>

        <CardItem
          className="rounded-xl border border-cyan-300 opacity-40 pointer-events-none select-none"
          translateX={-10}
          translateY={-12}
          translateZ={-15}
          rotateX={10}
          rotateY={-10}
        />
        <CardItem
          className="rounded-xl border border-cyan-300 opacity-30 pointer-events-none select-none"
          translateX={10}
          translateY={15}
          translateZ={-25}
          rotateX={-10}
          rotateY={10}
        />
      </CardBody>
    </CardContainer>
  );
}
