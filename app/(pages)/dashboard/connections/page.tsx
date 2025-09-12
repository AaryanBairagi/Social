"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, UserCheck } from "lucide-react";
import { UserCard } from "../../../../global/UserCard"; // Adjust path as needed
import { UserProfileCard } from "@/global/UserProfileCard"; // Adjust path as needed

type ConnectionUser = {
  _id: string;
  firstName: string;
  lastName: string;
  userId: string;
  profilePhoto?: string;
  isFollowedByCurrentUser?: boolean;
};

export default function ConnectionsPage() {
  const { user, isSignedIn, isLoaded } = useUser();
  const currentUserId = user?.id || null;
  const router = useRouter();

  const [followers, setFollowers] = useState<ConnectionUser[]>([]);
  const [following, setFollowing] = useState<ConnectionUser[]>([]);
  const [loading, setLoading] = useState<"followers" | "following" | null>(null);

  const [profileUser, setProfileUser] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  // Fetch followers or following list
  const fetchList = async (list: "followers" | "following") => {
    if (!currentUserId) return;
    setLoading(list);
    try {
      const res = await fetch(`/api/connections/${currentUserId}/${list}`);
      if (!res.ok) throw new Error(`Failed to fetch ${list}`);
      const data = await res.json();
      if (list === "followers") setFollowers(data || []);
      else setFollowing(data || []);
    } catch {
      if (list === "followers") setFollowers([]);
      else setFollowing([]);
    } finally {
      setLoading(null);
    }
  };

  // Fetch app user profile data for public card
  useEffect(() => {
    async function getProfileData() {
      if (!currentUserId) return;
      setProfileLoading(true);
      try {
        const res = await fetch(`/api/user/profile?clerkId=${currentUserId}`);
        if (!res.ok) {
          setProfileUser(null);
        } else {
          const data = await res.json();
          setProfileUser(data);
        }
      } catch {
        setProfileUser(null);
      }
      setProfileLoading(false);
    }
    getProfileData();
  }, [currentUserId]);

  // Fetch followers & following on load
  useEffect(() => {
    if (isLoaded && isSignedIn && currentUserId) {
      fetchList("followers");
      fetchList("following");
    }
  }, [isLoaded, isSignedIn, currentUserId]);

  if (!isLoaded) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6 animate-pulse">
        <Skeleton className="h-10 w-2/3 bg-white/40" />
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="bg-white/80 shadow-xl border border-cyan-200 p-8 rounded-lg text-center text-red-500 text-xl font-semibold">
          Please sign in to view your connections.
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-[85vh] bg-gradient-to-br from-cyan-100 to-blue-100/50 flex justify-center py-10 px-2">
      <section className="w-full max-w-4xl">
        {/* Current User Public Profile Card */}
        {profileLoading ? (
          <div className="flex items-center justify-center bg-white/90 rounded-xl p-8 mb-10 max-w-3xl mx-auto w-full shadow-[0_0_15px_rgb(22,210,255)] border border-cyan-500">            
            <div className="w-12 h-12 border-4 border-t-cyan-600 border-gray-300 rounded-full animate-spin"></div>
          </div>
        ) : profileUser ? (
         // <div className="flex items-center bg-white/90 rounded-xl p-8 mb-10 max-w-3xl mx-auto w-full shadow-[0_0_15px_rgb(22,210,255)] border border-cyan-500">            
        <UserProfileCard            
            profilePhoto={profileUser.profilePhoto}
            userId={profileUser.userId}
            firstName={profileUser.firstName}
            lastName={profileUser.lastName}
            bio={profileUser.bio}
            interests={profileUser.interests}
            followersCount={followers.length}
            followingCount={following.length}
          />  
        ) : null}

        {/* Followers / Following Tabs */}
        <Tabs defaultValue="followers" className="w-full">
          <TabsList className="w-full flex justify-center gap-8 mb-0 bg-white/70 shadow-none border-b border-cyan-200">
            <TabsTrigger
              value="followers"
              className="font-bold text-lg p-4 border-b-2 data-[state=active]:border-cyan-500 data-[state=active]:text-cyan-700 data-[state=inactive]:text-gray-400 transition tracking-wide flex items-center gap-2"
            >
              <Users className="w-5 h-5" />
              Followers ({followers.length})
            </TabsTrigger>
            <TabsTrigger
              value="following"
              className="font-bold text-lg p-4 border-b-2 data-[state=active]:border-cyan-500 data-[state=active]:text-cyan-700 data-[state=inactive]:text-gray-400 transition tracking-wide flex items-center gap-2"
            >
              <UserCheck className="w-5 h-5" />
              Following ({following.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="followers">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 py-6">
              {loading === "followers"
                ? [...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-44 w-full rounded-xl" />
                  ))
                : followers.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 border border-cyan-100 bg-white/80 rounded-xl col-span-full">
                      No followers yet.
                    </div>
                  ) : (
                    followers.map(user => (
                      <UserCard
                        key={user._id}
                        user={{
                          ...user,
                          initiallyFollowing: user.isFollowedByCurrentUser // adjust to your field name
                        }}
                      />
                    ))
                  )}
            </div>
          </TabsContent>
          <TabsContent value="following">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 py-6">
              {loading === "following"
                ? [...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-44 w-full rounded-xl" />
                  ))
                : following.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 border border-cyan-100 bg-white/80 rounded-xl col-span-full">
                      You are not following anyone.
                    </div>
                  ) : (
                    following.map(user => (
                      <UserCard
                        key={user._id}
                        user={{
                          ...user,
                          initiallyFollowing: true // optional; customize logic
                        }}
                      />
                    ))
                  )}
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </main>
  );
}






// "use client";

// import React, { useState, useEffect } from "react";
// import { useUser } from "@clerk/nextjs";
// import { useRouter } from "next/navigation";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Users, UserCheck } from "lucide-react";
// import { UserCard } from "../../../../global/UserCard"; // <-- use the new 3D card!
// import { UserProfileCard } from "@/global/UserProfileCard";

// type ConnectionUser = {
//   _id: string;
//   firstName: string;
//   lastName: string;
//   userId: string;
//   profilePhoto?: string;
//   // Optional: add your backend-follow-relationship property here
//   isFollowedByCurrentUser?: boolean;
// };

// export default function ConnectionsPage() {
//   const { user, isSignedIn, isLoaded } = useUser();
//   const currentUserId = user?.id || null;
//   const router = useRouter();

//   const [followers, setFollowers] = useState<ConnectionUser[]>([]);
//   const [following, setFollowing] = useState<ConnectionUser[]>([]);
//   const [loading, setLoading] = useState<"followers" | "following" | null>(null);

//   const [profileUser, setProfileUser] = useState<any>(null);
//   const [profileLoading, setProfileLoading] = useState(true);

//   const fetchList = async (list: "followers" | "following") => {
//     if (!currentUserId) return;
//     setLoading(list);
//     try {
//       const res = await fetch(`/api/connections/${currentUserId}/${list}`);
//       if (!res.ok) throw new Error(`Failed to fetch ${list}`);
//       const data = await res.json();
//       if (list === "followers") setFollowers(data || []);
//       else setFollowing(data || []);
//     } catch (err) {
//       if (list === "followers") setFollowers([]);
//       else setFollowing([]);
//     } finally {
//       setLoading(null);
//     }
//   };

//   useEffect(() => {
//     if (isLoaded && isSignedIn && currentUserId) {
//       fetchList("followers");
//       fetchList("following");
//     }
//   }, [isLoaded, isSignedIn, currentUserId]);

//   useEffect(() => {
//     async function getProfileData() {
//       if (!currentUserId) return;
//       setProfileLoading(true);
//       try {
//         const res = await fetch(`/api/user/profile?clerkId=${currentUserId}`);
//         if (!res.ok) {
//           setProfileUser(null);
//         } else {
//           const data = await res.json();
//           setProfileUser(data);
//         }
//       } catch {
//         setProfileUser(null);
//       }
//       setProfileLoading(false);
//     }
//     getProfileData();
//   }, [currentUserId]);

//   if (!isLoaded) {
//     return (
//       <div className="max-w-2xl mx-auto px-4 py-6 space-y-6 animate-pulse">
//         <Skeleton className="h-10 w-2/3" />
//         {[...Array(3)].map((_, i) => (
//           <Skeleton key={i} className="h-20 w-full rounded-xl" />
//         ))}
//       </div>
//     );
//   }

//   if (!isSignedIn) {
//     return (
//       <div className="flex min-h-[50vh] items-center justify-center">
//         <div className="bg-white/80 shadow-xl border border-cyan-200 p-8 rounded-lg text-center text-red-500 text-xl font-semibold">
//           Please sign in to view your connections.
//         </div>
//       </div>
//     );
//   }

//   return (
//     <main className="min-h-[85vh] bg-gradient-to-br from-cyan-100 to-blue-100/50 flex justify-center py-10 px-2">
//       <section className="w-full max-w-4xl">
//         {profileLoading ? (
//           <div className="w-full flex justify-center py-6">
//             <div className="w-16 h-16 border-4 border-t-cyan-600 border-gray-300 rounded-full animate-spin"></div>
//           </div>
//         ) : profileUser && (
//           <UserProfileCard
//             profilePhoto={profileUser.profilePhoto}
//             userId={profileUser.userId}
//             firstName={profileUser.firstName}
//             lastName={profileUser.lastName}
//             bio={profileUser.bio}
//             interests={profileUser.interests}
//             followersCount={followers.length}
//             followingCount={following.length}
//           />
//         )}
//         <Tabs defaultValue="followers" className="w-full">
//           <TabsList className="w-full flex justify-center gap-8 mb-0 bg-white/70 shadow-none border-b border-cyan-200">
//             <TabsTrigger
//               value="followers"
//               className="font-bold text-lg p-4 border-b-2 data-[state=active]:border-cyan-500 data-[state=active]:text-cyan-700 data-[state=inactive]:text-gray-400 transition tracking-wide flex items-center gap-2"
//             >
//               <Users className="w-5 h-5" />
//               Followers ({followers.length})
//             </TabsTrigger>
//             <TabsTrigger
//               value="following"
//               className="font-bold text-lg p-4 border-b-2 data-[state=active]:border-cyan-500 data-[state=active]:text-cyan-700 data-[state=inactive]:text-gray-400 transition tracking-wide flex items-center gap-2"
//             >
//               <UserCheck className="w-5 h-5" />
//               Following ({following.length})
//             </TabsTrigger>
//           </TabsList>
//           <TabsContent value="followers">
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 py-6">
//               {loading === "followers"
//                 ? [...Array(3)].map((_, i) => (
//                     <Skeleton key={i} className="h-44 w-full rounded-xl" />
//                   ))
//                 : followers.length === 0 ? (
//                     <div className="p-8 text-center text-gray-500 border border-cyan-100 bg-white/80 rounded-xl col-span-full">
//                       No followers yet.
//                     </div>
//                   ) : (
//                     followers.map(user => (
//                       <UserCard
//                         key={user._id}
//                         user={{
//                           ...user,
//                           initiallyFollowing: user.isFollowedByCurrentUser // Change as per your field
//                         }}
//                       />
//                     ))
//                   )}
//             </div>
//           </TabsContent>
//           <TabsContent value="following">
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 py-6">
//               {loading === "following"
//                 ? [...Array(3)].map((_, i) => (
//                     <Skeleton key={i} className="h-44 w-full rounded-xl" />
//                   ))
//                 : following.length === 0 ? (
//                     <div className="p-8 text-center text-gray-500 border border-cyan-100 bg-white/80 rounded-xl col-span-full">
//                       You are not following anyone.
//                     </div>
//                   ) : (
//                     following.map(user => (
//                       <UserCard
//                         key={user._id}
//                         user={{
//                           ...user,
//                           initiallyFollowing: true // Optional: adjust your logic
//                         }}
//                       />
//                     ))
//                   )}
//             </div>
//           </TabsContent>
//         </Tabs>
//       </section>
//     </main>
//   );
// }




