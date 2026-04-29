"use client"
import React, { useEffect } from 'react'
import PostInput from './PostInput'
import Posts from './Posts'
import StoryBar from './StoryBar'
import { useUser } from '@clerk/nextjs'
import WhatsNewModal from "@/global/WhatsNewModal";

const Feed  = () => {
    const [currentUserId , setCurrentUserId] = React.useState<string>("");
    const { user } = useUser();
    const [createdAt, setCreatedAt] = React.useState<string>("");

    useEffect(() => {
        if (!user) return;

    const fetchUserId = async () => {
        try {
            const res = await fetch(`/api/user/profile?clerkId=${user.id}`);
            if (res.ok) {
            const data = await res.json();
            if (data._id) {
              setCurrentUserId(data._id);
              setCreatedAt(data.createdAt);
              // Save MongoDB ObjectId for posts
            }
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
        }
    };
    fetchUserId();
    }, [user]);
    
  return (
    <>


    <div className='flex flex-col gap-4'>
      {currentUserId && 
        <WhatsNewModal userId={currentUserId} createdAt={createdAt} />
      }
      <PostInput />  
      {currentUserId && <StoryBar userId={currentUserId} />}
      {currentUserId ? <Posts currentUserId={currentUserId} mode="feed" /> : (        
      <div className="flex justify-center items-center py-10">
        <svg className="animate-spin h-10 w-10 text-cyan-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4}></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
        </svg>
      </div>
        )
      }
    </div>
    </>
  )
  
}

export default Feed