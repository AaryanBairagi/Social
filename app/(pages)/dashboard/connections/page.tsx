"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, UserCheck, UserPlus } from "lucide-react";

type ConnectionUser = {
  _id: string;
  firstName: string;
  lastName: string;
  userId: string;
  profilePhoto?: string;
};

export default function ConnectionsPage() {
  const { user, isSignedIn, isLoaded } = useUser();
  const currentUserId = user?.id || null;
  const router = useRouter();

  const [followers, setFollowers] = useState<ConnectionUser[]>([]);
  const [following, setFollowing] = useState<ConnectionUser[]>([]);
  const [loading, setLoading] = useState<"followers" | "following" | null>(null);

  const fetchList = async (list: "followers" | "following") => {
    if (!currentUserId) return;
    setLoading(list);
    try {
      const res = await fetch(`/api/connections/${currentUserId}/${list}`);
      if (!res.ok) throw new Error(`Failed to fetch ${list}`);
      const data = await res.json();
      if (list === "followers") setFollowers(data || []);
      else setFollowing(data || []);
    } catch (err) {
      if (list === "followers") setFollowers([]);
      else setFollowing([]);
    } finally {
      setLoading(null);
    }
  };

  useEffect(() => {
    if (isLoaded && isSignedIn && currentUserId) {
      fetchList("followers");
      fetchList("following");
    }
  }, [isLoaded, isSignedIn, currentUserId]);

  const UserCard = ({ user }: { user: ConnectionUser }) => (
    <Card
      className="flex items-center gap-4 bg-white/60 glassmorphism border-cyan-100 hover:shadow-lg transition-shadow cursor-pointer group"
      onClick={() => router.push(`/profile/${user.userId}`)}
      tabIndex={0}
    >
      <CardContent className="flex items-center py-4 gap-4 w-full">
        <img
          src={user.profilePhoto || "/default-avatar.png"}
          alt={user.firstName + " " + user.lastName}
          className="w-14 h-14 rounded-full object-cover border-2 border-cyan-300 shadow group-hover:scale-105 transition-transform duration-150"
          loading="lazy"
        />
        <div className="flex flex-col flex-1 min-w-0">
          <span className="font-semibold text-lg text-gray-900 truncate">
            {user.firstName} {user.lastName}
          </span>
          <span className="text-sm text-cyan-600 truncate">@{user.userId}</span>
        </div>
        <UserPlus className="w-5 h-5 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
      </CardContent>
    </Card>
  );

  if (!isLoaded) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6 animate-pulse">
        <Skeleton className="h-10 w-2/3" />
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="bg-white/80 shadow-xl border border-cyan-200 p-8 rounded-lg text-center text-red-500 text-xl font-semibold">
          Please sign in to view your connections.
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-[85vh] bg-gradient-to-br from-cyan-100 to-blue-100/50 flex justify-center py-10 px-2">
      <section className="w-full max-w-2xl">
        <h1 className="text-3xl font-extrabold mb-8 tracking-tight text-center text-cyan-700 drop-shadow">
          Connections
        </h1>
        <Tabs defaultValue="followers" className="w-full">
          <TabsList className="w-full flex justify-center gap-8 mb-0 bg-white/70 shadow-none border-b border-cyan-200">
            <TabsTrigger
              value="followers"
              className="font-bold text-lg p-4 border-b-2 data-[state=active]:border-cyan-500 data-[state=active]:text-cyan-700 data-[state=inactive]:text-gray-400 transition tracking-wide flex items-center gap-2"
            >
              <Users className="w-5 h-5" />
              Followers ({followers.length})
            </TabsTrigger>
            <TabsTrigger
              value="following"
              className="font-bold text-lg p-4 border-b-2 data-[state=active]:border-cyan-500 data-[state=active]:text-cyan-700 data-[state=inactive]:text-gray-400 transition tracking-wide flex items-center gap-2"
            >
              <UserCheck className="w-5 h-5" />
              Following ({following.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="followers">
            <div className="flex flex-col gap-4 py-6">
              {loading === "followers"
                ? [...Array(3)].map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)
                : followers.length === 0
                ? (
                    <div className="p-8 text-center text-gray-500 border border-cyan-100 bg-white/80 rounded-xl">
                      No followers yet.
                    </div>
                  )
                : followers.map(user => <UserCard key={user._id} user={user} />)
              }
            </div>
          </TabsContent>
          <TabsContent value="following">
            <div className="flex flex-col gap-4 py-6">
              {loading === "following"
                ? [...Array(3)].map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)
                : following.length === 0
                ? (
                    <div className="p-8 text-center text-gray-500 border border-cyan-100 bg-white/80 rounded-xl">
                      You are not following anyone.
                    </div>
                  )
                : following.map(user => <UserCard key={user._id} user={user} />)
              }
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </main>
  );
}
