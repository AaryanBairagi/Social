"use client";

import React, { useEffect, useState } from "react";
import { UserProfileCard } from "../../../global/UserProfileCard";
import PostsComponent from "../../../global/PostsComponent";
import { useParams } from "next/navigation";
import Navbar from "@/global/Navbar";
import { SideBar } from "@/global/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Lock } from "lucide-react";

type Post = {
  _id: string;
  description: string;
  imageUrls?: string[];
  createdAt?: string;
};

type ProfileData = {
  mongoId: string;
  userId: string;
  firstName: string;
  lastName: string;
  bio?: string;
  profilePhoto?: string;
  interests?: string[];
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
  isRequestPending: boolean;
  isRequestSent: boolean;
  recentPosts?: Post[];
  isFollowedByUser?: boolean;
  hasSentRequest?: boolean;
  hasReceivedRequest?: boolean;
};

export default function UserProfileView() {
  const params = useParams();

  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      setLoadingProfile(true);

      try {
        const res = await fetch(`/api/profile/${params?.userId}`);
        if (!res.ok) throw new Error("Failed to fetch profile");

        const data = await res.json();

        setProfileData({
          ...data,
          isFollowedByUser: data.isFollowing,
          hasSentRequest: data.isRequestSent,
          hasReceivedRequest: data.isRequestPending,
        });

        setPosts(data.recentPosts || []);
      } catch (err) {
        console.error("Profile fetch error:", err);
        setProfileData(null);
        setPosts([]);
      } finally {
        setLoadingProfile(false);
        setLoadingPosts(false);
      }
    }

    if (params?.userId) {
      fetchProfile();
    }
  }, [params?.userId]);

  if (loadingProfile) {
    return (           
      <div className="flex justify-center gap-4 items-center py-10">
        <p className="font-semibold text-cyan-600 text-lg">
          Loading profile, please wait...
        </p>
        <svg className="animate-spin h-10 w-10 text-cyan-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4}></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
        </svg>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-700">
        Profile not found.
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <SidebarProvider>
        <div className="flex min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100">
          <SideBar />

          {/* MAIN CONTENT */}
          <div className="flex-1 flex flex-col mt-12 items-center px-6 md:px-10 py-10 w-full">

            {/* PROFILE CARD (CENTERED) */}
            <div className="w-full max-w-3xl mt-12 mb-10">
              <div className="bg-cyan-200 rounded-2xl shadow-lg p-6 sm:p-10 border border-cyan-100 backdrop-blur-sm hover:shadow-cyan-100/40 transition-all duration-300">
                <UserProfileCard
                  profilePhoto={profileData.profilePhoto}
                  userId={profileData.userId}
                  mongoId={profileData.mongoId}
                  firstName={profileData.firstName}
                  lastName={profileData.lastName}
                  bio={profileData.bio}
                  interests={profileData.interests}
                  followersCount={profileData.followersCount}
                  followingCount={profileData.followingCount}
                  isFollowedByUser={profileData.isFollowedByUser}
                  hasSentRequest={profileData.hasSentRequest}
                  hasReceivedRequest={profileData.hasReceivedRequest}
                  showActions={true}
                  onFollowChange={(type) => {
                    setProfileData((prev) => {
                      if (!prev) return prev;

                      if (type === "follow") {
                        return {
                          ...prev,
                          hasSentRequest: true,
                          hasReceivedRequest: false,
                          isFollowedByUser: false,
                        };
                      }

                      if (type === "accept") {
                        return {
                          ...prev,
                          hasSentRequest: false,
                          hasReceivedRequest: false,
                        };
                      }

                      if (type === "unfollow") {
                        return {
                          ...prev,
                          followersCount: Math.max(0, prev.followersCount - 1),
                          isFollowedByUser: false,
                          hasSentRequest: false,
                          hasReceivedRequest: false,
                          isFollowing: false,
                        };
                      }

                      return prev;
                    });
                  }}
                />
              </div>
            </div>

            {/* POSTS SECTION (LIKE CONNECTIONS PAGE) */}
            <div className="w-full max-w-6xl bg-white rounded-2xl shadow-md p-6 sm:p-8 border border-gray-200">

              {profileData.isFollowing ? (
                <>
                  {loadingPosts ? (
                    <div className="flex flex-col items-center mt-10 space-y-3">
                      <div className="animate-pulse h-6 w-32 bg-cyan-100 rounded"></div>
                      <div className="animate-pulse h-20 w-full bg-cyan-50 rounded-lg"></div>
                    </div>
                  ) : posts.length > 0 ? (
                    <>
                      <h2 className="text-2xl font-semibold mb-6 text-cyan-800 text-center">
                        Recent Posts
                      </h2>

                      {/* GRID LAYOUT POSTS */}
                      <PostsComponent posts={posts} />
                    </>
                  ) : (
                    <p className="mt-6 text-center text-gray-500 italic">
                      No recent posts yet.
                    </p>
                  )}
                </>
              ) : (
                <p className="mt-8 text-center text-gray-500 italic flex items-center justify-center gap-2">
                  Follow this user to see their posts
                  <Lock className="w-4 h-4" />
                </p>
              )}

            </div>

          </div>
        </div>
      </SidebarProvider>
    </>
  );
}
