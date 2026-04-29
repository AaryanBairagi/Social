"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Heart, MessageCircle } from "lucide-react";

export default function SinglePostPage() {
  const params = useParams();
  const id = params?.id;
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/posts/${id}`);
        const data = await res.json();
        setPost(data);
      } catch (err) {
        console.error("Failed to fetch post", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-row justify-center items-center py-10 gap-4 h-[60vh]">
        <p className="text-gray-400">Loading Posts</p>
        <svg className="animate-spin h-10 w-10 text-cyan-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4}></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
        </svg>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-red-500">Post not found</p>
      </div>
    );
  }

  return (
    <div className="relative max-w-2xl mx-auto mt-6 p-4">
      <button onClick={() => router.push("/dashboard")}
          className="absolute top-2 right-2 z-10 bg-cyan-600 text-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-cyan-800 transition">
        ✕
      </button>

      <div className="bg-white rounded-xl shadow-md border p-5">

        {/* USER */}
        <div className="flex items-center gap-3 mb-3">
          {post.user?.profilePhoto ? (
            <img
              src={post.user.profilePhoto}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-300 rounded-full" />
          )}

          <div>
            <p className="font-semibold">
              {post.user?.firstName} {post.user?.lastName}
            </p>
            <p className="text-xs text-gray-500">
              @{post.user?.userId}
            </p>
          </div>
        </div>

        {/* CONTENT */}
        <p className="text-gray-800 whitespace-pre-wrap">
          {post.description}
        </p>

        {/* IMAGES */}
        {post.imageUrls?.length > 0 && (
          <div className="mt-4 flex flex-col gap-3">
            {post.imageUrls.map((url: string, idx: number) => (
              <img
                key={idx}
                src={url}
                className="rounded-lg max-h-80 object-cover"
              />
            ))}
          </div>
        )}

        {/*  ACTIONS (LIKE + COMMENT) */}
        <div className="mt-5 flex items-center gap-6 text-gray-600 text-sm cursor-not-allowed">

        {/* LIKE */}
        <div className="flex items-center gap-1">
         <Heart className="w-4 h-4" />
          {post.likes?.length || 0} Likes
        </div>

      {/* COMMENT */}
        <div className="flex items-center gap-1">
         <MessageCircle className="w-4 h-4" />
        {post.comments?.length || 0} Comments
        </div>

        </div>
      </div>
    </div>
  );
}