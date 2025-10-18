"use client";
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import EmojiPicker from "emoji-picker-react";
import { ArrowRightCircle, MessageSquare, SmileIcon } from "lucide-react";



let socket: any;

export default function ChatWindow({ currentUserId, receiver }: any) {
  const [messages , setMessages] = useState<any[]>([]);
  const [text , setText] = useState("");
  const [isTyping , setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [emojiText , SetEmojiText] = useState(false);

  // Load chat history from MongoDB when receiver changes
  useEffect(() => {
    if (!currentUserId || !receiver?._id) return;
    fetch(`/api/messages/${receiver._id}`)
      .then((res) => res.json())
      .then((data) => setMessages(data || []));
  }, [currentUserId, receiver]);

  // Initialize Socket.io
  useEffect(() => {
    fetch('/api/socket');
    if (!socket) {
      socket = io({
        path: "/api/socket",
        transports: ["websocket"],
      });
    }

    socket.emit("join", currentUserId);

    // Listen for new messages
    socket.on("receiveMessage", (msg: any) => {
      if (
        (msg.sender === receiver._id && msg.receiver === currentUserId) ||
        (msg.sender === currentUserId && msg.receiver === receiver._id)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    // Listen for typing indicator
    socket.on("typing", (data: any) => {
      if (data.sender === receiver._id) {
        setIsTyping(true);
        // Hide after 2s if no new typing event
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 2000);
      }
    });

    return () => {
      socket?.off("receiveMessage");
      socket?.off("typing");
    };
  }, [currentUserId, receiver]);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Send message
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
      credentials: "include",
    });
  };

  // Emit typing event
  const handleTyping = (e: any) => {
    setText(e.target.value);
    socket.emit("typing", { sender: currentUserId, receiver: receiver._id });
  };


  const EmojiHandle = (emojiData:any) => {
    const emojiChar = emojiData.emoji;
    setText((prev) => prev + emojiChar);
    SetEmojiText(false);
  }

  const me = { _id: currentUserId };

  return (
    <div className="flex flex-col flex-1 h-full pb-3">
      <header className="flex items-center gap-2 py-5 px-5 border-b border-cyan-200 bg-cyan-600 text-white font-bold text-lg shadow">
        <img
          src={receiver.profilePhoto || "/default-avatar.png"}
          className="w-10 h-10 rounded-full border-2 border-cyan-300"
        />
        <span>{receiver.firstName} {receiver.lastName}</span>
        <span className="ml-2 text-lg font-bold text-white/60">@{receiver.userId}</span>
      </header>

      
    <div className="flex-1 overflow-y-auto p-5 bg-white/60">
      {(() => {
      let lastDate = "";
      return messages.map((m, i) => {
        const msgDate = m.createdAt ? new Date(m.createdAt) : new Date();
        const dateString = msgDate.toLocaleDateString(undefined, {
          weekday: "short",
          month: "short",
          day: "numeric",
        });
        const showDate = dateString !== lastDate;
        lastDate = dateString;

        return (
          <div key={i}>
            {showDate && (
              <div className="flex justify-center mb-2 text-xs text-gray-400">
                {dateString}
              </div>
            )}

          <div
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
                {m.sender === currentUserId ? "You" : ""}
              </span>
              {m.text}
              <span className="block text-[10px] mt-1 text-right text-gray-400">
                {m.createdAt ? new Date(m.createdAt).toLocaleTimeString() : ""}
              </span>
            </div>
          </div>
        </div>
        );
      });
      })()}

      {/* Typing indicator */}
      {isTyping && (
      <div className="mb-4 flex justify-start">
        <div className="rounded-2xl px-4 py-2 max-w-[50px] flex items-center justify-center gap-1 bg-slate-100 border border-gray-200">
          <span className="dot w-2 h-2 rounded-full bg-gray-500 animate-bounce"></span>
          <span className="dot w-2 h-2 rounded-full bg-gray-500 animate-bounce delay-150"></span>
          <span className="dot w-2 h-2 rounded-full bg-gray-500 animate-bounce delay-300"></span>
        </div>
      </div>
      )}

      <div ref={bottomRef} />
    </div>


      <div className="flex gap-2 px-4 mt-1 items-center relative">
        <button 
          type="button"
          onClick={ () => { SetEmojiText((s)=> !s) } }
          className="text-cyan-500 hover:text-cyan-700"
        >
          <SmileIcon className="h-6 w-6" />
        </button>

        { emojiText && (
          <div className="absolute bottom-full mb-2 left-0 z-50">
            <EmojiPicker onEmojiClick={EmojiHandle} />
          </div>
          )}

        <input
          className="flex-1 border rounded-full px-4 py-2 shadow text-sm focus:outline-cyan-400"
          value={text}
          onChange={handleTyping}
          placeholder="Type message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="px-6 py-2 rounded-full text-sm font-bold bg-cyan-600 text-white hover:bg-cyan-700 shadow"
        >
          {/* Send */}
          <ArrowRightCircle  className="w-6 h-6" />
        </button>
      </div>

      <style jsx>{`
        .dot {
          display: inline-block;
        }
        .dot:nth-child(1) {
          animation-delay: 0s;
        }
        .dot:nth-child(2) {
          animation-delay: 0.15s;
        }
        .dot:nth-child(3) {
          animation-delay: 0.3s;
        }
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
        .animate-bounce {
          animation: bounce 1s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}


