"use client";
import React, { useState, useEffect } from "react";
import { Trash2, Edit, Heart, MessageCircle, SendIcon, FileIcon } from "lucide-react";
import PostDialog from "./PostDialog";
import { IconHeartFilled } from "@tabler/icons-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"


// ---------- Types ----------
type CommentObj = {
  _id: string;
  textMessage: string;
  user: { firstName: string; lastName: string; userId: string } | null;
};

type Post = {
  _id: string;
  description: string;
  imageUrl?: string;
  user: { _id: string; firstName: string; lastName: string; userId: string };
  createdAt: string;
  likes?: string[];
  comments?: string[]; // We’ll now fetch the real comment objects separately!
};

type PostsProps = {
  currentUserId: string;
  userName?: string;
  userProfileImageUrl?: string;
};

// ---------- Component ----------
export default function Posts({ currentUserId, userName, userProfileImageUrl }: PostsProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [postToEdit, setPostToEdit] = useState<Post | null>(null);
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});
  const [commentBoxOpen, setCommentBoxOpen] = useState<{ [key: string]: boolean }>({});
  // Separate comments state per post for fetched comment objects
  const [commentsByPost, setCommentsByPost] = useState<{
    [postId: string]: { loading: boolean; error: string | null; comments: CommentObj[] }
  }>({});

  //save to notes
  const [saveToNotes , SetSaveToNotes] = useState(false);
  const [folderName , SetFolderName] = useState("");
  const [fileDescription , SetFileDescription] = useState("");
  const [selectedFileUrl , SetSelectedFileUrl] = useState("");

  // Fetch all posts - comments are only IDs here!
  
  // const fetchPosts = async () => {
  //   setLoading(true);
  //   try {
  //     const res = await fetch(`/api/posts/?mongoId=${currentUserId}`);
  //     const data = await res.json();
  //     setPosts(data);
  //   } catch (error) {
  //     console.error("Failed to fetch posts:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchPosts = async () => {
  setLoading(true);
  try {
    const res = await fetch(`/api/posts/?mongoId=${currentUserId}`);
    const data = await res.json();

    // ✅ Ensure data is an array
    if (Array.isArray(data)) {
      setPosts(data);
    } else {
      console.error("API did not return an array:", data);
      setPosts([]); // fallback: empty array
    }
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    setPosts([]); // prevent .map() error
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    if(!currentUserId) return;
    fetchPosts();
  }, [currentUserId]);

  // Fetch comments for a particular post
  const fetchCommentsForPost = async (postId: string) => {
    setCommentsByPost(prev => ({ ...prev, [postId]: { loading: true, error: null, comments: [] } }));
    try {
      const res = await fetch(`/api/metric/${postId}/comment`);
      if (!res.ok) throw new Error("Failed to fetch comments");
      const data = await res.json();
      setCommentsByPost(prev => ({
        ...prev,
        [postId]: { loading: false, error: null, comments: data }
      }));
    } catch (error) {
      setCommentsByPost(prev => ({
        ...prev,
        [postId]: { loading: false, error: "Could not load comments", comments: [] }
      }));
    }
  };

  const openEditDialog = (post: Post) => {
    setPostToEdit(post);
    setDialogOpen(true);
  };

  const handleDelete = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      const res = await fetch(`/api/posts/${postId}`, { method: "DELETE" });
      if (res.ok) {
        setPosts(prev => prev.filter(p => p._id !== postId));
      } else {
        alert("Failed to delete post");
      }
    } catch (error) {
      alert("Error deleting post");
      console.error(error);
    }
  };

  const handleLikes = async (postId: string) => {
    try {
      const res = await fetch(`/api/metric/${postId}`, { method: "POST" });
      if (!res.ok) {
        const errText = await res.text();
        console.error("Failed to Like/Unlike Post. Response:", res.status, errText);
      } else {
        await res.json();
        fetchPosts();
      }
    } catch (error) {
      console.error("Error Liking Post. Complete Error Message:", error);
    }
  };

  // POST comment, then reload comments for this post and refresh posts for count
  const handleComments = async (postId: string) => {
    const textMessage = commentInputs[postId];
    if (!textMessage || !textMessage.trim()) return;
    try {
      const res = await fetch(`/api/metric/${postId}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ textMessage }),
      });
      if (!res.ok) {
        console.log("Couldn't comment. Try Again Later.");
        return;
      }
      setCommentInputs(prev => ({ ...prev, [postId]: "" }));
      fetchCommentsForPost(postId); // Reload comments panel for this post
      fetchPosts(); // Refresh count in posts
    } catch (error) {
      console.error("Error adding comment. Complete Message:", error);
    }
  };

  const handleAddToNotes = async() => {
    if(!selectedFileUrl) return;
    await fetch(`/api/notes/${currentUserId}` , {
      method : "POST",
      headers: {"Content-Type" : "application/json"},
      body: JSON.stringify({
        fileUrl : selectedFileUrl , 
        description : fileDescription ,
        folder : folderName ,
        createdAt : new Date().toISOString()
      })
    });
    SetSelectedFileUrl("");
    SetFileDescription("");
    SetFolderName("");
    SetSaveToNotes(false);
  }


  // Show posts
  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <svg className="animate-spin h-10 w-10 text-cyan-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4}></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
        </svg>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 max-w-3xl mx-auto px-4 mt-2">
        {posts.map(post => {
          const isOwner = post.user?._id && currentUserId
            ? post.user._id.toString() === currentUserId.toString()
            : false;
          const isLiked = post.likes?.some(userId => userId === currentUserId);
          const commentCount = post.comments ? post.comments.length : 0;
          const commentState = commentsByPost[post._id] || { loading: false, error: null, comments: [] };

          return (
            <div
              key={post._id}
              className="bg-white rounded-xl shadow-md border border-gray-200 p-6 transition"
              style={{
                boxShadow: "0 1.5px 16px 0 rgba(6,182,212,0.12),0 2.5px 8px 0 rgba(6,182,212,0.04)",
                transition: "box-shadow 0.25s",
              }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 0 24px 4px #22d3ee,0 8px 24px 0 rgba(6,182,212,0.13)")}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 1.5px 16px 0 rgba(6,182,212,0.12),0 2.5px 8px 0 rgba(6,182,212,0.04)")}
            >
              {/* <div className="flex items-center gap-4 mb-3">

                <div className="w-12 h-12 bg-cyan-200 rounded-full flex items-center justify-center font-bold text-cyan-700 select-none">
                  {post.user.firstName?.[0] || post.user.userId?.[0] || "U"}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{post.user.firstName} {post.user.lastName}</p>
                  <p className="text-sm text-gray-500">@{post.user.userId}</p>
                  <p className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleString()}</p>
                </div>
              </div> */}


              <div className="flex items-center gap-4 mb-3">
                {post.user.profilePhoto ? (
                  // Use your own uploaded profile photo URL:
                <img
                src={post.user.profilePhoto}
                alt={`${post.user.firstName} ${post.user.lastName}`}
                className="w-12 h-12 rounded-full object-cover border border-cyan-200"
                width={48}
                height={48}
                loading="lazy"
                />
              ) : (
                // Fallback: circle with initial first letter if no photo
                <div className="w-12 h-12 bg-cyan-200 rounded-full flex items-center justify-center font-bold text-cyan-700 select-none">
                  {post.user.firstName?.[0] || post.user.userId?.[0] || "U"}
                </div>
                )}
                <div>
                  <p className="font-semibold text-gray-900">{post.user.firstName} {post.user.lastName}</p>
                  <p className="text-sm text-gray-500">@{post.user.userId}</p>
                  <p className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleString()}</p>
                </div>
              </div>


              <p className="text-gray-800 whitespace-pre-wrap">{post.description}</p>
              {post.imageUrl && (
                post.imageUrl.match(/\.(jpeg|jpg|png|gif|bmp|webp)$/i) ? (
                <img src={post.imageUrl} alt="Post media" className="mt-4 rounded-lg max-h-80 w-full object-cover" />
                ) : (
                <div className="mt-4 flex items-center gap-2 bg-cyan-50 border border-cyan-200 p-3 rounded">
                  <FileIcon className="w-6 h-6 text-cyan-600" />
                    <a
                      href={post.imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-700 underline font-medium"
                      download
                      onClick={e=>{
                          e.preventDefault();
                          SetSelectedFileUrl(post.imageUrl);
                          SetFileDescription(post.description || "Downloaded File");
                          SetSaveToNotes(true);
                          window.open(post.imageUrl , "_blank");
                        }
                      }
                      >
                      Download&nbsp;
                      {post.imageUrl.split("/").pop()?.slice(0, 40) || "file"}
                    </a>
                </div>
                )
              )}


              <div className="mt-4 flex items-center space-x-6 text-gray-600 text-base">
                <button
                  onClick={() => handleLikes(post._id)}
                  className="flex items-center gap-1 hover:text-cyan-600 transition focus:ring-2 focus:ring-cyan-400"
                  style={{ boxShadow: "0 0 8px 0 rgba(6,182,212,0.08)" }}
                >
                  {isLiked ? (
                    <IconHeartFilled className="w-5 h-5 text-red-500 border-0.5 border-red-600" />
                  ) : (
                    <Heart className="w-5 h-5" />
                  )}
                  {post.likes?.length || 0} Like
                </button>

                <button
                  onClick={() => {
                    setCommentBoxOpen(prev => ({
                      ...prev,
                      [post._id]: !prev[post._id]
                    }));
                    // Only fetch if opening (or not yet fetched)
                    if (!commentBoxOpen[post._id] || !commentsByPost[post._id])
                      fetchCommentsForPost(post._id);
                  }}
                  className="flex items-center gap-1 hover:text-cyan-600 transition focus:ring-2 focus:ring-cyan-400"
                  style={{ boxShadow: "0 0 8px 0 rgba(6,182,212,0.08)" }}
                  aria-label={`Toggle comments for post ${post._id}`}
                >
                  <MessageCircle className="w-5 h-5" />
                  {commentCount} Comment
                </button>

                <button className="flex items-center gap-1 hover:text-cyan-600 transition cursor-default">
                  <SendIcon className="w-5 h-5" />
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
              
              {/* --- Comments panel via GET /api/posts/[postId]/comment --- */}
              {commentBoxOpen[post._id] && (
                <div className="mt-4 border bg-cyan-100/50 border-cyan-200 rounded p-3 max-h-56 overflow-auto flex flex-col gap-3 glassmorphism">
                  <button
                    aria-label="Close comments"
                    onClick={() => setCommentBoxOpen(prev => ({ ...prev, [post._id]: false }))}
                    className="self-end text-gray-400 hover:text-red-600 text-xl"
                    style={{ lineHeight: 1, fontSize: "20px" }}
                  >
                    ×
                  </button>
                  <div className="flex flex-col gap-2">
                    {commentState.loading && (
                      <div className="mb-1 w-100 h-6">
                        <Skeleton className="w-full h-full rounded-md bg-gray-300/70 animate-pulse" />
                      </div>
                    )}
                    {commentState.error && <span className="text-xs text-red-600">{commentState.error}</span>}
                    {(commentState.comments ?? []).map((comment, idx) => (
                      <div key={comment && comment._id ? String(comment._id) : `comment-${idx}`} className="text-sm break-words">
                        <strong>
                          {comment?.user && comment.user.firstName
                            ? `${comment.user.firstName} ${comment.user.lastName}`
                            : "Unknown user"}
                          :
                        </strong>{" "}
                        {comment?.textMessage}
                      </div>
                    ))}
                  </div>

                  {/* COMMENT INPUT */}
                  <div className="flex gap-2 mt-auto">
                    <input
                      type="text"
                      className="flex-grow border rounded px-3 py-1 focus:outline-cyan-600"
                      placeholder="Add a comment..."
                      value={commentInputs[post._id] || ""}
                      onChange={e =>
                        setCommentInputs(prev => ({
                          ...prev,
                          [post._id]: e.target.value,
                        }))
                      }
                      onKeyDown={e => {
                        if (e.key === "Enter") handleComments(post._id);
                      }}
                    />
                    <button
                      className="bg-cyan-600 text-white rounded px-4 py-1 hover:bg-cyan-700"
                      onClick={() => handleComments(post._id)}
                    >
                      Send
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* PostDialog for create and edit */}
      <PostDialog
        open={dialogOpen}
        setOpen={open => {
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

      {/* Add the Notes Dialog */}
      <AlertDialog open={saveToNotes} onOpenChange={SetSaveToNotes}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Save this file to Notes ?</AlertDialogTitle>
            <AlertDialogDescription>
              Save this file to your notes ! Enter the folder name (optional) : 
            </AlertDialogDescription>
            <input 
              value={folderName} 
              onChange={e=> SetFolderName(e.target.value)}
              placeholder="Enter the folder name" 
              className="border px-2 py-1 rounded mt-2 w-full"  />
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => SetSaveToNotes(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleAddToNotes}>
              Add to Notes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}


