import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import ChatWindow from "@/global/ChatWindow"; // or MessagePanel, depending on your component's name

export default function MessagePage() {
    const { isLoaded } = useUser();
    const [mongoUserId, setMongoUserId] = useState<string | null>(null);
    const [connections, setConnections] = useState<any[]>([]);
    const [activeChat, setActiveChat] = useState<any | null>(null);

    useEffect(() => {
        if (!isLoaded) return;
        Promise.all([
        fetch("/api/user/getId").then(res => res.json()),
        fetch("/api/connections/connected").then(res => res.json()),
        ]).then(([idData, connData]) => {
        setMongoUserId(idData.id);
        setConnections(connData);
        setActiveChat(connData[0] || null);
        });
    }, [isLoaded]);

    if (!isLoaded || !mongoUserId) return <div>Loading...</div>;

    return (
    <section className="flex max-w-6xl w-full mx-auto rounded-xl shadow-lg mt-10 bg-white border border-cyan-200 overflow-hidden h-[70vh]">
      {/* Sidebar */}
        <nav className="w-60 bg-cyan-50 border-r border-cyan-200 flex flex-col py-4">
            <h2 className="font-bold text-cyan-800 px-6 mb-2">Chats</h2>
            <ul className="flex-1 overflow-y-auto px-2">
            {connections.map((u) => (
                <li
                key={u._id}
                onClick={() => setActiveChat(u)}
                className={`flex items-center gap-3 px-3 py-2 rounded cursor-pointer mb-2 hover:bg-cyan-100 transition 
                ${activeChat?._id === u._id ? "bg-cyan-200 font-semibold" : ""}`}
                >
                <img src={u.profilePhoto || "/default-avatar.png"} className="w-8 h-8 rounded-full" />
                <span>{u.firstName} {u.lastName}</span>
                </li>
            ))}
            </ul>
        </nav>
        {/* Chat Window for active chat */}
        <div className="flex-1 flex flex-col">
            {activeChat && mongoUserId && (
                <ChatWindow currentUserId={mongoUserId} receiver={activeChat} />
            )}
            {!activeChat && <div className="flex flex-1 items-center justify-center text-gray-400">No chat selected</div>}
        </div>
    </section>
    );
}




// "use client"
// import { useState, useEffect } from "react";

// interface MessagePanelProps{
//     currentUserId:string;
// }

// export default function MessagePanel({currentUserId}:MessagePanelProps){
//     const [followers,setFollowers] = useState<any[]>([]);
//     const [activeChat, setActiveChat] = useState<any | null>(null);

//     useEffect(()=>{
//         fetch(`api/connections/${currentUserId}/followers`).then((res)=>res.json()).then((data)=>setFollowers(data));
//     },[currentUserId]);

//     return(
//         <div className="flex">
//         {/* Left Sidebar */}
//             <div className="w-1/3 border-r">
//                 <h2 className="font-bold mb-2">Followers</h2>
//                 {followers.map((f) => (
//                 <div key={f.userId} onClick={() => setActiveChat(f)} className="cursor-pointer p-2 hover:bg-gray-100 flex items-center">
//                     <img src={f.profilePhoto} alt="" className="w-8 h-8 rounded-full mr-2" />
//                     {f.firstName} {f.lastName}
//                     </div>
//                 ))}
//                 </div>

//                 {/* Right Chat Window */}
//                 <div className="w-2/3">
//                 {activeChat ? (
//                 <ChatWindow currentUserId={currentUserId} receiver={activeChat} />
//                 ) : ( 
//                 <p className="p-4">Select a follower to start chatting</p>
//                 )}
//                 </div>
//             </div>
//         );
//     }