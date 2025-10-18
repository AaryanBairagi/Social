"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import ChatWindow from "@/global/ChatWindow";

type ChatUser = {
  _id: string;
  firstName: string;
  lastName: string;
  userId: string;
  profilePhoto?: string;
};

export default function MessagesPage() {
  const { isLoaded } = useUser();
  const [mongoUserId, setMongoUserId] = useState<string | null>(null);
  const [connections, setConnections] = useState<ChatUser[]>([]);
  const [activeChat, setActiveChat] = useState<ChatUser | null>(null);

  useEffect(() => {
    if (!isLoaded) return;
    (async () => {
      const userIdRes = await fetch("/api/user/getId").then((r) => r.json());
      setMongoUserId(userIdRes.id);
      const conns = await fetch(`/api/connections/connected`).then((r) => r.json());
      setConnections(conns);
      setActiveChat(conns[0] || null);
    })();
  }, [isLoaded]);

  if (!isLoaded || !mongoUserId) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-100">
        <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-[#EAF9FF] to-[#CFFAFE] flex flex-col">
      <section className="flex max-w-6xl w-full mx-auto rounded-xl shadow-lg mt-10 bg-white border border-cyan-200 overflow-hidden h-[75vh]">
        {/* Sidebar */}
        <aside className="w-72 border-r border-cyan-100 py-6 pr-4 bg-gradient-to-b from-cyan-50 to-cyan-100">
          <div className="mb-4 px-4 font-bold text-cyan-800 text-lg">Chats</div>
          <ul className="overflow-y-auto max-h-[63vh]">
            {connections.map((u) => (
              <li
                key={u._id}
                onClick={() => setActiveChat(u)}
                className={`flex items-center px-4 py-3 rounded-lg mb-2 cursor-pointer transition ${
                  activeChat?._id === u._id ? "bg-cyan-200 font-semibold shadow" : "hover:bg-cyan-100"
                }`}
              >
                <img
                  className="w-9 h-9 rounded-full mr-3 border-2 border-cyan-300"
                  src={u.profilePhoto || "/default-avatar.png"}
                  alt=""
                />
                <div className="flex flex-col">
                  <span className="truncate">{u.firstName} {u.lastName}</span>
                  <span className="text-xs text-cyan-700 truncate">@{u.userId}</span>
                </div>
              </li>
            ))}
            {!connections.length && (
              <li className="px-4 py-3 text-cyan-400 text-xs">No connections yet.</li>
            )}
          </ul>
        </aside>
        {/* Main Panel */}
        <div className="flex-1 flex flex-col bg-[rgba(236,244,255,0.45)]">
          {activeChat ? (
            <ChatWindow currentUserId={mongoUserId} receiver={activeChat} />
          ) : (
            <div className="flex flex-1 items-center justify-center text-cyan-400 text-lg">
              📭 Select a chat on the left to start messaging
            </div>
          )}
        </div>
      </section>
    </main>
  );
}


