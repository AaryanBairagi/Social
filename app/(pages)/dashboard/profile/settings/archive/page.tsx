"use client";

import { useEffect, useState } from "react";
import Posts from "../../../_components/Posts";
import { IoMdArchive } from "react-icons/io";
import SectionHeader from "@/global/SectionHeader";
import { useAuth } from "@/contexts/AuthContext";


export default function ArchivePage() {
  const { user } = useAuth();
  const currentUserId = user?._id;

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUserId) return;

    const fetchArchivedPosts = async () => {
      try {
        const res = await fetch(
          `/api/posts/archive?userId=${currentUserId}`
        );

        if (!res.ok) throw new Error("Failed request");

        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error("Failed to fetch archive", err);
      } finally {
        setLoading(false);
      }
    };

    fetchArchivedPosts();
  }, [currentUserId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10 gap-4">
        <p className="text-gray-400">Loading Archived Posts</p>
        <svg className="animate-spin h-10 w-10 text-cyan-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4}></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
        </svg>
      </div>
    );
  }

  if (!posts.length) {
    return (
      <div className="text-center mt-10 text-gray-400">
        No archived posts found.
      </div>
    );
  }

  return (
    <>
      <SectionHeader
        title="Archived Posts"
        icon={<IoMdArchive className="w-7 h-7" />}
      />
    <div className="mt-7">
      <Posts
        currentUserId={currentUserId || ""}
        mode="self"
        initialPosts={posts}
        isArchiveView={true}
      />
    </div>
    </>
  );
}