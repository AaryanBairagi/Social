

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

export function SideBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();

  const navItems = [
    { name: "Notes", icon: FileText, href: "/dashboard/notes" },
    { name: "Materials", icon: GraduationCap, href: "/study-materials" },
    { name: "Messages", icon: MessageCircle, href: "/messages" },
    { name: "Achievements", icon: Award, href: "/achievements" },
    { name: "Settings", icon: Cog, href: "dashboard/settings" },
    { name: "Support", icon: LifeBuoy, href: "/support" },
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
                          // "hover:bg-cyan-50 hover:border-cyan-300 hover:shadow-[0_0_12px_#67e8f9]",
                          isActive &&
                            "bg-cyan-100 border-cyan-300 text-cyan-700 shadow-[0_0_15px_#06b6d4] font-semibold",
                            "hover:bg-cyan-50 hover:border-cyan-300 hover:shadow-[0_0_3px_#E0FFFF,0_0_6px_#CCFFFF,0_0_9px_#22D3EE,0_0_12px_#2DD4BF,0_0_15px_#06B6D4,0_0_18px_#14B8A6] hover:text-cyan-500",
                        )}
                      >
                        <button type="button" aria-label={name} className="w-16 h-16 flex items-center justify-center text-xl">
                          <Icon
                            size={24}
                            className={cn(
                              "transition-colors duration-200",
                              isActive ? "text-cyan-500" : "text-black/40 "
                            )}
                          />
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

      {/* User profile button at bottom */}
      <SidebarFooter>
        {user && (
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  aria-label="Profile"
                  onClick={() => router.push("/profile")}
                  className={cn(
                    "w-12 h-12 flex items-center justify-center bg-cyan-600 rounded-lg text-white font-bold uppercase shadow-lg transition-all duration-200 mx-auto border-0.5 border-gray-800 hover:border-cyan-300 hover:shadow-[0_0_12px_#67e8f9]",
                    pathname === "/profile" && "ring-2 ring-cyan-300"
                  )}
                >
                  {user.firstName?.[0] || user.username?.[0] || "U"}
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p className="font-semibold">{user.firstName || user.username}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}








