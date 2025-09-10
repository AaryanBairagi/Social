"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useUser } from "@clerk/nextjs";
import PostDialog from "./PostDialog";

const UserProfilePhoto = ({ src }: { src?: string }) =>
    src ? (
        <img
        src={src}
        alt="User Profile"
        className="rounded-full h-10 w-10 object-cover"
        draggable={false}
        />
        ) : (
        <div className="w-10 h-10 rounded-full bg-gray-200" />
    );

const PostInput = () => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { user } = useUser();
    const [currentUserId , setCurrentUserId] = React.useState<string>("");

    useEffect(() => {
        if (!user) return;

    const fetchUserId = async () => {
        try {
            const res = await fetch(`/api/user/profile?clerkId=${user.id}`);
            if (res.ok) {
            const data = await res.json();
            if (data?._id) {
            setCurrentUserId(data._id); // Save MongoDB ObjectId for posts
            }
        }
        } catch (error) {
            console.error("Error fetching user profile:", error);
        }
        };
        fetchUserId();
    }, [user]);


    const handleClick = () => {
        setLoading(true);
        setTimeout(() => {
        setLoading(false);
        setOpen(true);
        }, 900); // Simulate async loading
    };

  return (
    <div className="bg-white p-4 m-2 md:m-0 border border-gray-300 rounded-md drop-shadow-lg">
        <div className="flex items-center gap-3 relative">
            <UserProfilePhoto src={user?.imageUrl} />
            {/* Input */}
            <Input
            type="text"
            onClick={handleClick}
            placeholder="What's on your mind today? Create a Post."
            disabled={loading}
            className={`bg-gray-100 hover:bg-gray-200 text-gray-600  transition-opacity transition-colors duration-200 ${
            loading ? "opacity-60 pointer-events-none" : ""
        }`}
        />
        {/* Centered overlay loader */}
        {loading && (
        <div className="absolute left-1/2 top-1/2 -translate-x-[57%] -translate-y-1/2 z-20">
            <svg
                className="animate-spin h-6 w-6 text-cyan-500"
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
                strokeWidth="4"
            ></circle>
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            ></path>
            </svg>
        </div>
        )}
        <PostDialog mode={"create"} open={open} setOpen={setOpen} src={user?.imageUrl} name={user?.fullName || user?.username || ""} currentUserId={currentUserId} />
        </div>
    </div>
  );
};

export default PostInput;
