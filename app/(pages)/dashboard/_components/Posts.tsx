"use client";
import React, { useState, useEffect } from "react";
import { Trash2 , Edit } from "lucide-react";
import PostDialog from "./PostDialog";

type Post = {
  _id: string;
  description: string;
  imageUrl?: string;
  user: { _id: string; firstName: string; lastName: string; userId: string };
  createdAt: string;
};

type PostsProps = {
  currentUserId: string;
  userName: string;
  userProfileImageUrl?: string;
};

export default function Posts({ currentUserId, userName, userProfileImageUrl }: PostsProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [postToEdit, setPostToEdit] = useState<Post | null>(null);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/posts");
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const openEditDialog = (post: Post) => {
    setPostToEdit(post);
    setDialogOpen(true);
  };

  const handleDelete = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const res = await fetch(`/api/posts/${postId}`, { method: "DELETE" });
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p._id !== postId));
      } else {
        alert("Failed to delete post");
      }
    } catch (error) {
      alert("Error deleting post");
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <svg
          className="animate-spin h-10 w-10 text-cyan-600"
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
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8z"
          ></path>
        </svg>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 max-w-3xl mx-auto px-4">
        {posts.map((post) => {
          const isOwner =
            post.user?._id && currentUserId
              ? post.user._id.toString() === currentUserId.toString()
              : false;

          return (
            <div
              key={post._id}
              className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg hover:ring-2 hover:ring-cyan-400 transition"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 bg-cyan-200 rounded-full flex items-center justify-center font-bold text-cyan-700 select-none">
                  {post.user.firstName?.[0] || post.user.userId?.[0] || "U"}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {post.user.firstName} {post.user.lastName}
                  </p>
                  <p className="text-sm text-gray-500">@{post.user.userId}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(post.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <p className="text-gray-800 whitespace-pre-wrap">{post.description}</p>
              {post.imageUrl && (
                <img
                  src={post.imageUrl}
                  alt="Post media"
                  className="mt-4 rounded-lg max-h-80 w-full object-cover"
                />
              )}

              <div className="mt-4 flex items-center space-x-6 text-gray-600 text-base">
                <button className="flex items-center gap-1 hover:text-cyan-600 transition cursor-default">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path d="M14 9l-5 5-5-5" />
                  </svg>
                  Like
                </button>
                <button className="flex items-center gap-1 hover:text-cyan-600 transition cursor-default">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path d="M17 8h2a2 2 0 012 2v7a2 2 0 01-2 2h-2M7 8H5a2 2 0 00-2 2v7a2 2 0 002 2h2" />
                    <path d="M12 12v6" />
                    <path d="M9 15h6" />
                  </svg>
                  Comment
                </button>
                <button className="flex items-center gap-1 hover:text-cyan-600 transition cursor-default">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 20l9-12H3l9 12z" />
                  </svg>
                  Share
                </button>

                {isOwner && (
                  <>
                    <button
                      onClick={() => openEditDialog(post)}
                      className="text-cyan-600 hover:underline ml-auto flex items-center gap-1"
                      aria-label="Edit post"
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="text-red-600 hover:underline flex items-center gap-1"
                      aria-label="Delete post"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* PostDialog for create and edit */}
      <PostDialog
        open={dialogOpen}
        setOpen={(open) => {
          if (!open) setPostToEdit(null);
          setDialogOpen(open);
        }}
        src={userProfileImageUrl}
        name={userName}
        currentUserId={currentUserId}
        mode={postToEdit ? "edit" : "create"}
        initialContent={postToEdit?.description}
        initialImageUrl={postToEdit?.imageUrl || ""}
        postIdToEdit={postToEdit?._id ?? ""}
        onSave={() => fetchPosts()}
      />
    </>
  );
}







