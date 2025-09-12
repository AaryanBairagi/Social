"use client"
import React, { useEffect } from 'react'
import PostInput from './PostInput'
import Posts from './Posts'
import { useUser } from '@clerk/nextjs'

const Feed  = () => {
    const [currentUserId , setCurrentUserId] = React.useState<string>("");
    const { user } = useUser();

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
    
  return (
    <div className='flex flex-col gap-4'>
      <PostInput />  
      <Posts currentUserId={currentUserId} />
    </div>
  )
}

export default Feed