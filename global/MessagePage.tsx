"use client";
import { useEffect, useRef, useState } from "react";
import ChatWindow from "@/global/ChatWindow";
import SectionHeader from "@/global/SectionHeader";
import { Lock, MessageCircle } from "lucide-react";
import { io } from "socket.io-client";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

type ChatUser = {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  profilePhoto?: string;
};

export default function MessagePage() {
  const { loading } = useAuth();
  const searchParams = useSearchParams();
  const sharedPost = searchParams?.get("share")
  const [mongoUserId, setMongoUserId] = useState<string | null>(null);
  const [connections, setConnections] = useState<ChatUser[]>([]);
  const [activeChat, setActiveChat] = useState<ChatUser | null>(null);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [sharedData , setSharedData] = useState<any>(null);
  const socketRef = useRef<any>(null);
  const activeChatRef = useRef(activeChat);

  useEffect(() => {
    activeChatRef.current = activeChat;
  }, [activeChat]);


  useEffect(()=>{
    if(sharedPost){
      try{
        setSharedData(JSON.parse(decodeURIComponent(sharedPost)));
      }catch(err){
        console.error("Failed to parse shared post data:", err);
      }
    }
  },[sharedPost]);

  
  useEffect(() => {
  if (!mongoUserId) return;

  if (!socketRef.current) {
    socketRef.current = io("https://modnect-socket-server.onrender.com", {
      transports: ["websocket"],
    });

    socketRef.current.emit("join", mongoUserId);
  }

  const socket = socketRef.current;

  const handleMessage = () => {};

  socket.on("receiveMessage", handleMessage);
  socket.on("newMessageNotification", ({ sender } : { sender : string }) => {
  const senderId = String(sender);
  const currentChat = activeChatRef.current;

  if (!currentChat || senderId !== String(currentChat._id)) {
    setUnreadCounts((prev) => ({
      ...prev,
      [senderId]: (prev[senderId] || 0) + 1,
    }));
  }
  });

  return () => {
    socket.off("receiveMessage", handleMessage);
    socket.off("newMessageNotification");
  };
}, [mongoUserId, activeChat]);


  useEffect(() => {
  if (!mongoUserId) return;

  (async () => {
    const res = await fetch("/api/messages/unread-counts");
    const data = await res.json();

    setUnreadCounts(data); // { userId: count }
  })();
}, [mongoUserId]);


  useEffect(() => {
    if (loading) return;
    (async () => {
      const userIdRes = await fetch("/api/user/getId").then((r) => r.json());
      setMongoUserId(userIdRes.id);
      const conns = await fetch(`/api/connections/connected`).then((r) => r.json());
      setConnections(conns);
      setActiveChat(null); //dont auto open a chat on load
    })();
  }, [loading]);

  if (loading || !mongoUserId) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-100">
        <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const refreshUnreadCounts = async () => {
    if (!mongoUserId) return;
    const res = await fetch("/api/messages/unread-counts");
    const data = await res.json();
    setUnreadCounts(data);
  };

const openChat = async (u: ChatUser) => {
  setActiveChat(u);
  await fetch(`/api/messages/mark-read/${u._id}`, {
    method: "PATCH",
  });
  await refreshUnreadCounts();

  window.dispatchEvent(new Event("messages-read"));
  };

  return (
    <main className="max-h-screen w-full bg-gradient-to-b bg-white/60 border border-white/30 rounded-xl flex flex-col">
      <SectionHeader title="Chats" icon={<MessageCircle />} />
      <section className="flex max-w-6xl w-full mx-auto rounded-xl shadow-lg mt-2 mb-15 bg-white/10 border border-gray-200 overflow-hidden h-[75vh]">
        {/* Sidebar */}
        <aside className="w-72 border-r border-cyan-100 py-6 pr-4 bg-gradient-to-b from-white/50 to-cyan-100">          
          <ul className="overflow-y-auto max-h-[63vh]">
            {connections.map((u) => (
              <li
                key={u._id}
                onClick = { () => openChat(u) }
                className={`flex items-center ml-3 px-4 py-3 border-white/10 rounded-lg mb-2 cursor-pointer transition ${
                  activeChat?._id === u._id ? "bg-cyan-200 font-semibold shadow" : "bg-cyan-100 hover:bg-cyan-200"
                }`}
              >
                <img
                  className="w-9 h-9 rounded-full mr-3 border-2 border-cyan-300"
                  src={u.profilePhoto || "/User-Prof.png"}
                  alt=""
                />
                <div className="flex items-center justify-between w-full">
                <div className="flex flex-col">
                  <span className="truncate">{u.firstName} {u.lastName}</span>
                  <span className="text-xs text-cyan-700 truncate">@{u.username}</span>
                </div>
                { unreadCounts[u._id] > 0 && (
                  <div className="rounded-full text-xs text-white px-2 py-0.5 bg-cyan-500 hover:text-cyan-700 tranisiton">
                    {unreadCounts[u._id]}
                  </div>
                )}
                </div>  
              </li>
            ))}
            {!connections.length && (
              <li className="px-4 py-3 text-cyan-400 font-bold text-xs">No connections yet.</li>
            )}
          </ul>
        </aside>
        {/* Main Panel */}
        <div className="flex-1 flex flex-col bg-white/80 ">
          {activeChat ? (
            <ChatWindow currentUserId={mongoUserId} receiver={activeChat} sharedPost={sharedData} />
          ) : (
            <div className="flex flex-1 items-center justify-center bg-zinc-800 text-cyan-400 font-bold text-lg">
              <Lock/> Select a chat on the left to start messaging
            </div>
          )}
        </div>
      </section>
    </main>
  );
}


