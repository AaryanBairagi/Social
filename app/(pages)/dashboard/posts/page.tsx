"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Posts from "../_components/Posts";
import SectionHeader from "@/global/SectionHeader";
import { LayoutGrid } from "lucide-react";

const Page = () => {
  const { user } = useAuth();
  const [currentUserId, setCurrentUserId] = useState("");

  useEffect(() => {
    if (!user) return;
    setCurrentUserId(user._id);
  }, [user]);

  return (
    <main className="w-full min-h-screen bg-white/60 border border-white/30 rounded-xl overflow-hidden">
      {/* Header */}
      <SectionHeader
        title="My Posts"
        icon={<LayoutGrid className="w-6 h-6" />}
      />

      {/* Body */}
      <div className="py-10">
        <div className="mx-auto w-full max-w-2xl">
          {currentUserId ? (
            <Posts currentUserId={currentUserId} mode="self" />
          ) : (
            <div className="flex justify-center items-center py-20">
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
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Page;