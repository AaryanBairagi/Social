"use client";
import React, { useState, useEffect } from "react";
import { Trash2, Edit, Heart, MessageCircle, SendIcon, FileIcon, Save, SaveIcon , Link, Share } from "lucide-react";
import PostDialog from "./PostDialog";
import { IconArrowBigRightFilled, IconHeartFilled , IconArrowBigLeftFilled } from "@tabler/icons-react";
import { Skeleton } from "@/components/ui/skeleton";
import { FaWhatsapp, FaInstagram, FaTwitter } from "react-icons/fa";
import { FaTelegram } from "react-icons/fa6";
import { IoMdArchive } from "react-icons/io";
import { FaRegBookmark } from "react-icons/fa6";


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
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// ---------- Types ----------
type CommentObj = {
  _id: string;
  textMessage: string;
  user: { firstName: string; lastName: string; username: string; profilePhoto?: string } | null;
};

type Post = {
  _id: string;
  description: string;
  imageUrls?: string[];
  user: { _id: string; firstName: string; lastName: string; username: string; profilePhoto?: string };
  createdAt: string;
  likes?: string[];
  comments?: string[]; // We’ll now fetch the real comment objects separately!
  type?: "post" | "event";
  eventDate?: string;
  savedBy?: string[];
  fileTypes?: string[]; 
  fileNames?: string[]; 
  savedPostsBy?: string[]; // For posts that are saved by users (if needed)
  isArchived?: boolean;
};

type PostsProps = {
  currentUserId: string;
  userName?: string;
  userProfileImageUrl?: string;
  mode?: "feed" | "self" | "liked";
  initialPosts?: Post[];
  isArchiveView?: boolean;
  isSavedView?:boolean;
};

// ---------- Component ----------
export default function Posts({ currentUserId, userName , userProfileImageUrl , mode , initialPosts , isArchiveView = false, isSavedView = false  }: PostsProps) {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>(initialPosts || []);
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

  //fetch older posts 
  const [oldFetch , SetOldFetch] = useState(false);

  //prev and next image implementation
  const [ currentImageIndex , SetCurrentImageIndex ]  = useState<Record<string,number>>({});

  //delete posts
  const [deletePostId , setDeletePostId] = useState<string | null>(null);

  //preview Image
  const [previewImage , setPreviewImage] = useState<{
    postId : string,
    url : string
  } | null>(null); 

  const[sharePost , setSharePost] = useState<string | null>(null);

  const getTimeLeft = (eventDate: string) => {
    const diff = new Date(eventDate).getTime() - new Date().getTime();

    if (diff <= 0) return "Event Started";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);

    return `${days}d ${hours}h left`;
  };


  const handleSaveEvent = async (postId: string) => {
  try {
    const res = await fetch(`/api/events/save/${postId}`, {
      method: "POST",
    });

    const data = await res.json();

    if (data.success) {
      if (data.saved) {
        toast.success("Event saved", {
          description: "Check your Events section",
        });
      } else {
        toast("Event removed", {
          description: "Removed from your saved events",
        });
      }

      fetchPosts(); // refresh UI
    }

  } catch (err) {
    toast.error("Something went wrong");
    console.error("Failed to save event");
  }
  };


  const fetchPosts = async (lastCreatedAt : string | null = null) => {
  setLoading(true);
  try {
    // let url = mode === 'self' ? `/api/posts/self?mongoId=${currentUserId}` : `/api/posts/?mongoId=${currentUserId}`;

    let url = "";

    if (mode === "self") {
      url = `/api/posts/self?mongoId=${currentUserId}`;
    } 
    else if (mode === "liked") {
      // 🚫 DO NOTHING — already passed via initialPosts
      return;
    }
    else {
      url = `/api/posts/?mongoId=${currentUserId}`;
    }

    if(lastCreatedAt){
      url += `&lastCreatedAt=${encodeURIComponent(lastCreatedAt)}`
    }

    const res = await fetch(url);
    const data = await res.json();

    if (Array.isArray(data)) {
      if(lastCreatedAt){
        setPosts((prev)=> [...prev, ...data]);
      }else{
        setPosts(data);
      }

      if(data.length===0){
        SetOldFetch(false);
      }else{
        SetOldFetch(true);
      }

    } else {
      console.error("API did not return an array:", data);
      SetOldFetch(false);
      setPosts([]); 
    }
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    setPosts([]); 
    SetOldFetch(false); 
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    if(mode==='liked' && initialPosts){
      setPosts(initialPosts);
      setLoading(false);
      return;
    }

    if(!currentUserId) return;
    fetchPosts(null);
  }, [currentUserId , initialPosts]);


  const loadOlderPosts = ()=>{
    if(posts.length===0) return;
    const lastCreatedAt = posts[posts.length-1].createdAt;
    fetchPosts(lastCreatedAt);
  }

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
    try {
      const res = await fetch(`/api/posts/${postId}`, { method: "DELETE" });

      if (res.ok) {
        setPosts(prev => prev.filter(p => p._id !== postId));
        toast.success("Post deleted", {
          description: "Your post has been removed",
        });
      } else {
        toast.error("Failed to delete post");
      }
    } catch (error) {
      alert("Error deleting post");
      console.error(error);
    }
  };

  const handleLikes = async (postId: string) => {
    setPosts((prevPosts) =>
    prevPosts.map((post) => {
      if (post._id !== postId) return post;

      const alreadyLiked = post.likes?.includes(currentUserId);

      return {
        ...post,
        likes: alreadyLiked
          ? post.likes?.filter((id) => id !== currentUserId)
          : [...(post.likes || []), currentUserId],
      };
    })
    );

    try {
      const res = await fetch(`/api/metric/${postId}`, { method: "POST" });
      if (!res.ok) {
        const errText = await res.text();
        console.error("Failed to Like/Unlike Post. Response:", res.status, errText);
      } else {
        await res.json();
        // fetchPosts();
      }
    } catch (error) {
      console.error("Error Liking Post. Complete Error Message:", error);
      fetchPosts();
    }
  };

  const handleComments = async (postId: string) => {
    const textMessage = commentInputs[postId];
    if (!textMessage || !textMessage.trim()) return;
    const newComment = {
      _id : Math.random().toString(),
      textMessage,
      user:{
        firstName : "You",
        lastName : "",
        username:  currentUserId
      }
    };

    setCommentsByPost((prev)=>({
      ...prev,
    [postId]: {
      ...prev[postId],
      comments: [...(prev[postId]?.comments || []), newComment]
    }
    }));
  
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
    } catch (error) {
      console.error("Error adding comment. Complete Message:", error);
      fetchPosts(); // Refresh count as rollback if failed.
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
    toast.success("Saved to Notes", {
      description: "File added to your notes successfully",
    });
    SetSelectedFileUrl("");
    SetFileDescription("");
    SetFolderName("");
    SetSaveToNotes(false);
  }

  const handleSavePost = async (postId: string) => {
  try {
    const res = await fetch("/api/posts/get-save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ postId, userId: currentUserId }),
    });

    const data = await res.json();

    if (data.success) {
      toast.success(data.saved ? "Post saved" : "Removed from saved");

      setPosts(prev =>
        prev.map(p => {
          if (p._id !== postId) return p;

          const alreadySaved = p.savedPostsBy?.includes(currentUserId);

          return {
            ...p,
            savedPostsBy: alreadySaved
              ? p.savedPostsBy?.filter(id => id !== currentUserId)
              : [...(p.savedPostsBy || []), currentUserId],
          };
        })
      );
    }
  } catch (err) {
    toast.error("Failed to save post");
  }
  };

  const handleArchivePost = async (postId: string) => {
  try {
    const res = await fetch("/api/posts/archive", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ postId }),
    });

    const data = await res.json();

    if (data.success) {
      toast.success("Post archived");

      setPosts(prev => prev.filter(p => p._id !== postId));
    }
  } catch (err) {
    toast.error("Failed to archive post");
    console.error(err);
  }
  };

  const handleUnarchivePost = async (postId : string) => {
    try{
      const res = await fetch('/api/posts/archive',{
        method : "PATCH",
        headers : {
          "Content-Type" : "application/json"
        },
        body : JSON.stringify({ postId , unarchive : true})
      });

      const data = await res.json();
      if(data.success){
        toast.success("Post unarchived");
        setPosts(prev=> prev.filter(p=>p._id!=postId));
      }
    } 
    catch(error){
      console.error("failed to unarchive Posts" , error);
      toast.error("Failed to unarchive post");
    }
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
        { posts.map(post => {
          const isOwner = post.user?._id && currentUserId
            ? post.user._id.toString() === currentUserId.toString()
            : false;
          const isLiked = post.likes?.some(userId => userId === currentUserId);
          const commentCount = post.comments ? post.comments.length : 0;
          const commentState = commentsByPost[post._id] || { loading: false, error: null, comments: [] };
          const isSaved = post.savedBy?.includes(currentUserId);
          const isSavedPost = post?.savedPostsBy?.includes(currentUserId);

          return (
            <div
              key={post._id}
              className="relative bg-white rounded-xl shadow-md border border-gray-200 p-6 transition"
              style={{
                boxShadow: "0 1.5px 16px 0 rgba(6,182,212,0.12),0 2.5px 8px 0 rgba(6,182,212,0.04)",
                transition: "box-shadow 0.25s",
              }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 0 24px 4px #22d3ee,0 8px 24px 0 rgba(6,182,212,0.13)")}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 1.5px 16px 0 rgba(6,182,212,0.12),0 2.5px 8px 0 rgba(6,182,212,0.04)")}
            >
              
            {/*  EVENT BADGE */}
          <div className="flex justify-between items-start mb-2">
    
          {/* LEFT: EVENT badge */}
          {post.type === "event" && (
            <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded font-bold">
              EVENT
            </span>
          )}

          {/* RIGHT: actions */}
          <div className="flex items-center gap-2 ml-auto">
          {/* SAVE POST */}
          {/* if it s archived then no save  */}
          {post.type === "post" && !isArchiveView && (
            <button
              onClick={() => handleSavePost(post._id)}
              className={`flex items-center gap-1  transition ${isSavedPost ? "text-cyan-600" : "text-gray-600 hover:text-cyan-600"}`}
            >
            <FaRegBookmark
              className={`w-3 h-3 ${
              isSavedPost ? "text-cyan-600 fill-cyan-500" : ""
              }`}
            />
            {isSavedView ? "Unsave" : isSavedPost ? "Saved" : "Save"}
          </button>
          )}

        {isOwner && post.type === "post" && (
          <button
            onClick={() => handleArchivePost(post._id)}
            className="flex items-center text-gray-600 gap-1 hover:text-cyan-600 transition-colors duration-300 "
          >
            <IoMdArchive className="w-4 h-4" />
          Archive
          </button>
        )}

        {isArchiveView && (
        <button
          onClick={() => handleUnarchivePost(post._id)}
          className="flex items-center gap-1 text-green-500 hover:text-green-600 transition-colors duration-300"
        >
        <IoMdArchive className="w-5 h-5 rotate-180" />
          Unarchive
        </button>
        )}

          {/*  SAVE (only non-owner) */}
          {post.type === "event" && !isOwner && (
            <button
              onClick={() => !isSaved && handleSaveEvent(post._id)}
              className={`flex items-center gap-1 text-sm font-medium
                ${isSaved ? "text-gray-400 cursor-not-allowed" : "text-cyan-500 hover:underline hover:text-cyan-600"}`}
              title="Save Event"
            >
              <SaveIcon size={16} />
              {isSaved ? "Saved!" : "Save Event"}
            </button>
          )}
          </div>
          </div>

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
                  {post.user.firstName?.[0] || post.user.username?.[0] || "U"}
                </div>
                )}
                <div>
                  <p className="font-semibold text-gray-900">{post.user.firstName} {post.user.lastName}</p>
                  <p className="text-sm text-gray-500">@{post.user.username}</p>
                  {/* TIMER */}
                  {post.type === "event" && post.eventDate && (
                    <p className="text-sm text-red-500 font-semibold">
                      ⏳ {getTimeLeft(post.eventDate)}
                    </p>
                  )}
                  <p className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleString()}</p>
                </div>
              </div>


              <p className="text-gray-800 whitespace-pre-wrap">{post.description}</p>

              {post.imageUrls && post.imageUrls.length > 0 && (
              <div className="mt-4 flex flex-col gap-4">

              {/* Separate images from non-images */}
              {(() => {
                const images = post.imageUrls.filter((_, idx) =>
                  post.fileTypes?.[idx] === "image"
                );

                const files = post.imageUrls.filter((_, idx) =>
                  post.fileTypes?.[idx] !== "image"
                );

              return (
              <>
              {/* Image carousel */}
              {images.length > 0 && (
              <div className="relative max-w-full">
                <img
                  src={images[currentImageIndex[post._id] ?? 0]}
                  alt={`Post image ${currentImageIndex[post._id] ?? 0 + 1}`}
                  onClick={
                    () => setPreviewImage(
                      { postId : post._id , 
                        url : images[currentImageIndex[post._id] ?? 0]
                      })
                    }
                  className="rounded-lg max-h-80 w-full object-cover"
                />

              {/* PREVIEW OVERLAY (FIXED POSITION) */}
              { previewImage?.postId === post._id && (
              <div className="absolute bg-black/80 inset-0 flex items-center justify-center z-10">
              
              <div className="relative">
              {/* IMAGE */}
              <img
                src={previewImage.url}
                 className="max-h-[60vh] max-w-[60vw] object-contain rounded-lg shadow-2xl"
              />

              {/* CLOSE BUTTON */}
              <button
                onClick={() => setPreviewImage(null)}
                className="absolute -top-1 -right-1 bg-cyan-800/90 text-white/90 rounded-full w-8 h-8 flex items-center justify-center text-sm shadow-lg"
              >
                ✕
              </button>
              </div>
              </div>
                )}


                {images.length > 1 && (
                  <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={() =>
                      SetCurrentImageIndex((prev) => ({
                        ...prev,
                        [post._id]:
                          (prev[post._id] ?? 0) === 0 ? images.length - 1 : (prev[post._id] ?? 0) - 1,
                      }))
                    }
                    className="bg-gray-200 p-1 rounded"
                  >
                    <IconArrowBigLeftFilled size={20} className="hover:text-cyan-400 hover:bg-white text-gray-500 bg-cyan-400" />
                  </button>
                  <button
                    onClick={() =>
                      SetCurrentImageIndex((prev) => ({
                        ...prev,
                        [post._id]: ((prev[post._id] ?? 0) + 1) % images.length,
                      }))
                    }
                    className="bg-gray-200 p-1 rounded"
                  >
                    <IconArrowBigRightFilled size={20} className="hover:text-cyan-400 hover:bg-white text-gray-500 bg-cyan-400"/> 
                  </button>
                  </div>
                )}
              </div>
            )}

          
            {/* Files stacked vertically */}
            {files.length > 0 && (
              <div className="mt-4 flex flex-col gap-4">
                {files.map((url, idx) => { 
                  // const name = post.fileNames?.[idx] || decodeURIComponent(url.split("/").pop()?.slice(0,40) || "file")
                  const name = post.fileNames?.[idx] || "File";
                  
                  return( 
                <div key={idx} className="flex items-center gap-2 bg-cyan-50 border border-cyan-200 p-3 rounded">
                  <FileIcon className="w-6 h-6 text-cyan-600" />
                  <a
                    href={url}
                    onClick={(e)=>{
                      e.preventDefault();
                      SetSelectedFileUrl(url);
                      SetSaveToNotes(true);
                    }}
                    className="text-cyan-700 underline font-medium cursor-pointer"
                  >
                    {name.length > 40 ? name.slice(0, 40) + "..." : name}
                  </a>
                </div>
                )}
                )}

              </div>
              )}
            </>);
            })()}
            </div>
            )}

    {sharePost === post._id && (
    <div className="absolute inset-0 flex items-center justify-center z-10">

    <div className="relative bg-white/90 border border-cyan-200 rounded-xl p-4 shadow-2xl w-[260px]">

      {/* CLOSE */}
      <button
        onClick={() => setSharePost(null)}
        className="absolute -top-2 -right-2 bg-gray-800 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm"
      >
        ✕
      </button>

      <h3 className="flex items-center justify-center gap-2 text-sm font-semibold mb-3 text-center text-cyan-500 hover:text-cyan-800">
        <Share className="" size={18}/> Share Post
      </h3>
      
      <div className="flex flex-col gap-2">

        {/* CHAT */}

        <button
          onClick={() => {
            const postData = encodeURIComponent(
            JSON.stringify({
              postId: post._id,
              description: post.description,
              image: post.imageUrls?.[0] || null,
              user: post.user,
          })
        );

          router.push(`/dashboard/messages?share=${postData}`);
      }}
        className="flex items-center gap-2 p-2 rounded hover:bg-white/30"
      >
          <MessageCircle className="w-4 h-4 text-cyan-600" />
          Chats
        </button>

        {/* WHATSAPP */}
        <button
          onClick={() => {
            const url = `${window.location.origin}/dashboard/posts/${post._id}`;
            window.open(`https://wa.me/?text=${encodeURIComponent(url)}`, "_blank");
          }}
          className="flex items-center gap-2 p-2 rounded hover:bg-green-50"
        >
          <FaWhatsapp className="w-4 h-4 text-green-500" />
          WhatsApp
        </button>

        {/* TELEGRAM */}
        <button
          onClick={() => {
            const url = `${window.location.origin}/dashboard/posts/${post._id}`;
            const text = "Check out this post!";
            window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,"_blank")
            toast.success("Copied for Instagram");
          }}
          className="flex items-center gap-2 p-2 rounded hover:bg-cyan-200"
        >
          <FaTelegram className="w-4 h-4 text-blue-500" />
          Telegram
        </button>
        
         {/* TWITTER / X */}
          <button
          onClick={() => {
            const url = `${window.location.origin}/dashboard/posts/${post._id}`;
            const text = "Check out this post!";
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,"_blank")
            toast.success("Copied for Instagram");
          }}
          className="flex items-center gap-2 p-2 rounded hover:bg-gray-200"
        >
          <FaTwitter className="w-4 h-4 text-black" />
          X (Twitter)
        </button>
        {/* COPY */}
        <button
          onClick={() => {
            const url = `${window.location.origin}/dashboard/posts/${post._id}`;
            navigator.clipboard.writeText(url);
            toast.success("Link copied");
          }}
          className="flex items-center gap-2 p-2 rounded hover:bg-pink-200"
        >
          <Link className="w-4 h-4" />
          Copy Link
        </button>

          </div>
          </div>
          </div>
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
                
                { !isArchiveView && ( 
                <button onClick={() => setSharePost(post._id)} className="flex items-center gap-1 hover:text-cyan-600 transition cursor-default">
                  <SendIcon className="w-5 h-5" />
                  Share
                </button>
                )}

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
                      onClick={() => setDeletePostId(post._id)}
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
            <div className="mt-4 border bg-cyan-100/50 border-cyan-200 rounded p-3 max-h-56 overflow-auto flex flex-col gap-3 relative">

            <button
              onClick={() =>
              setCommentBoxOpen(prev => ({
              ...prev,
             [post._id]: false
              }))
              }
            className="absolute top-2 right-2 bg-gray-800 text-white mb-3 w-6 h-6 rounded-full flex items-center justify-center text-sm hover:bg-gray-500"
            >
               ×
            </button>

            <div className="flex flex-col gap-2 mt-4">
              {commentState.loading && (
                  <Skeleton className="mt-2 w-full h-6 rounded-md bg-gray-300/70 animate-pulse" />
              )}

              {(commentState.comments ?? []).map((comment, idx) => (
                <div key={idx} className="text-sm">
                  <strong>
                    {comment?.user?.firstName || "User"}:
                  </strong>{" "}
                    {comment?.textMessage}
                </div>
              ))}
          </div>

          <div className="flex gap-2 mt-auto">
            <input
              className="flex-grow border rounded px-3 py-1"
              placeholder="Add a comment..."
              value={commentInputs[post._id] || ""}
              onChange={e =>
                setCommentInputs(prev => ({
                ...prev,
                [post._id]: e.target.value,
              }))
              }
              />
                  <button
                    onClick={() => handleComments(post._id)}
                    className="bg-cyan-600 hover:bg-cyan-800 hover:text-white/80 text-white px-4 rounded-md"
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
        src={postToEdit?.user?.profilePhoto || userProfileImageUrl}
        name={postToEdit ? `${postToEdit.user.firstName} ${postToEdit.user.lastName}` : userName || "You"}
        currentUserId={currentUserId}
        mode={postToEdit ? "edit" : "create"}
        initialContent={postToEdit?.description}
        initialImageUrl={postToEdit?.imageUrls || []}
        postIdToEdit={postToEdit?._id ?? ""}
        onSave={() => fetchPosts()}
      />

    {/* Fetch the older posts */}
    {oldFetch && (
      <div className="flex justify-center my-6">
      <button
        onClick={loadOlderPosts}
        disabled={loading}
        className="text-cyan-600 underline text-base hover:text-cyan-800"
      >
        {loading ? "Loading..." : "View Older Posts"}
      </button>
    </div>
    )}




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

      <AlertDialog open={!!deletePostId} onOpenChange={() => setDeletePostId(null)}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Delete this post?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete your post.
      </AlertDialogDescription>
    </AlertDialogHeader>

    <AlertDialogFooter>
      <AlertDialogCancel onClick={() => setDeletePostId(null)}>
        Cancel
      </AlertDialogCancel>

      <AlertDialogAction
        onClick={() => {
          if (deletePostId) {
            handleDelete(deletePostId);
            setDeletePostId(null);
          }
        }}
        className="bg-red-600 hover:bg-red-700"
      >
        Delete
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
    </>
  );
}
