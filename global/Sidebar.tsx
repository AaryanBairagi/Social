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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { FileText, GraduationCap, MessageCircle, Award, Cog, LifeBuoy } from "lucide-react";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

let socket : any;
export function SideBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();

  // Local state to store profile photo URL from your DB
  const [profilePhoto, setProfilePhoto] = useState<string>("");
  const [hasUnread , setHasUnread] = useState(false);


  // Fetch user profile photo from your backend API
  useEffect(() => {
    if (!user) return;

    async function fetchUserProfile() {
      try {
        const res = await fetch(`/api/user/profile?clerkId=${user.id}`);
        if (res.ok) {
          const data = await res.json();
          setProfilePhoto(data.profilePhoto || "");
        }
      } catch (error) {
        console.error("Error fetching user profile photo:", error);
      }
    }
    fetchUserProfile();
  }, [user]);

  useEffect(()=>{
    if(!user) return;
    fetch('/api/socket');

    if(!socket){
      socket = io('/' , { path:'/api/socket' , transports:['websocket'] });
    }

    socket.on('connect' , ()=>{
      console.log('Socket connected with ID : ' , socket.id);
      socket.emit("join" , user.id);
    });

    socket.on("newMessageNotification",({sender})=>{
      console.log('unread triggered',sender);
      if(!pathname.includes('/dashboard/messages')){
        console.log('unread finished');
        setHasUnread(true);
      }
    });

    socket.on('disconnect' , () => {
      console.log("Socket Disconnected");
    });

    return ()=>{
      socket.off('newMessageNotification');
      socket.off('connect');
      socket.off('disconnect');
    }
  },[user,pathname]);


  //Check if the user has read the messages
  useEffect(()=>{
    if(pathname.includes('/dashboard/messages')){
      setHasUnread(false);
    }
  },[pathname])

  const navItems = [
    { name: "Notes", icon: FileText, href: "/dashboard/notes" },
    { name: "Materials", icon: GraduationCap, href: "/dashboard/study-materials" },
    { name: "Messages", icon: MessageCircle, href: "/dashboard/messages" },
    { name: "Achievements", icon: Award, href: "/dashboard/achievements" },
    { name: "Settings", icon: Cog, href: "/dashboard/settings" },
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
                        <button type="button" aria-label={name} className="relative w-16 h-16 flex items-center justify-center text-xl">
                          <Icon
                            size={24}
                            className={cn(isActive ? "text-cyan-500" : "text-black/40")}
                          />
                          {name==="Messages" && !isActive && hasUnread && (
                            <span className="absolute top-2 right-2 h-3 w-3 bg-red-800 rounded-full shadow-md" />
                          )}
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

