"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import Layout from "../../dashboard/layout";

interface UserProfile {
  mongoId: string;
  username: string;
  firstName: string;
  lastName: string;
  bio?: string;
  profilePhoto?: string;
  followersCount?: number;
  followingCount?: number;
  isFollowing?: boolean;
  isRequestPending?: boolean;
  isRequestSent?: boolean;
}

type FollowStatus = "none" | "requested" | "received" | "following";

export default function UserProfilePage() {
  const params = useParams<{ userId: string }>();
  const userId = params?.userId;
  const [user, setUser] = useState<UserProfile | null>(null);
  const [status, setStatus] = useState<FollowStatus>("none");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const resUser = await fetch(`/api/users/${userId}`);
        if (!resUser.ok) throw new Error("Failed to fetch profile");

        const userData: UserProfile = await resUser.json();
        setUser(userData);

        if (userData.isFollowing) {
          setStatus("following");
        } else if (userData.isRequestPending) {
          setStatus("received");
        } else if (userData.isRequestSent) {
          setStatus("requested");
        } else {
          setStatus("none");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    if (userId) fetchData();
  }, [userId]);

  const handleConnectionAction = async () => {
    if (!user?.mongoId) return;

    try {
      setActionLoading(true);

      if (status === "none") {
        const res = await fetch(`/api/connections/${user.mongoId}/follow`, {
          method: "POST",
        });
        if (!res.ok) throw new Error("Failed to send follow request");
        setStatus("requested");
      } else if (status === "following" || status === "requested") {
        const res = await fetch(`/api/connections/${user.mongoId}/unfollow`, {
          method: "POST",
        });
        if (!res.ok) throw new Error("Failed to remove connection/request");
        setStatus("none");
      } else if (status === "received") {
        const res = await fetch(`/api/connections/${user.mongoId}/accept`, {
          method: "POST",
        });
        if (!res.ok) throw new Error("Failed to accept request");
        setStatus("none");
      }
    } catch (err) {
      console.error("Connection action failed:", err);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) { 
    return (
      <div className="flex flex-row justify-center items-center py-20 gap-4">
        <p className="text-gray-400">Loading Profile</p>
        <svg className="animate-spin h-10 w-10 text-cyan-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4}></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
        </svg>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col justify-center items-center py-20">
        <img
          src="/User-Prof.png"
          alt="Not found"
          width={120}
          height={120}
          className="opacity-80"
        />
        <p className="mt-4 text-cyan-600 font-semibold text-lg">User not found</p>
        <p className="text-sm text-zinc-500">Try searching again 🔍</p>
      </div>
    );
  }

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
              <p className="text-sm text-zinc-500">@{user.username}</p>
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
              onClick={handleConnectionAction}
              className="w-40 bg-cyan-600 hover:bg-cyan-700 text-white"
              disabled={actionLoading}
            >
              {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {!actionLoading && status === "none" && "Follow"}
              {!actionLoading && status === "requested" && "Requested"}
              {!actionLoading && status === "received" && "Accept"}
              {!actionLoading && status === "following" && "Unfollow"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

