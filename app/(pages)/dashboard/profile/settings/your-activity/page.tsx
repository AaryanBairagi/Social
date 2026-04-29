"use client";


import SectionHeader from '@/global/SectionHeader'
import React, { useEffect, useState } from 'react'
import { GoProjectRoadmap } from "react-icons/go";
import Posts from '../../../_components/Posts';
import { useUser } from '@clerk/nextjs';


const ActivityPage = () => {
  const { user } = useUser();
  const userId = user?.id;

  const [posts , setPosts] = useState<[]>([]);
  const [loading , setLoading] = useState(true);
  const [mongoId, setMongoId] = useState<string>("");

    useEffect(() => {
    if (!user?.id) return;

    const fetchMongoId = async () => {
      const res = await fetch(`/api/user/profile?clerkId=${user.id}`);
      const data = await res.json();
      setMongoId(data._id);
    };

    fetchMongoId();
  }, [user]);

  useEffect(()=>{
    if(!userId) return;

    const likedPost = async() => {
      try{
        const res = await fetch(`/api/posts/liked?userId=${userId}`); 
        if(!res.ok) throw new Error("Failed Requests");

        const data = await res.json();
        setPosts(data);
      }catch(error){
        console.log("Error fetching likedPosts" , error);
      }finally{
        setLoading(false);
      }
    }

    likedPost();
  },[userId]);

  if(loading){
    return(
      <div className="flex justify-center items-center gap-4 py-10">
        <p className='text-gray-400'>Loading Posts </p>
        <svg className="animate-spin h-10 w-10 text-cyan-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4}></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
        </svg>
      </div>
    )
  }

  return (
    <div>
      <SectionHeader icon={<GoProjectRoadmap className='w-7 h-7' />} title={"Your Activity"} />

      <div className='mt-7'>
        <Posts 
          currentUserId={mongoId || ""}
          mode="liked"
          initialPosts={posts}
        />
      </div>
    </div>
  )
}

export default ActivityPage
 