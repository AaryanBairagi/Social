"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, UserCheck, Search } from "lucide-react";
import { UserCard } from "../../../../global/UserCard";
import { UserProfileCard } from "@/global/UserProfileCard";

type ConnectionUser = {
  _id: string;
  firstName: string;
  lastName: string;
  userId: string;
  profilePhoto?: string;
  isFollowedByUser?: boolean;
  hasSentRequest?: boolean;
  hasReceivedRequest?: boolean;
};

export default function ConnectionsPage() {
  const { user, isSignedIn, isLoaded } = useUser();

  const [mongoUserId, setMongoUserId] = useState<string | null>(null);
  const [followers, setFollowers] = useState<ConnectionUser[]>([]);
  const [following, setFollowing] = useState<ConnectionUser[]>([]);
  const [discoverUsers, setDiscoverUsers] = useState<ConnectionUser[]>([]);
  const [loading, setLoading] = useState<"followers" | "following" | "discover" | null>(null);
  const [profileUser, setProfileUser] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [discoverLoading, setDiscoverLoading] = useState(false);
  const [sentRequests, setSentRequests] = useState<string[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<string[]>([]);

  // Fetch MongoDB user _id from backend via new API route
  useEffect(() => {
    async function fetchMongoUserId() {
      if (!isSignedIn) return;
      try {
        const res = await fetch("/api/user/getId");
        if (!res.ok) throw new Error("Failed to fetch user ID");
        const data = await res.json();
        setMongoUserId(data.id);
      } catch {
        setMongoUserId(null);
      }
    }
    fetchMongoUserId();
  }, [isSignedIn]);

  // Utility to add flags (followed/requested) to user list for frontend display
  const enhanceUsersWithFlags = (
    users: ConnectionUser[],
    followingIds: string[],
    sentReqs: string[],
    receivedReqs: string[],
  ): ConnectionUser[] => {
    return users.map(user => ({
      ...user,
      isFollowedByUser: followingIds.includes(user._id),
      hasSentRequest: sentReqs.includes(user._id),
      hasReceivedRequest: receivedReqs.includes(user._id),
    }));
  };

//Main data fetching function
const fetchConnectionData = useCallback(async () => {
  if (!mongoUserId) return;
  setLoading("followers");

  try {
    const [followersRes, followingRes, requestsRes, profileRes] = await Promise.all([
      fetch(`/api/connections/${mongoUserId}/followers`),
      fetch(`/api/connections/${mongoUserId}/following`),
      fetch(`/api/connections/requests`),
      fetch(`/api/user/profile?clerkId=${user?.id}`)
    ]);

    if (!followersRes.ok || !followingRes.ok || !requestsRes.ok || !profileRes.ok) {
      throw new Error("Failed to fetch all data");
    }

    // Read responses
    const [followersData, followingData, requestsData, profileData] = await Promise.all([
      followersRes.json(),
      followingRes.json(),
      requestsRes.json(),
      profileRes.json()
    ]);

    // Check for no change before setting state
    setFollowers(current => {
      if (JSON.stringify(current) === JSON.stringify(followersData)) return current;
      return enhanceUsersWithFlags(followersData, followingData.map(u => u._id), requestsData.sentRequests ?? [], requestsData.receivedRequests ?? []);
    });

    setFollowing(current => {
      const combinedMap = new Map();
      for (const user of followingData) combinedMap.set(user._id, { ...user, isFollowedByUser: true });
      for (const user of discoverUsers) {
        if (requestsData.sentRequests.includes(user._id) && !combinedMap.has(user._id) && user._id !== mongoUserId) {
          combinedMap.set(user._id, { ...user, hasSentRequest: true });
        }
      }
      const newArray = Array.from(combinedMap.values());
      if (JSON.stringify(current) === JSON.stringify(newArray)) return current;
      return newArray;
    });

    setSentRequests(current => {
      if (JSON.stringify(current) === JSON.stringify(requestsData.sentRequests ?? [])) return current;
      return requestsData.sentRequests ?? [];
    });

    setReceivedRequests(current => {
      if (JSON.stringify(current) === JSON.stringify(requestsData.receivedRequests ?? [])) return current;
      return requestsData.receivedRequests ?? [];
    });

    setProfileUser(current => {
      if (JSON.stringify(current) === JSON.stringify(profileData)) return current;
      return profileData;
    });

  } catch {
    setFollowers([]);
    setFollowing([]);
    setProfileUser(null);
  } finally {
    setLoading(null);
    setProfileLoading(false);
  }
}, [mongoUserId, user?.id, discoverUsers]);



  // Fetch discover users excluding current user
  useEffect(() => {
    async function fetchDiscoverUsers() {
      if (!mongoUserId) return;

      setDiscoverLoading(true);
      try {
        const res = await fetch(`/api/fetchusers?excludeId=${mongoUserId}`);
        if (!res.ok) throw new Error("Failed to fetch discover users");
        const data: ConnectionUser[] = await res.json();

        setDiscoverUsers(
          data
            .filter(u => u._id !== mongoUserId) // Filter self out
            .map(user => ({
              ...user,
              isFollowedByUser: false,
              hasSentRequest: false,
              hasReceivedRequest: false,
            }))
        );
      } catch {
        setDiscoverUsers([]);
      } finally {
        setDiscoverLoading(false);
      }
    }
    fetchDiscoverUsers();
  }, [mongoUserId]);

  // Function to refresh connection data after follow/unfollow/accept activities
  const refreshConnections = () => {
    fetchConnectionData();
  };

  // Load connection data on auth state change and when mongoUserId is set
  useEffect(() => {
    if (isLoaded && isSignedIn && mongoUserId) {
      fetchConnectionData();
    }
  }, [isLoaded, isSignedIn, mongoUserId , fetchConnectionData]);

  const placeholderCount = 3;

  if (!isLoaded) {
    return (
      <main className="max-w-xl mx-auto p-6 space-y-6 animate-pulse">
        <Skeleton className="h-12 w-44" />
        {[...Array(placeholderCount)].map((_, i) => (
          <Skeleton key={i} className="h-40 rounded-lg" />
        ))}
      </main>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="bg-red-100 p-10 rounded text-red-700 font-semibold">
          Please sign in to view your connections.
        </div>
      </div>
    );
  }

  const filteredDiscoverUsers = discoverUsers.filter(user => 
  user._id !== mongoUserId && // exclude self
  !sentRequests.includes(user._id) // exclude users user has sent requests to
);

  return (
    <main className="min-h-screen bg-gradient-to-br from-cyan-100 to-blue-100 flex justify-center py-10 px-5 rounded-md">
      <section className="max-w-6xl w-full">
        {profileLoading ? (
          <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow flex justify-center">
            <div
              className="w-12 h-12 border-4 border-t-cyan-600 rounded-full animate-spin"
              role="status"
              aria-label="Loading profile"
            />
          </div>
        ) : (
          profileUser && (
            <UserProfileCard
              userId={profileUser.userId}
              firstName={profileUser.firstName}
              lastName={profileUser.lastName}
              profilePhoto={profileUser.profilePhoto}
              bio={profileUser.bio}
              interests={profileUser.interests}
              followersCount={followers.length}
              followingCount={following.length}
            />
          )
        )}

        <Tabs defaultValue="followers" className="mt-8 bg-white rounded shadow">
          <TabsList className="border-b border-cyan-300 flex justify-center gap-8 px-8">
            <TabsTrigger
              value="followers"
              className="flex items-center space-x-2 font-semibold text-lg px-4 py-3 data-[state=active]:border-b-2 data-[state=active]:border-cyan-600 data-[state=active]:text-cyan-700"
            >
              <Users size={20} /> <span>Followers ({followers.length})</span>
            </TabsTrigger>
            <TabsTrigger
              value="following"
              className="flex items-center space-x-2 font-semibold text-lg px-4 py-3 data-[state=active]:border-b-2 data-[state=active]:border-cyan-600 data-[state=active]:text-cyan-700"
            >
              <UserCheck size={20} /> <span>Following ({following.length})</span>
            </TabsTrigger>
            <TabsTrigger
              value="discover"
              className="flex items-center space-x-2 font-semibold text-lg px-4 py-3 data-[state=active]:border-b-2 data-[state=active]:border-cyan-600 data-[state=active]:text-gray-400"
            >
              <Search size={20} /> <span>Discover</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="followers"
            className="p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
          >
            {loading === "followers" ? (
              [...Array(placeholderCount)].map((_, i) => (
                <Skeleton key={i} className="h-48 rounded-lg" />
              ))
            ) : followers.length === 0 ? (
              <p className="text-center col-span-full text-gray-500 py-16">
                No followers yet.
              </p>
            ) : (
              followers.map(user => (
                <UserCard
                  key={user._id}
                  user={user}
                  refreshConnections={refreshConnections}
                />
              ))
            )}
          </TabsContent>

          <TabsContent
            value="following"
            className="p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
          >
            {loading === "following" ? (
              [...Array(placeholderCount)].map((_, i) => (
                <Skeleton key={i} className="h-48 rounded-lg" />
              ))
            ) : following.length === 0 ? (
              <p className="text-center col-span-full text-gray-500 py-16">
                You are not following anyone.
              </p>
            ) : (
              following.map(user => (
                <UserCard
                  key={user._id}
                  user={user}
                  refreshConnections={refreshConnections}
                />
              ))
            )}
          </TabsContent>

          <TabsContent
            value="discover"
            className="p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
          >
            {discoverLoading ? (
              [...Array(placeholderCount)].map((_, i) => (
                <Skeleton key={i} className="h-48 rounded-lg" />
              ))
            ) : filteredDiscoverUsers.length === 0 ? (
              <p className="text-center col-span-full text-gray-500 py-16">
                No users found to discover.
              </p>
            ) : (
              filteredDiscoverUsers.map(user => (
                <UserCard
                  key={user._id}
                  user={user}
                  refreshConnections={refreshConnections}
                />
              ))
            )}
          </TabsContent>
        </Tabs>
      </section>
    </main>
  );
}


