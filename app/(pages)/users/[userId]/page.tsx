// app/users/[userId]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button"; // shadcn/ui
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import Layout from "../../dashboard/layout";

interface UserProfile {
  userId: string;
  firstName: string;
  lastName: string;
  bio?: string;
  profilePhoto?: string;
  followersCount?: number;
  followingCount?: number;

  // ✅ added fields from backend
  isFollowing?: boolean;
  isRequestPending?: boolean;
}

type FollowStatus = "none" | "requested" | "following";

export default function UserProfilePage() {
  const { userId } = useParams();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [status, setStatus] = useState<FollowStatus>("none");
  const [loading, setLoading] = useState(true);

  // Fetch user info (with follow flags)
  useEffect(() => {
    async function fetchData() {
      try {
        const resUser = await fetch(`/api/users/${userId}`);
        const userData: UserProfile = await resUser.json();

        setUser(userData);

        if (userData.isFollowing) {
          setStatus("following");
        } else if (userData.isRequestPending) {
          setStatus("requested");
        } else {
          setStatus("none");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    }

    if (userId) fetchData();
  }, [userId]);

  const handleFollow = async () => {
    try {
      if (status === "none") {
        await fetch(`/api/follow`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ to: userId }),
        });
        setStatus("requested");
      } else if (status === "following") {
        await fetch(`/api/follow/${userId}`, { method: "DELETE" });
        setStatus("none");
      }
    } catch (err) {
      console.error("Follow action failed:", err);
    }
  };

  // Loading state
  if (loading)
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="animate-spin text-cyan-500 w-10 h-10" />
        <span className="ml-3 text-cyan-600 font-medium animate-pulse">
          Loading profile...
        </span>
      </div>
    );

  // Not found
  if (!user)
    return (
      <div className="flex flex-col justify-center items-center py-20">
        <img
          src="/User-Prof.png"
          alt="Not found"
          width={120}
          height={120}
          className="opacity-80"
        />
        <p className="mt-4 text-cyan-600 font-semibold text-lg">
          User not found
        </p>
        <p className="text-sm text-zinc-500">Try searching again 🔍</p>
      </div>
    );

  // Profile
  return (
    <Layout>
    <div className="flex justify-center py-10">
      <Card className="max-w-lg w-full rounded-2xl shadow-lg p-6">
        <CardContent className="flex flex-col items-center gap-4">
          <img
            src={user.profilePhoto || "/User-Prof.png"}
            alt={user.firstName}
            width={100}
            height={100}
            className="rounded-full object-cover"
          />
          <div className="text-center">
            <h2 className="text-xl font-semibold text-cyan-600">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-sm text-zinc-500">@{user.userId}</p>
          </div>

          {user.bio && (
            <p className="text-sm text-zinc-600 text-center">{user.bio}</p>
          )}

          <div className="flex gap-6 text-sm text-zinc-700">
            <span>
              <strong>{user.followersCount ?? 0}</strong> Followers
            </span>
            <span>
              <strong>{user.followingCount ?? 0}</strong> Following
            </span>
          </div>

          <Button
            onClick={handleFollow}
            className="w-40 bg-cyan-600 hover:bg-cyan-700 text-white"
            disabled={status === "requested"}
          >
            {status === "none" && "Follow"}
            {status === "requested" && "Request Sent"}
            {status === "following" && "Unfollow"}
          </Button>
        </CardContent>
      </Card>
    </div>
    </Layout>
  );
}
