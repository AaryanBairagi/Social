"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { UserProfileCard } from "../../../global/UserProfileCard";
import PostsComponent from "../../../global/PostsComponent";
import { useParams } from "next/navigation";

type Post = {
  _id: string;
  description: string;
  imageUrls?: string[];
  createdAt?: string;
};

export default function UserProfileView() {
  const params = useParams();
  const [profileData, setProfileData] = useState<any>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      setLoadingProfile(true);
      try {
        const res = await fetch(`/api/profile/${params.userId}`);
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        setProfileData(data);
      } catch (err) {
        setProfileData(null);
      } finally {
        setLoadingProfile(false);
      }
    }
    if (params.userId) fetchProfile();
  }, [params.userId]);

  useEffect(() => {
    async function fetchPosts() {
      setLoadingPosts(true);
      try {
        const res = await fetch(`/api/posts/user/${params.userId}`);
        if (!res.ok) throw new Error("Failed to fetch posts");
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        setPosts([]);
      } finally {
        setLoadingPosts(false);
      }
    }
    if (params.userId) fetchPosts();
  }, [params.userId]);

  if (loadingProfile) return <p>Loading profile...</p>;
  if (!profileData) return <p>Profile not found.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <UserProfileCard
        profilePhoto={profileData.profilePhoto}
        userId={profileData.userId}
        firstName={profileData.firstName}
        lastName={profileData.lastName}
        bio={profileData.bio}
        interests={profileData.interests}
        followersCount={profileData.connections?.length || 0}
        followingCount={profileData.followingCount || 0}
      />
      {profileData.isFollowing ? (
        <>
          {loadingPosts ? (
            <p>Loading posts...</p>
          ) : posts.length > 0 ? (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Recent Posts</h2>
              <PostsComponent posts={posts} />
            </div>
          ) : (
            <p className="mt-8 text-center text-gray-600 italic">No recent posts.</p>
          )}
        </>
      ) : (
        <p className="mt-8 text-center text-gray-600 italic">
          Follow this user to see their posts.
        </p>
      )}
    </div>
  );
}












// "use client";
// import React, { useEffect, useState } from "react";
// import { useUser } from "@clerk/nextjs";
// import { UserProfileCard } from "../../../global/UserProfileCard";
// import PostsComponent from "../../../global/PostsComponent";
// import { useParams } from "next/navigation";

// type Post = {
//   _id: string;
//   description: string;
//   imageUrls?: string[];
//   createdAt?: string;
// };

// export default function UserProfileView() {
//   const { user: currentUser } = useUser();
//   const params = useParams();
//   const [profileData, setProfileData] = useState<any>(null);
//   const [posts, setPosts] = useState<Post[]>([]);
//   const [loadingProfile, setLoadingProfile] = useState(true);
//   const [loadingPosts, setLoadingPosts] = useState(true);

//   // Fetch profile data
//   useEffect(() => {
//     async function fetchProfile() {
//       setLoadingProfile(true);
//       try {
//         const res = await fetch(`/api/profile/${params.userId}`);
//         if (!res.ok) throw new Error("Failed to fetch profile");
//         const data = await res.json();
//         setProfileData(data);
//       } catch (err) {
//         console.error("Failed to load profile", err);
//         setProfileData(null);
//       } finally {
//         setLoadingProfile(false);
//       }
//     }
//     if (params.userId) fetchProfile();
//   }, [params.userId]);

//   // Fetch posts separately
//   useEffect(() => {
//     async function fetchPosts() {
//       setLoadingPosts(true);
//       try {
//         const res = await fetch(`/api/posts/user/${params.userId}`);
//         if (!res.ok) throw new Error("Failed to fetch posts");
//         const data = await res.json();
//         setPosts(data);
//       } catch (err) {
//         console.error("Failed to load posts", err);
//         setPosts([]);
//       } finally {
//         setLoadingPosts(false);
//       }
//     }
//     if (params.userId) fetchPosts();
//   }, [params.userId]);

//   if (loadingProfile) return <p>Loading profile...</p>;
//   if (!profileData) return <p>Profile not found.</p>;

//   return (
//     <div className="max-w-3xl mx-auto p-6">
//       <UserProfileCard
//         profilePhoto={profileData.profilePhoto}
//         userId={profileData.userId}
//         firstName={profileData.firstName}
//         lastName={profileData.lastName}
//         bio={profileData.bio}
//         interests={profileData.interests}
//         followersCount={profileData.connections?.length || 0}
//         followingCount={profileData.followingCount || 0}
//       />
//       {profileData.isFollowing ? (
//         <>
//           {loadingPosts ? (
//             <p>Loading posts...</p>
//           ) : posts.length > 0 ? (
//             <div className="mt-8">
//               <h2 className="text-xl font-semibold mb-4">Recent Posts</h2>
//               <PostsComponent posts={posts} />
//             </div>
//           ) : (
//             <p className="mt-8 text-center text-gray-600 italic">No recent posts.</p>
//           )}
//         </>
//       ) : (
//         <p className="mt-8 text-center text-gray-600 italic">
//           Follow this user to see their posts.
//         </p>
//       )}
//     </div>
//   );
// }










// "use client";
// import React, { useEffect, useState } from "react";
// import { useUser } from "@clerk/nextjs";
// import { UserProfileCard } from "../../../global/UserProfileCard";
// import PostsComponent from "../../../global/PostsComponent";
// import { useParams } from "next/navigation";

// export default function UserProfileView() {
//     const { user : currentUser } = useUser();
//     const [profileData, setProfileData] = useState<any>(null);
//     const [loading, setLoading] = useState(true);
//     const [posts, SetPosts] = useState<Post[]>([]);
//     const params = useParams();

//     useEffect(() => {
//     async function fetchProfile() {
//         setLoading(true);
//         try {
//             const res = await fetch(`/api/profile/${params.userId}`);
//             const data = await res.json();
//             setProfileData(data);
//         } catch (err) {
//             console.error("Failed to load profile", err);
//         } finally {
//             setLoading(false);
//         }
//     }
//     fetchProfile();
//     }, [params.userId]);


//     useEffect(()=>{
//         async function fetchPosts(){
//             const res = await fetch(`/api/posts/user/${params.userId}`);
//             const data = await res.json();
//             SetPosts(data);
//         }

//         if(params.userId) fetchPosts();
//     },[params.userId]);

//     if (loading) return <p>Loading profile...</p>;
//     if (!profileData) return <p>Profile not found.</p>;

//     return (
//     <div className="max-w-3xl mx-auto p-6">
//         <UserProfileCard
//         profilePhoto={profileData.profilePhoto}
//         userId={profileData.userId}
//         firstName={profileData.firstName}
//         lastName={profileData.lastName}
//         bio={profileData.bio}
//         interests={profileData.interests}
//         followersCount={profileData.connections?.length || 0}
//         followingCount={profileData.followingCount || 0}
//         />
//         {profileData.isFollowing && profileData.recentPosts?.length > 0 ? (
//         <div className="mt-8">
//             <h2 className="text-xl font-semibold mb-4">Recent Posts</h2>
//             <PostsComponent posts={profileData.recentPosts} />
//         </div>
//         ) : (
//         <p className="mt-8 text-center text-gray-600 italic">
//             {profileData.isFollowing
//             ? "No recent posts."
//             : "Follow this user to see their posts."}
//         </p>
//         )}
//     </div>
//     );
// }
