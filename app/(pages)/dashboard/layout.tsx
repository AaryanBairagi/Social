import Navbar from "@/global/Navbar";
import { SideBar } from "../../../global/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Layout({children}: Readonly<{children: React.ReactNode;}>) {
  return (
    <SidebarProvider>
      <Navbar />
      <div className="flex min-h-screen">
        <aside className="w-40 border-r border-gray-200 overflow-y-auto overflow-x-hidden bg-gray-200 min-h-screen">
          <SideBar />
        </aside>
        {/* Main area fills screen without horizontal scrollbar */}
        <main className="inset-0 mt-[120px] pb-10 pt-10 flex-1 overflow-auto min-h-screen bg-gradient-to-br from-[#e0f7fa] via-[#e0f7fa] to-[#8dc5ea] relative border border-gray-100 drop-shadow-lg">
          {/* Centered glassmorphic card */}
          <div className="mx-auto px-8 flex items-start w-335 h-400 border-gray-100">
            <div className="
              flex-1 relative rounded-2xl shadow-xl border border-white/30
              bg-white/40 backdrop-blur-md
              dark:bg-[#b6cad6]/60
              h-full 
              ">
              <div className="p-8 relative z-10">
                {children}
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

