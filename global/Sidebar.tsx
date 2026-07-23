"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar";
// import { ImagesBadge } from "@/components/ui/images-badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { FileText, GraduationCap, MessageCircle, Cog, LifeBuoy, Bell } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "@/contexts/AuthContext";

export function SideBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const socketRef = useRef<any>(null);

  const [profilePhoto, setProfilePhoto] = useState<string>("");
  const [hasUnread , setHasUnread] = useState(false);
  const [hasUnreadNotifications , setHasUnreadNotifications] = useState(false);

  // Fetch user profile
  useEffect(() => {
    setProfilePhoto(user?.profilePhoto || "");
  }, [user]);

  const mongoId = user?._id ?? "";

  // Fetch notification count
  useEffect(()=>{
    if(!user) return;
    
    fetch("/api/notifications")
    .then(res => res.json())
    .then(data => {
      // if(data.unreadCount > 0){
      //   setHasUnreadNotifications(true);
      // }
      setHasUnreadNotifications(data.unreadCount > 0);
    })
    .catch((error) => console.error("Notification Fetch Error." , error))
  },[user]);

  // FIXED SOCKET BLOCK 
  useEffect(() => {
    if (!mongoId) return;

    if (!socketRef.current) {
      socketRef.current = io("https://modnect-socket-server.onrender.com", {
        transports: ["websocket"],
      });

      socketRef.current.on("connect", () => {
        console.log("Sidebar Socket Connected:", socketRef.current.id);
        socketRef.current.emit("join", mongoId);
      });
    }

    const socket = socketRef.current;

    const handleNotification = async() => {
      if (!pathname?.includes('/dashboard/messages')) {
        const res = await fetch('/api/messages/unread-counts');
        const data = await res.json();

        const hasAnyUnread = Object.values(data).some(
          (count : any) => count > 0
        );
        setHasUnread(hasAnyUnread);
      }
    };

    socket.on("newMessageNotification", handleNotification);

    return () => {
      socket.off("newMessageNotification", handleNotification);
    };
  }, [mongoId, pathname]);

  // Reset unread notifications
  useEffect(()=>{
    if(pathname?.includes('/dashboard/notifications')){
      async function markRead(){ 
        try{
          await fetch("/api/notifications/mark-read", { method : "PATCH" });
          setHasUnreadNotifications(false);
        }catch(err){
          console.error(err);
        }
      }

      markRead();
    }
  },[pathname])

  useEffect(() => {
  if (!mongoId) return;

  fetch("/api/messages/unread-counts")
    .then(res => res.json())
    .then((data) => {
      const hasAnyUnread = Object.values(data).some((count: any) => count > 0);
      setHasUnread(hasAnyUnread);
    })
    .catch(err => console.error("Unread fetch error:", err));
}, [mongoId]);

  useEffect(() => {
  const handler = async () => {
    const res = await fetch("/api/messages/unread-counts");
    const data = await res.json();
    setHasUnread(Object.values(data).some((count: any) => count > 0));
  };

  window.addEventListener("messages-read", handler);
  return () => window.removeEventListener("messages-read", handler);
  }, []);

  const navItems = [
    { name: "Notes", icon: FileText, href: "/dashboard/notes" },
    { name: "Materials", icon: GraduationCap, href: "/coming-soon" },
    { name: "Messages", icon: MessageCircle, href: "/dashboard/messages" },
    { name: "Notifications", icon: Bell, href: "/dashboard/notifications" },
    // { name: "Settings", icon: Cog, href: "/dashboard/settings" },
    { name: "Support", icon: LifeBuoy, href: "/contact-us" },
  ];

  return (
    <Sidebar className="min-h-screen w-35 bg-white/20 border-r border-gray-200 shadow flex flex-col justify-between pt-[120px] pb-6 overflow-y-auto overflow-x-hidden">
      <SidebarContent>
        <SidebarMenu className="flex flex-col items-center gap-5 space-y-6">
          <TooltipProvider delayDuration={0}>
            {navItems.map(({ name, icon: Icon, href }) => {
              const isActive = pathname === href;
              return (
                <SidebarMenuItem key={name}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SidebarMenuButton
                        asChild
                        onClick={() => router.push(href)}
                        className={cn(
                          "w-15 h-15 flex items-center justify-center rounded-lg transition-all duration-200 shadow-none bg-white border border-zinc-200 mt-3.5",
                          isActive && "bg-cyan-100 border-cyan-300 text-cyan-700 shadow-[0_0_15px_#06b2d4] font-semibold",
                          "hover:bg-cyan-50 hover:border-cyan-300 hover:shadow-[0_0_3px_#E0FFFF,0_0_6px_#CCFFFF,0_0_9px_#22CEE,0_0_12px_#2DEBF,0_0_15px_#06C3D4,0_0_18px_#14BF06]",
                          "hover:text-cyan-500"
                        )}
                      >
                    <button
                        type="button"
                        aria-label={name}
                        className="w-16 h-16 flex items-center justify-center text-xl"
                    >
                        <div className="relative group">
                        <Icon
                          size={16}
                          className={cn(isActive ? "text-cyan-500" : "text-black/40")}
                        />

                        {name === "Messages" && hasUnread && !pathname?.includes('/dashboard/messages') && (
                          <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-red-500 rounded-full ring-2 ring-white" />
                        )}

                        {name === "Notifications" && hasUnreadNotifications && !pathname?.includes('/dashboard/notifications') && (
                          <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-red-500 rounded-full ring-2 ring-white" />
                        )}

                      </div>
                    </button>
                      </SidebarMenuButton>
                    </TooltipTrigger>
                    <TooltipContent side="right" align="center" className="text-sm font-semibold">
                      {name}
                    </TooltipContent>
                  </Tooltip>
                </SidebarMenuItem>
              );
            })}
          </TooltipProvider>
        </SidebarMenu>
        <SidebarSeparator className="mt-8 mb-4 border border-white/20" />
      </SidebarContent>

      <SidebarFooter>
        {user && (
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  aria-label="Profile"
                  onClick={() => router.push("/dashboard/profile")}
                  className={cn(
                    "w-12 h-12 rounded-md overflow-hidden border-2 border-gray-700 shadow-lg mx-auto transition-all duration-200",
                    pathname === "/dashboard/profile" ? "ring-2 ring-cyan-400" : "ring-0",
                    "hover:ring-2 hover:ring-cyan-300 hover:shadow-cyan-500"
                  )}
                >
                  {profilePhoto ? (
                    <img
                      src={profilePhoto}
                      alt={user.firstName || user.username || "User"}
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                  ) : (
                    <span className="text-white font-bold text-lg select-none">
                      {user.firstName?.[0] || user.username?.[0] || "U"}
                    </span>
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent className="whitespace-nowrap" side="right">
                {user.firstName || user.username}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
