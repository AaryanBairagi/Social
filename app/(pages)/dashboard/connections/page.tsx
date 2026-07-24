"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, UserCheck, Search } from "lucide-react";
import { UserCard } from "../../../../global/UserCard";
import { UserProfileCard } from "@/global/UserProfileCard";
import { useAuth } from "@/contexts/AuthContext";

type ConnectionUser = {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  profilePhoto?: string;
  bio?: string;
  interests?: string[];
  college?: string;
  year?: string;
  department?: string;
  isFollowedByUser?: boolean;
  hasSentRequest?: boolean;
  hasReceivedRequest?: boolean;
};

type RecommendationItem = {
  user: ConnectionUser;
  score: number;
  reasons: string[];
  breakdown: {
    mutualConnections: number;
    sharedInterests: number;
    sameDepartment: boolean;
    sameYear: boolean;
    sameCollege: boolean;
    secondDegree: boolean;
  };
};

type EdgeUserRef =
  | string
  | {
      _id: string;
      firstName?: string;
      lastName?: string;
      username?: string;
      profilePhoto?: string;
      bio?: string;
      interests?: string[];
      college?: string;
      year?: string;
      department?: string;
    };

type ConnectionEdge = {
  _id: string;
  fromUser?: EdgeUserRef;
  toUser?: EdgeUserRef;
};

export default function ConnectionsPage() {
  const { user, isAuthenticated, loading } = useAuth();

  const [mongoUserId, setMongoUserId] = useState<string | null>(null);
  const [followers, setFollowers] = useState<ConnectionUser[]>([]);
  const [following, setFollowing] = useState<ConnectionUser[]>([]);
  const [discoverUsers, setDiscoverUsers] = useState<ConnectionUser[]>([]);
  const [connectionsLoading, setConnectionsLoading] = useState(false);
  const [profileUser, setProfileUser] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [discoverLoading, setDiscoverLoading] = useState(false);
  const [sentRequests, setSentRequests] = useState<string[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<string[]>([]);
  const [sentRequestUsers, setSentRequestUsers] = useState<ConnectionUser[]>([]);
  const [receivedRequestUsers, setReceivedRequestUsers] = useState<ConnectionUser[]>([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);

  useEffect(() => {
    async function fetchMongoUserId() {
      if (!isAuthenticated) return;
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
  }, [isAuthenticated]);

  const enhanceUsersWithFlags = (
    users: ConnectionUser[],
    followingIds: string[],
    sentReqs: string[],
    receivedReqs: string[]
  ): ConnectionUser[] => {
    return users.map((user) => ({
      ...user,
      isFollowedByUser: followingIds.includes(user._id),
      hasSentRequest: sentReqs.includes(user._id),
      hasReceivedRequest: receivedReqs.includes(user._id),
    }));
  };

  const normalizeEdgeUser = (userRef?: EdgeUserRef): ConnectionUser | null => {
    if (!userRef || typeof userRef === "string") return null;

    if (!userRef._id || !userRef.username || !userRef.firstName || !userRef.lastName) {
      return null;
    }

    return {
      _id: userRef._id,
      firstName: userRef.firstName,
      lastName: userRef.lastName,
      username: userRef.username,
      profilePhoto: userRef.profilePhoto,
      bio: userRef.bio,
      interests: userRef.interests,
      college: userRef.college,
      year: userRef.year,
      department: userRef.department,
    };
  };

  const fetchConnectionData = useCallback(async () => {
    if (!mongoUserId) return;

    setConnectionsLoading(true);

    try {
      const [followersRes, followingRes, requestsRes] = await Promise.all([
        fetch(`/api/connections/${mongoUserId}/followers`),
        fetch(`/api/connections/${mongoUserId}/following`),
        fetch(`/api/connections/requests`),
      ]);

      if (!followersRes.ok || !followingRes.ok || !requestsRes.ok) {
        throw new Error("Failed to fetch all data");
      }

      const [followersData, followingData, requestsData] = await Promise.all([
        followersRes.json(),
        followingRes.json(),
        requestsRes.json(),
      ]);

      const followersList: ConnectionUser[] = followersData.followers || followersData || [];
      const followingList: ConnectionUser[] = followingData.following || followingData || [];

      const sentEdges: ConnectionEdge[] = requestsData.sentRequests || [];
      const receivedEdges: ConnectionEdge[] = requestsData.receivedRequests || [];

      const sentIds = sentEdges
        .map((edge) => (typeof edge.toUser === "string" ? edge.toUser : edge.toUser?._id))
        .filter(Boolean) as string[];

      const receivedIds = receivedEdges
        .map((edge) => (typeof edge.fromUser === "string" ? edge.fromUser : edge.fromUser?._id))
        .filter(Boolean) as string[];

      const sentUsers = sentEdges
        .map((edge) => normalizeEdgeUser(edge.toUser))
        .filter(Boolean) as ConnectionUser[];

      const receivedUsers = receivedEdges
        .map((edge) => normalizeEdgeUser(edge.fromUser))
        .filter(Boolean) as ConnectionUser[];

      setFollowers((current) => {
        const enhancedFollowers = enhanceUsersWithFlags(
          followersList,
          followingList.map((u: ConnectionUser) => u._id),
          sentIds,
          receivedIds
        );

        if (JSON.stringify(current) === JSON.stringify(enhancedFollowers)) return current;
        return enhancedFollowers;
      });

      setFollowing((current) => {
        const enhancedFollowing = enhanceUsersWithFlags(
          followingList,
          followingList.map((u: ConnectionUser) => u._id),
          sentIds,
          receivedIds
        );

        if (JSON.stringify(current) === JSON.stringify(enhancedFollowing)) return current;
        return enhancedFollowing;
      });

      setSentRequests((current) => {
        if (JSON.stringify(current) === JSON.stringify(sentIds)) return current;
        return sentIds;
      });

      setReceivedRequests((current) => {
        if (JSON.stringify(current) === JSON.stringify(receivedIds)) return current;
        return receivedIds;
      });

      setSentRequestUsers((current) => {
        const enhancedSentUsers = enhanceUsersWithFlags(
          sentUsers,
          followingList.map((u: ConnectionUser) => u._id),
          sentIds,
          receivedIds
        );

        if (JSON.stringify(current) === JSON.stringify(enhancedSentUsers)) return current;
        return enhancedSentUsers;
      });

      setReceivedRequestUsers((current) => {
        const enhancedReceivedUsers = enhanceUsersWithFlags(
          receivedUsers,
          followingList.map((u: ConnectionUser) => u._id),
          sentIds,
          receivedIds
        );

        if (JSON.stringify(current) === JSON.stringify(enhancedReceivedUsers)) return current;
        return enhancedReceivedUsers;
      });

      setProfileUser(user);
    } catch {
      setFollowers([]);
      setFollowing([]);
      setProfileUser(null);
      setSentRequests([]);
      setReceivedRequests([]);
      setSentRequestUsers([]);
      setReceivedRequestUsers([]);
    } finally {
      setConnectionsLoading(false);
      setProfileLoading(false);
    }
  }, [mongoUserId, user]);

  useEffect(() => {
    async function fetchDiscoverUsers() {
      if (!mongoUserId) return;

      setDiscoverLoading(true);
      try {
        const res = await fetch("/api/fetchusers");
        if (!res.ok) throw new Error("Failed to fetch discover users");
        const data: ConnectionUser[] = await res.json();

        setDiscoverUsers(
          data
            .filter((u) => u._id !== mongoUserId)
            .map((user) => ({
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

  useEffect(() => {
    async function fetchRecommendations() {
      if (!mongoUserId) return;

      setRecommendationsLoading(true);

      try {
        const res = await fetch("/api/recommendations/users");
        if (!res.ok) throw new Error("Failed to fetch recommendations");
        const data = await res.json();
        if (!data) throw new Error("Failed to extract recommendation data");

        const recommendationsList: RecommendationItem[] = Array.isArray(data) ? data : data.data || [];
        setRecommendations(recommendationsList);
      } catch {
        setRecommendations([]);
      } finally {
        setRecommendationsLoading(false);
      }
    }

    fetchRecommendations();
  }, [mongoUserId]);

  const refreshConnections = () => {
    fetchConnectionData();
  };

  useEffect(() => {
    if (!loading && isAuthenticated && mongoUserId) {
      fetchConnectionData();
    }
  }, [loading, isAuthenticated, mongoUserId, fetchConnectionData]);

  const placeholderCount = 3;

  if (loading) {
    return (
      <main className="max-w-xl mx-auto p-6 space-y-6 animate-pulse">
        <Skeleton className="h-12 w-44" />
        {[...Array(placeholderCount)].map((_, i) => (
          <Skeleton key={i} className="h-40 rounded-lg" />
        ))}
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="bg-red-100 p-10 rounded text-red-700 font-semibold">
          Please sign in to view your connections.
        </div>
      </div>
    );
  }

  const filteredDiscoverUsers = discoverUsers
    .filter((user) => user._id !== mongoUserId)
    .filter((user) => !sentRequests.includes(user._id))
    .filter((user) => !receivedRequests.includes(user._id))
    .filter((user) => !following.some((f) => f._id === user._id))
    .map((user) => ({
      ...user,
      isFollowedByUser: following.some((f) => f._id === user._id),
      hasSentRequest: sentRequests.includes(user._id),
      hasReceivedRequest: receivedRequests.includes(user._id),
    }));

  const filteredRecommendationUsers = recommendations
    .filter((item) => item.user._id !== mongoUserId)
    .filter((item) => !sentRequests.includes(item.user._id))
    .filter((item) => !receivedRequests.includes(item.user._id))
    .filter((item) => !following.some((f) => f._id === item.user._id))
    .map((item) => ({
      ...item,
      user: {
        ...item.user,
        isFollowedByUser: following.some((f) => f._id === item.user._id),
        hasSentRequest: sentRequests.includes(item.user._id),
        hasReceivedRequest: receivedRequests.includes(item.user._id),
      },
    }));

  const followingTabUsers = [
    ...following,
    ...sentRequestUsers.filter(
      (reqUser) => !following.some((followUser) => followUser._id === reqUser._id)
    ),
  ];

  return (
    <main className="min-h-screen flex justify-center py-10 px-5 rounded-md">
      <section className="max-w-5xl w-full">
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
            <div className="w-full max-w-2xl mx-auto rounded-2xl shadow-lg mb-4">
              <UserProfileCard
                mongoId={mongoUserId || ""}
                username={profileUser.username}
                firstName={profileUser.firstName}
                lastName={profileUser.lastName}
                profilePhoto={profileUser.profilePhoto}
                bio={profileUser.bio}
                interests={profileUser.interests}
                followersCount={followers.length}
                followingCount={following.length + sentRequests.length}
                showActions={false}
              />
            </div>
          )
        )}

        <Tabs
          defaultValue="followers"
          className="w-full bg-white rounded-b-2xl shadow-md border border-gray-200 overflow-hidden"
        >
          <TabsList className="w-full grid grid-cols-4 bg-white border-b border-gray-200 h-11 rounded-none">
            <TabsTrigger
              value="followers"
              className="
                h-10
                rounded-none
                border-b-2
                border-transparent
                bg-transparent
                px-3
                text-sm
                font-semibold
                flex
                items-center
                justify-center
                gap-2
                transition-all
                data-[state=active]:bg-transparent
                data-[state=active]:shadow-none
                data-[state=active]:border-cyan-500
                data-[state=active]:text-cyan-600
              "
            >
              <Users size={20} /> <span>Followers ({followers.length})</span>
            </TabsTrigger>

            <TabsTrigger
              value="following"
              className="
                h-10
                rounded-none
                border-b-2
                border-transparent
                bg-transparent
                px-3
                text-sm
                font-semibold
                flex
                items-center
                justify-center
                gap-2
                transition-all
                data-[state=active]:bg-transparent
                data-[state=active]:shadow-none
                data-[state=active]:border-cyan-500
                data-[state=active]:text-cyan-600
              "
            >
              <UserCheck size={20} /> <span>Following ({following.length + sentRequests.length})</span>
            </TabsTrigger>

            <TabsTrigger
              value="discover"
              className="
                h-10
                rounded-none
                border-b-2
                border-transparent
                bg-transparent
                px-3
                text-sm
                font-semibold
                flex
                items-center
                justify-center
                gap-2
                transition-all
                data-[state=active]:bg-transparent
                data-[state=active]:shadow-none
                data-[state=active]:border-cyan-500
                data-[state=active]:text-cyan-600
              "
            >
              <Search size={20} /> <span>Discover</span>
            </TabsTrigger>

            <TabsTrigger
              value="requests"
              className="
                h-10
                rounded-none
                border-b-2
                border-transparent
                bg-transparent
                px-3
                text-sm
                font-semibold
                flex
                items-center
                justify-center
                gap-2
                transition-all
                data-[state=active]:bg-transparent
                data-[state=active]:shadow-none
                data-[state=active]:border-cyan-500
                data-[state=active]:text-cyan-600
              "
            >
              <Users size={20} /> <span>Requests ({receivedRequests.length})</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="followers" className="p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {connectionsLoading ? (
              [...Array(placeholderCount)].map((_, i) => <Skeleton key={i} className="h-48 rounded-lg" />)
            ) : followers.length === 0 ? (
              <p className="text-center col-span-full text-gray-500 py-16">No followers yet.</p>
            ) : (
              followers.map((user) => <UserCard key={user._id} user={user} refresh={refreshConnections} />)
            )}
          </TabsContent>

          <TabsContent value="following" className="p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {connectionsLoading ? (
              [...Array(placeholderCount)].map((_, i) => <Skeleton key={i} className="h-48 rounded-lg" />)
            ) : followingTabUsers.length === 0 ? (
              <p className="text-center col-span-full text-gray-500 py-16">You are not following anyone.</p>
            ) : (
              followingTabUsers.map((user) => <UserCard key={user._id} user={user} refresh={refreshConnections} />)
            )}
          </TabsContent>

          <TabsContent value="discover" className="p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {discoverLoading || recommendationsLoading ? (
              [...Array(placeholderCount)].map((_, i) => <Skeleton key={i} className="h-56 rounded-lg" />)
            ) : filteredRecommendationUsers.length > 0 ? (
              filteredRecommendationUsers.map((item) => (
                <div
                  key={item.user._id}
                  className="rounded-xl border border-cyan-100 bg-cyan-50/40 p-3 shadow-sm"
                >
                  <div className="mb-3 flex flex-wrap gap-2">
                    {item.reasons.slice(0, 3).map((reason) => (
                      <span
                        key={reason}
                        className="rounded-full bg-cyan-100 text-cyan-700 text-xs font-medium px-3 py-1"
                      >
                        {reason}
                      </span>
                    ))}
                  </div>

                  <UserCard user={item.user} refresh={refreshConnections} />
                </div>
              ))
            ) : filteredDiscoverUsers.length === 0 ? (
              <p className="text-center col-span-full text-gray-500 py-16">No users found to discover.</p>
            ) : (
              filteredDiscoverUsers.map((user) => <UserCard key={user._id} user={user} refresh={refreshConnections} />)
            )}
          </TabsContent>

          <TabsContent value="requests" className="p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {connectionsLoading ? (
              [...Array(placeholderCount)].map((_, i) => <Skeleton key={i} className="h-48 rounded-lg" />)
            ) : receivedRequestUsers.length === 0 ? (
              <p className="text-center col-span-full text-gray-500 py-16">No pending follow requests.</p>
            ) : (
              receivedRequestUsers.map((user) => (
                <UserCard
                  key={user._id}
                  user={{
                    ...user,
                    isFollowedByUser: following.some((f) => f._id === user._id),
                    hasSentRequest: sentRequests.includes(user._id),
                    hasReceivedRequest: true,
                  }}
                  refresh={refreshConnections}
                />
              ))
            )}
          </TabsContent>
        </Tabs>
      </section>
    </main>
  );
}