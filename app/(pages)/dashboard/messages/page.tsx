import MessagePage from "@/global/MessagePage";
export default function Messages() {
  return <MessagePage />;
}












// "use client";
// import { useUser } from "@clerk/nextjs";
// import { useEffect, useState } from "react";
// import MessagePanel from "@/global/MessagePanel";

// type ChatUser = {
//   _id: string;
//   firstName: string;
//   lastName: string;
//   userId: string;
//   profilePhoto?: string;
// };

// export default function MessagesPage() {
//   const { isLoaded } = useUser();
//   const [mongoUserId, setMongoUserId] = useState<string | null>(null);
//   const [connections, setConnections] = useState<ChatUser[]>([]);
//   const [activeChat, setActiveChat] = useState<ChatUser | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!isLoaded) return;
//     setLoading(true);
//     Promise.all([
//       fetch("/api/user/getId").then((r) => r.json()),
//       fetch("/api/connections/connected").then((r) => r.json()),
//     ])
//       .then(([userIdData, connectionList]) => {
//         setMongoUserId(userIdData.id);
//         setConnections(connectionList);
//         setActiveChat(connectionList[0] || null);
//       })
//       .finally(() => setLoading(false));
//   }, [isLoaded]);

//   if (!isLoaded || loading) {
//     return (
//       <div className="flex h-screen w-full items-center justify-center rounded-md bg-gray-50">
//         <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
//       </div>
//     );
//   }

//   return (
//     <main className="min-h-screen w-full bg-gradient-to-b from-[#EAF9FF] to-[#CFFAFE] flex flex-col">
//       <section className="flex max-w-6xl w-full mx-auto rounded-xl shadow-lg mt-10 bg-white border border-cyan-200 overflow-hidden h-[70vh]">
//         {/* Sidebar */}
//         <nav className="w-60 bg-cyan-50 border-r border-cyan-200 flex flex-col py-4">
//           <h2 className="font-bold text-cyan-800 px-6 mb-2">Chats</h2>
//           <ul className="flex-1 overflow-y-auto px-2">
//             {connections.map((u) => (
//               <li
//                 key={u._id}
//                 onClick={() => setActiveChat(u)}
//                 className={`flex items-center gap-3 px-3 py-2 rounded cursor-pointer mb-2 hover:bg-cyan-100 transition 
//                   ${activeChat?._id === u._id ? "bg-cyan-200 font-semibold" : ""}`}
//               >
//                 <img src={u.profilePhoto || "/default-avatar.png"} className="w-8 h-8 rounded-full" />
//                 <span>{u.firstName} {u.lastName}</span>
//               </li>
//             ))}
//             {connections.length === 0 && (
//               <li className="text-gray-400 text-sm px-3 py-2">No connections yet.</li>
//             )}
//           </ul>
//         </nav>
//         {/* Message Panel */}
//         <div className="flex-1 flex flex-col">
//           {activeChat && mongoUserId && (
//             <MessagePanel currentUserId={mongoUserId} chatTarget={activeChat} />
//           )}
//           {!activeChat && <div className="flex flex-1 items-center justify-center text-gray-400">No chat selected</div>}
//         </div>
//       </section>
//     </main>
//   );
// }











// // "use client";

// // import { useUser } from "@clerk/nextjs";
// // import { useEffect, useState } from "react";
// // import MessagePanel from "@/global/MessagePanel";

// // interface UserIdResponse {
// //   id: string;
// // }

// // export default function MessagesPage() {
// //   const { isLoaded } = useUser();
// //   const [mongoUserId, setMongoUserId] = useState<string | null>(null);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState<string | null>(null);

// //   useEffect(() => {
// //     if (!isLoaded) return;

// //     const fetchUserId = async () => {
// //       try {
// //         setLoading(true);
// //         const res = await fetch("/api/user/getId");
// //         if (!res.ok) throw new Error("Failed to fetch user ID");
// //         const data: UserIdResponse = await res.json();
// //         setMongoUserId(data.id);
// //       } catch (err) {
// //         console.error(err);
// //         setError("Unable to load user data. Please try again.");
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchUserId();
// //   }, [isLoaded]);

// //   if (!isLoaded || loading) {
// //     return (
// //       <div className="flex h-screen w-full items-center justify-center rounded-md bg-gray-50">
// //         <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
// //       </div>
// //     );
// //   }

// //   if (error || !mongoUserId) {
// //     return (
// //       <div className="flex h-screen w-full items-center justify-center bg-gray-50">
// //         <p className="text-red-600 text-lg">{error || "User not found."}</p>
// //       </div>
// //     );
// //   }

// //   return (
// //     <main className="min-h-screen w-full bg-gradient-to-b from-[#EAF9FF] to-[#CFFAFE] flex flex-col">
// //       <section className="flex flex-col flex-1 max-w-7xl mx-auto mt-10 mb-16 px-6 sm:px-8 lg:px-16">
// //         <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-8 tracking-tight drop-shadow-sm">
// //           Messages
// //         </h1>
// //         <div className="flex flex-1 rounded-xl bg-white shadow-lg border border-cyan-200 overflow-hidden min-h-[500px] h-[70vh]">
// //           <MessagePanel currentUserId={mongoUserId} />
// //         </div>
// //       </section>
// //     </main>
// //   );
// // }
