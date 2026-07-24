"use client"
import React from 'react'
import PostInput from './PostInput'
import Posts from './Posts'
import StoryBar from './StoryBar'
import WhatsNewModal from "@/global/WhatsNewModal";
import { useAuth } from '@/contexts/AuthContext'

const Feed  = () => {
    const { user } = useAuth();
    const [createdAt, setCreatedAt] = React.useState("");
    const currentUserId = user?._id;
    
  return (
    <>


    {/* <div className='flex flex-col gap-4  bg-white/60 rounded-lg drop-shadow-lg'> */}
    <div className="pt-6 flex flex-col gap-6 bg-white/60 rounded-lg items-center max-w-6xl drop-shadow-lg border-gray-200">
      {currentUserId && 
        <WhatsNewModal userId={currentUserId} createdAt={createdAt} />
      }

      <div className="w-full max-w-6xl">{currentUserId && <StoryBar userId={currentUserId} />}</div>

        <div className="w-4xl">
          <PostInput />
        </div>

      <div className="w-full max-w-2xl">
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
    </div>
    </>
  )
  
}

export default Feed