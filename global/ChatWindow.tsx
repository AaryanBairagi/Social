"use client";
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

let socket: any;

export default function ChatWindow({ currentUserId, receiver }: any) {
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  // Load chat history from MongoDB when receiver changes
  useEffect(() => {
    if (!currentUserId || !receiver?._id) return;
    fetch(`/api/messages/${receiver._id}`)
      .then((res) => res.json())
      .then((data) => setMessages(data || []));
  }, [currentUserId, receiver]);

  // Connect to socket (for real-time)
  useEffect(() => {
    if (!socket) {
      // socket = io({ path: "/api/socket" });
      socket = io({
        path: "/api/socket",
        transports: ["websocket"],
      });

      socket.emit("join", currentUserId);
      socket.on("receiveMessage", (msg: any) => {
        if (
          (msg.sender === receiver._id && msg.receiver === currentUserId) ||
          (msg.sender === currentUserId && msg.receiver === receiver._id)
        ) {
          setMessages((prev) => [...prev, msg]);
        }
      });
    }
    return () => {
      socket?.off("receiveMessage");
    };
  }, [currentUserId, receiver]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim()) return;
    const msg = {
      sender: currentUserId,
      receiver: receiver._id,
      text,
    };
    socket.emit("sendMessage", msg);
    setMessages((prev) => [...prev, { ...msg, createdAt: new Date() }]);
    setText("");
    await fetch(`/api/messages/${receiver._id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
      credentials: "include" 
    });
  };

  const me  = {_id : currentUserId};

  return (
    <div className="flex flex-col flex-1 h-full pb-3">
      {/* <header className="flex items-center gap-2 py-5 px-5 border-b border-cyan-100 bg-cyan-500 font-bold text-lg"> */}
      <header className="flex items-center gap-2 py-5 px-5 border-b border-cyan-200 bg-cyan-600 text-white font-bold text-lg shadow">
        <img
          src={receiver.profilePhoto || "/default-avatar.png"}
          className="w-10 h-10 rounded-full border-2 border-cyan-300"
        />
        <span>{receiver.firstName} {receiver.lastName}</span>
        <span className="ml-2 text-lg font-bold text-white/60">@{receiver.userId}</span>
      </header>
      <div className="flex-1 overflow-y-auto p-5 bg-white/60">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`mb-4 flex ${m.sender === currentUserId ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`rounded-2xl px-4 py-2 max-w-lg min-w-[50px] break-words shadow ${
                m.sender === currentUserId
                  ? "bg-cyan-600 text-white"
                  : "bg-slate-100 text-gray-800 border border-gray-200"
              }`}
            >
              <span className="block font-semibold text-xs mb-1">
                {m.sender === me._id ? "You" : ""}
              </span>
              {m.text}
              <span className="block text-[10px] mt-1 text-right text-gray-400">
                {m.createdAt ? new Date(m.createdAt).toLocaleTimeString() : ""}
              </span>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="flex gap-2 px-4 mt-1 items-center">
        <input
          className="flex-1 border rounded-full px-4 py-2 shadow text-sm focus:outline-cyan-400"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type message..."
          onKeyDown={e => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="px-6 py-2 rounded-full text-sm font-bold bg-cyan-600 text-white hover:bg-cyan-700 shadow"
        >
          Send
        </button>
      </div>
    </div>
  );
}




