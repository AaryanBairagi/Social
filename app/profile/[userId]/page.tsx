"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import Navbar from "@/global/Navbar";
import { SideBar } from "@/global/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { UserProfileCard } from "@/global/UserProfileCard";
import PostsComponent from "@/global/PostsComponent";

import { Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

type Post = {
  _id: string;
  description: string;
  imageUrls?: string[];
  createdAt?: string;
};

type ProfileData = {
  mongoId: string;
  username: string;
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
  const router = useRouter();

  const { user } = useAuth();

  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  const [posts, setPosts] = useState<Post[]>([]);

  const [loadingProfile, setLoadingProfile] = useState(true);

  const [loadingPosts, setLoadingPosts] = useState(true);

  // -----------------------------
  // Fetch Profile
  // -----------------------------

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoadingProfile(true);

        const res = await fetch(`/api/profile/${params?.userId}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch profile");
        }

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

  // -----------------------------
  // Redirect if viewing yourself
  // -----------------------------

  useEffect(() => {
    if (!profileData || !user) return;

    if (profileData.mongoId === user._id) {
      router.replace("/dashboard/connections");
    }
  }, [profileData, user, router]);

  // -----------------------------
  // Loading
  // -----------------------------

  if (loadingProfile) {
    return (
      <div className="flex h-screen items-center justify-center bg-cyan-50">
        <div className="flex items-center gap-4 rounded-xl bg-white px-8 py-5 shadow-lg">
          <svg
            className="h-8 w-8 animate-spin text-cyan-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth={4}
            />

            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>

          <span className="font-medium text-gray-700">
            Loading profile...
          </span>
        </div>
      </div>
    );
  }

  // -----------------------------
  // Not Found
  // -----------------------------

  if (!profileData) {
    return (
      <div className="flex h-screen items-center justify-center bg-cyan-50">
        <div className="rounded-xl bg-white px-10 py-8 shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-700">
            Profile not found
          </h2>
        </div>
      </div>
    );
  }
  return (
  <>
    <Navbar />

    <SidebarProvider defaultOpen>
      <div className="min-h-screen bg-[#e0f7fa] w-full">

        <SideBar />

        {/* ================= MAIN CONTENT ================= */}
        <main
          className="
            ml-40
            mt-[120px]
            min-h-[calc(100vh-120px)]
            p-8
            max-w-full
            flex justify-center
          "
        >
          <div className="w-full max-w-5xl">

            {/* ================= PROFILE CARD ================= */}

            <div className="w-full max-w-2xl mx-auto mb-8">
            <UserProfileCard
              profilePhoto={profileData.profilePhoto}
              username={profileData.username}
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
              isOwnProfile={profileData.mongoId === user?._id}
              showActions={true}
              onFollowChange={(type) => {
                setProfileData((prev) => {
                  if (!prev) return prev;

                  switch (type) {
                    case "follow":
                      return {
                        ...prev,
                        hasSentRequest: true,
                        hasReceivedRequest: false,
                        isFollowedByUser: false,
                      };

                    case "accept":
                      return {
                        ...prev,
                        hasReceivedRequest: false,
                        hasSentRequest: false,
                        isFollowedByUser: true,
                        isFollowing: true,
                        followersCount: prev.followersCount + 1,
                      };

                    case "unfollow":
                      return {
                        ...prev,
                        isFollowedByUser: false,
                        hasSentRequest: false,
                        hasReceivedRequest: false,
                        isFollowing: false,
                        followersCount: Math.max(
                          0,
                          prev.followersCount - 1
                        ),
                      };

                    default:
                      return prev;
                  }
                });
              }}
            />
            </div>
            {/* ================= POSTS CARD ================= */}

            <div className="w-full max-w-5xl mx-auto">

            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">

              {/* Header */}

              <div className="flex items-center justify-between border-b border-gray-200 px-8 py-5">

                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Recent Posts
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Latest posts shared by {profileData.firstName}
                  </p>
                </div>

              </div>

              {/* Body */}

              <div className="p-8">

                {profileData.isFollowing ? (

                  loadingPosts ? (

                    <div className="flex justify-center py-16">

                      <svg
                        className="h-10 w-10 animate-spin text-cyan-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth={4}
                        />

                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        />
                      </svg>

                    </div>

                  ) : posts.length > 0 ? (

                    <PostsComponent posts={posts} />

                  ) : (

                    <div className="py-20 text-center">

                      <h3 className="text-lg font-semibold text-gray-700">
                        No Posts Yet
                      </h3>

                      <p className="mt-2 text-gray-500">
                        This user hasn't shared anything yet.
                      </p>

                    </div>

                  )

                ) : (

                  <div className="flex flex-col items-center justify-center py-20">

                    <div className="mb-5 rounded-full bg-cyan-50 p-5">

                      <Lock className="h-8 w-8 text-cyan-600" />

                    </div>

                    <h3 className="text-xl font-semibold text-gray-800">
                      Posts are Private
                    </h3>

                    <p className="mt-3 max-w-md text-center text-gray-500">
                      Follow this user to unlock their recent posts and activity.
                    </p>

                  </div>

                )}

              </div>

            </section>
            </div>

          </div>
        </main>

      </div>
    </SidebarProvider>
  </>
);
}