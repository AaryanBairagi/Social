import Navbar from "@/global/Navbar";
import { SideBar } from "@/global/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={true}>
      <Navbar />

      <SideBar />

      <main
        className="
          ml-40
          mt-[120px]
          min-h-[calc(100vh-120px)]
          bg-[#e0f7fa]
          overflow-y-auto
          p-8 mx-auto w-full
        "
      >
        {/* <div className="mx-auto max-w-5xl">
          
        </div> */}

        {children}
      </main>
    </SidebarProvider>
  );
}

