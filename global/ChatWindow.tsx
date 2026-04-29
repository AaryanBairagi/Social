"use client";
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import EmojiPicker from "emoji-picker-react";
import { ArrowRightCircle, SmileIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { PostPreview } from "./PostPreview";


export default function ChatWindow({ currentUserId, receiver , sharedPost }: any) {
  
  const router = useRouter();
  const [messages , setMessages] = useState<any[]>([]);
  const [socketReady, setSocketReady] = useState(false);
  const [hasSentShared, setHasSentShared] = useState(false);
  const [text , setText] = useState("");
  const [isTyping , setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [emojiText , SetEmojiText] = useState(false);
  const socketRef = useRef<any>(null);
  const receiverRef = useRef(receiver);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    receiverRef.current = receiver;
  }, [receiver]);

  // Load chat history from MongoDB when receiver changes
  useEffect(() => {
    if (!currentUserId || !receiver?._id) return;
    fetch(`/api/messages/${receiver._id}`)
      .then((res) => res.json())
      .then((data) => setMessages(data || []));
  }, [currentUserId,receiver]);

  useEffect(() => {
  if (!currentUserId) return;

  if (!socketRef.current) {
    socketRef.current = io("https://modnect-socket-server.onrender.com", {
      transports: ["websocket"],
    });
  }

  const socket = socketRef.current;

  socket.on("connect", () => {
    console.log("Connected:", socket.id);
    socket.emit("join", currentUserId);
    setSocketReady(true);
  });

  const handleMessage = (msg: any) => {
    console.log("📩 Received:", msg);

    const currentReceiver = receiverRef.current;

    if (
      (msg.sender === currentReceiver._id && msg.receiver === currentUserId) ||
      (msg.sender === currentUserId && msg.receiver === currentReceiver._id)
    ) {
      setMessages((prev) => [...prev, msg]);
    }
  };

  const handleTypingSocket = (data: any) => {
    const currentReceiver = receiverRef.current;

    if (data.sender === currentReceiver._id) {
      setIsTyping(true);

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 2000);
    }
  };

  socket.on("receiveMessage", handleMessage);
  socket.on("typing", handleTypingSocket); // 

  return () => {
    socket.off("receiveMessage", handleMessage);
    socket.off("typing", handleTypingSocket);
  };
}, [currentUserId]);

  useEffect(() => {
    if(containerRef.current){
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    setHasSentShared(false);
  }, [receiver]);

  // Send message
  const sendMessage = async () => {
    if (!text.trim()) return;
    const msg = {
      sender: currentUserId,
      receiver: receiver._id,
      text,
    };

    console.log(" Sending:", msg); 


    socketRef.current.emit("sendMessage", msg);
    socketRef.current.emit("newMessageNotification", {
      sender: currentUserId,
      receiver: receiver._id,
    });

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
    socketRef.current.emit("typing", { sender: currentUserId, receiver: receiver._id });
  };


  const EmojiHandle = (emojiData:any) => {
    const emojiChar = emojiData.emoji;
    setText((prev) => prev + emojiChar);
    SetEmojiText(false);
  }

  const me = { _id: currentUserId };

  return (
    <div className="flex flex-col flex-1 overflow-hidden mb-3 h-full">

    <header 
      className="flex items-center gap-3 bg-black/90 px-4 py-3 border-b"
      onClick={() => router.push(`/profile/${receiver.userId}`)}
    >
      <img
        src={receiver.profilePhoto || "/User-Prof.png"}
        className="w-9 h-9 rounded-full"
      />

      <div className="flex flex-col">
        <span className="font-semibold text-white/90">
          {receiver.firstName} {receiver.lastName}
        </span>
        <span className="text-xs text-white/80">
          @{receiver.userId}
        </span>
      </div>
    </header>

    <div className="flex-1 overflow-y-auto p-5 bg-white/60" ref={containerRef}>
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
            className={`rounded-2xl ${
            m.post
              ? "p-1 bg-transparent shadow-none"
              : "px-4 py-2"
            } max-w-xs md:max-w-sm min-w-[50px] break-words shadow ${
              m.sender === currentUserId
                ? m.post
                ? ""
                : "bg-cyan-600 text-white"
                : m.post
                ? ""
                : "bg-slate-100 text-gray-800 border border-gray-200"
                }`}
              >
              <span className="block font-semibold text-xs mb-1">
                {m.sender === currentUserId ? "You" : ""}
              </span>
              {/* {m.post ? (
                <PostPreview post={m.post} />
                ) : (
                  m.text
              )} */}

              {m.post ? (
              typeof m.post === "object" ? (
                <PostPreview post={m.post} />
              ) : (
                <div className="text-xs text-gray-500 italic">
                  Shared Post (preview unavailable)
                </div>
              )
              ) : (
                m.text
              )}
              
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

    {/* SHARED POST PREVIEW */}
    {sharedPost && !hasSentShared && (
    <div className="border-t bg-cyan-50 p-3 flex items-center justify-between gap-3">
    
    {/* Preview */}
    <div className="flex items-center gap-3">
      {sharedPost.image && (
        <img
          src={sharedPost.image}
          className="w-12 h-12 object-cover rounded-md"
        />
      )}

      <div className="text-sm">
        <div className="font-medium text-gray-800">
          @{sharedPost.user?.userId}
        </div>
        <div className="text-xs text-gray-500 line-clamp-1">
          {sharedPost.description}
        </div>
      </div>
    </div>

    {/* SEND BUTTON */}
    <button
      onClick={async() => {
        if (!receiver?._id || !socketRef.current) return;

        const msg = {
          sender: currentUserId,
          receiver: receiver._id,
          text: "",
          post: sharedPost.postId,
        };

        socketRef.current.emit("sendMessage", msg);
        socketRef.current.emit("newMessageNotification", {
          sender: currentUserId,
          receiver: receiver._id,
        });
        
        await fetch(`/api/messages/${receiver._id}`,{
          method:"POST",
          headers:{'Content-Type': 'application/json'},
          body:JSON.stringify({
            text:sharedPost.description || "Shared Post",
            post:sharedPost.postId
          })
        });

        setMessages((prev: any) => [
          ...prev,
          { ...msg, createdAt: new Date() },
        ]);

        setHasSentShared(true);
      }}
      className="bg-cyan-500 text-white px-4 py-2 rounded-full text-sm hover:bg-cyan-600 transition"
    >
      Send
    </button>
    </div>
    )}


      {/* <div className="flex gap-2 px-4 mt-1 items-center relative"> */}
      <div className="border-t mt-2 bg-white p-3 flex items-center gap-2 relative">
        <button 
          type="button"
          onClick={ () => { SetEmojiText((s)=> !s) } }
          className="text-cyan-500 hover:text-cyan-700"
        >
          <SmileIcon className="h-6 w-6" />
        </button>

        {emojiText && (
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


