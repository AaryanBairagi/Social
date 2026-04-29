"use client"
import React, { useEffect } from 'react'
import Posts from '../_components/Posts'
import { useUser } from '@clerk/nextjs'

const Page  = () => {
    const [currentUserId , setCurrentUserId] = React.useState<string>("");
    const { user } = useUser();

    useEffect(() => {
        if (!user) return;

    const fetchUserId = async () => {
        try {
            const res = await fetch(`/api/user/profile?clerkId=${user.id}`);
            if (res.ok) {
            const data = await res.json();
            if (data._id) {
              setCurrentUserId(data._id); // Save MongoDB ObjectId for posts
            }
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
        }
    };
    fetchUserId();
    }, [user]);
    
return (
  <div className='flex flex-col gap-4'>
    {/* Header */}
    <div className="flex items-center justify-between px-6 py-4 bg-white/60 rounded-t-2xl shadow border-b border-gray-200 mb-4">
      <div className="flex items-center gap-3">
        <svg className="w-7 h-7 text-cyan-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21H5a2 2 0 01-2-2V7a2 2 0 012-2h4l2-2 2 2h4a2 2 0 012 2v12a2 2 0 01-2 2z" />
        </svg>
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">My Posts</h1>
      </div>
    </div>
    {/* Posts */}
    {currentUserId ? <Posts currentUserId={currentUserId} mode="self" /> : (
      (<div className="flex justify-center items-center py-10">
        <svg className="animate-spin h-10 w-10 text-cyan-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4}></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
        </svg>
      </div>)
    )}
  </div>
)

}

export default Page