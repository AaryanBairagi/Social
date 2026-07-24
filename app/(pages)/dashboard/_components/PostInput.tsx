"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import PostDialog from "./PostDialog";

const UserProfilePhoto = ({ src }: { src? : string }) =>
    src ? (
    <img
        src={src}
        alt="User Profile"
        className="rounded-full h-10 w-10 object-cover"
        draggable={false}
    />
    ) : (
    <img
        src="/User-Prof.png"
        alt="Default User"
        className="rounded-full h-9 w-9 p-1.5 object-cover bg-gray-400"
        draggable={false}
    /> 
);

const PostInput = () => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const profilePhoto = user?.profilePhoto;
    const currentUserId = user?._id ?? "";
    const fullName = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim();
    const username = user?.username;
    
    const handleClick = () => {
        setLoading(true);
        setTimeout(() => {
        setLoading(false);
        setOpen(true);
        }, 900); // simulate async loading
    };

    console.log(user);
    console.log("profilePhoto =", user?.profilePhoto);
    console.log("typeof =", typeof user?.profilePhoto);
    return (
        <div className="bg-white p-4 m-2 md:m-0 border border-gray-300 rounded-md drop-shadow-lg">
            <div className="flex items-center gap-3 relative">
            <UserProfilePhoto src={profilePhoto} />
            {/* Input */}
            <Input
                type="text"
                onClick={handleClick}
                placeholder="What's on your mind today? Create a Post."
                disabled={loading}
                className={`bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors duration-200 ${
                loading ? "opacity-60 pointer-events-none" : ""
            }`}
            />
            {/* Centered loader overlay */}
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
            <PostDialog
                mode={"create"}
                open={open}
                setOpen={setOpen}
                src={profilePhoto}
                name={fullName || username || ""}
                currentUserId={currentUserId}
            />
        </div>
    </div>
  );
};

export default PostInput;


