"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, UserCheck, Search } from "lucide-react";
import { UserCard } from "../../../../global/UserCard";
import { UserProfileCard } from "@/global/UserProfileCard";
import ConnectionGraph from "@/global/ConnectionGraph";

type ConnectionUser = {
  _id: string;
  firstName: string;
  lastName: string;
  userId: string;
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
      userId?: string;
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
  const { user, isSignedIn, isLoaded } = useUser();

  const [mongoUserId, setMongoUserId] = useState<string | null>(null);
  const [followers, setFollowers] = useState<ConnectionUser[]>([]);
  const [following, setFollowing] = useState<ConnectionUser[]>([]);
  const [discoverUsers, setDiscoverUsers] = useState<ConnectionUser[]>([]);
  // const [loading, setLoading] = useState<"followers" | "following" | "discover" | "requests" | null>(null);
  const [connectionsLoading, setConnectionsLoading] = useState(false);
  const [profileUser, setProfileUser] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [discoverLoading, setDiscoverLoading] = useState(false);
  const [sentRequests, setSentRequests] = useState<string[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<string[]>([]);
  const [sentRequestUsers, setSentRequestUsers] = useState<ConnectionUser[]>([]);
  const [receivedRequestUsers, setReceivedRequestUsers] = useState<ConnectionUser[]>([]);
  const [recommendationsLoading , SetRecommendationsLoading] = useState(false);
  const [recommendations , SetRecommendations] = useState<RecommendationItem[]>([]);
  const [graphData , setGraphData] = useState<any>(null);
  const [showGraph , setShowGraph] = useState(false);
  const [graphLoading , setGraphLoading] = useState(false);


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

    if (!userRef._id || !userRef.userId || !userRef.firstName || !userRef.lastName) {
      return null;
    }

    return {
      _id: userRef._id,
      firstName: userRef.firstName,
      lastName: userRef.lastName,
      userId: userRef.userId,
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
      const [followersRes, followingRes, requestsRes, profileRes] = await Promise.all([
        fetch(`/api/connections/${mongoUserId}/followers`),
        fetch(`/api/connections/${mongoUserId}/following`),
        fetch(`/api/connections/requests`),
        fetch(`/api/user/profile?clerkId=${user?.id}`),
      ]);

      if (!followersRes.ok || !followingRes.ok || !requestsRes.ok || !profileRes.ok) {
        throw new Error("Failed to fetch all data");
      }

      const [followersData, followingData, requestsData, profileData] = await Promise.all([
        followersRes.json(),
        followingRes.json(),
        requestsRes.json(),
        profileRes.json(),
      ]);

      const followersList: ConnectionUser[] = followersData.followers || followersData || [];
      const followingList: ConnectionUser[] = followingData.following || followingData || [];

      const sentEdges: ConnectionEdge[] = requestsData.sentRequests || [];
      const receivedEdges: ConnectionEdge[] = requestsData.receivedRequests || [];

      const sentIds = sentEdges
        .map((edge) =>
          typeof edge.toUser === "string" ? edge.toUser : edge.toUser?._id
        )
        .filter(Boolean) as string[];

      const receivedIds = receivedEdges
        .map((edge) =>
          typeof edge.fromUser === "string" ? edge.fromUser : edge.fromUser?._id
        )
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

      setProfileUser((current: any) => {
        if (JSON.stringify(current) === JSON.stringify(profileData)) return current;
        return profileData;
      });
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
  }, [mongoUserId, user?.id]);

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

  useEffect(()=>{
    async function fetchRecommendations(){
      if(!mongoUserId) return;
      
      SetRecommendationsLoading(true)

      try{
        const res = await fetch("/api/recommendations/users");
        if(!res.ok) throw new Error("Failed to fetch recommendations");
        const data = await res.json();
        if(!data) throw new Error("Failed to extract recommendation data");

        const recommendationsList : RecommendationItem[] = Array.isArray(data) ? data : data.data || [];
        SetRecommendations(recommendationsList);
      }
      catch{
        SetRecommendations([]);
      }
      finally{
        SetRecommendationsLoading(false);
      }
    }

    fetchRecommendations();
  },[mongoUserId]);


  const refreshConnections = () => {
    fetchConnectionData();
  };

  useEffect(() => {
    if (isLoaded && isSignedIn && mongoUserId) {
      fetchConnectionData();
    }
  }, [isLoaded, isSignedIn, mongoUserId, fetchConnectionData]);

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
      user : {
      ...item.user,
      isFollowedByUser: following.some((f) => f._id === item.user._id),
      hasSentRequest: sentRequests.includes(item.user._id),
      hasReceivedRequest: receivedRequests.includes(item.user._id),
      }
    }))

  const followingTabUsers = [
  ...following,
  ...sentRequestUsers.filter(
    (reqUser) => !following.some((followUser) => followUser._id === reqUser._id)
  ),
];

const loadGraph = async() => {
  if(!mongoUserId) return;

  setGraphLoading(true);
  try{
    const res = await fetch(`/api/graph?userId=${mongoUserId}`);
    if(!res.ok) console.log("Failed to fetch graph data");
    const data = await res.json();
    setGraphData(data);
  }catch(error){
    setGraphData(null);
    console.error("Error loading graph data:", error);
  }
  finally{
    setGraphLoading(false);
  }
}

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
              mongoId={mongoUserId || ""}
              userId={profileUser.userId}
              firstName={profileUser.firstName}
              lastName={profileUser.lastName}
              profilePhoto={profileUser.profilePhoto}
              bio={profileUser.bio}
              interests={profileUser.interests}
              followersCount={followers.length}
              followingCount={following.length + sentRequests.length}
              showActions={false}
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
              <UserCheck size={20} /> <span>Following ({following.length + sentRequests.length})</span>
            </TabsTrigger>

            <TabsTrigger
              value="discover"
              className="flex items-center space-x-2 font-semibold text-lg px-4 py-3 data-[state=active]:border-b-2 data-[state=active]:border-cyan-600 data-[state=active]:text-gray-400"
            >
              <Search size={20} /> <span>Discover</span>
            </TabsTrigger>

            <TabsTrigger
              value="requests"
              className="flex items-center space-x-2 font-semibold text-lg px-4 py-3 data-[state=active]:border-b-2 data-[state=active]:border-cyan-600 data-[state=active]:text-cyan-700"
            >
              <Users size={20} /> <span>Requests ({receivedRequests.length})</span>
            </TabsTrigger>

              <button 
              onClick = {() => {
                setShowGraph(true);
                loadGraph();
              }}
              className="ml-auto mr-4 p-2 rounded-lg bg-cyan-600 text-white/80 hover:text-white/40 hover:bg-cyan-700 transition-colors duration-200 flex items-center space-x-1 data-[state=active]:bg-cyan-700 data-[state=active]:text-white"
            >
              Visualize Connections
            </button>

          </TabsList>

          <TabsContent
            value="followers"
            className="p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
          >
            {connectionsLoading ? (
              [...Array(placeholderCount)].map((_, i) => (
                <Skeleton key={i} className="h-48 rounded-lg" />
              ))
            ) : followers.length === 0 ? (
              <p className="text-center col-span-full text-gray-500 py-16">
                No followers yet.
              </p>
            ) : (
              followers.map((user) => (
                <UserCard key={user._id} user={user} refresh={refreshConnections} />
              ))
            )}
          </TabsContent>

          <TabsContent
            value="following"
            className="p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
          >
            {connectionsLoading ? (
              [...Array(placeholderCount)].map((_, i) => (
                <Skeleton key={i} className="h-48 rounded-lg" />
              ))
            ) : followingTabUsers.length === 0 ? (
              <p className="text-center col-span-full text-gray-500 py-16">
                You are not following anyone.
              </p>
            ) : (
              followingTabUsers.map((user) => (
                <UserCard key={user._id} user={user} refresh={refreshConnections} />
              ))
            )}
          </TabsContent>


          <TabsContent
            value="discover"
            className="p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
          >
          {discoverLoading || recommendationsLoading ? (
          [...Array(placeholderCount)].map((_, i) => (
            <Skeleton key={i} className="h-56 rounded-lg" />
          ))
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
          <p className="text-center col-span-full text-gray-500 py-16">
            No users found to discover.
          </p>
          ) : (
          filteredDiscoverUsers.map((user) => (
            <UserCard key={user._id} user={user} refresh={refreshConnections} />
            ))
          )}
          </TabsContent>

          <TabsContent
            value="requests"
            className="p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
          >
            {connectionsLoading ? (
              [...Array(placeholderCount)].map((_, i) => (
                <Skeleton key={i} className="h-48 rounded-lg" />
              ))
            ) : receivedRequestUsers.length === 0 ? (
              <p className="text-center col-span-full text-gray-500 py-16">
                No pending follow requests.
              </p>
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

      {showGraph && (
  <div className="fixed inset-0 z-50 flex items-center justify-center">

    {/* BACKDROP */}
    <div
      className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      onClick={() => setShowGraph(false)}
    />

    {/* MODAL */}
    <div className="relative z-50 w-[90%] max-w-5xl">

      <div className="bg-black rounded-xl p-4 shadow-2xl">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-3 text-white">
          <h2 className="text-lg font-semibold">Connection Graph 🌐</h2>
          <button
            onClick={() => setShowGraph(false)}
            className="text-gray-300 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* CONTENT */}
        {graphLoading ? (
          <div className="h-[500px] flex items-center justify-center text-white">
            Loading graph...
          </div>
        ) : graphData ? (
          <ConnectionGraph data={graphData} />
        ) : (
          <div className="h-[500px] flex items-center justify-center text-white">
            Failed to load graph
          </div>
        )}
      </div>

    </div>
  </div>
)}

    </main>
  );
}

