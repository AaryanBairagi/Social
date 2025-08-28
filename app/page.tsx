
export default function Home() {
  return (
    <>
    <div>
      Helloe
    </div>
    </>
  );
}






























// // pages/index.tsx
// "use client"

// import React, { useState } from "react";
// import {FloatingDock} from "../components/ui/floating-dock";
// import {
//   Home,
//   LayoutGrid,
//   Users,
//   Calendar,
//   UserCircle,
// } from "lucide-react";
// import {
//   SidebarProvider,
//   Sidebar,
//   SidebarContent,
// } from "@/components/ui/sidebar";

// const navItems = [
//   { title: "Home", icon: <Home />, href: "#" },
//   { title: "Posts", icon: <LayoutGrid />, href: "#" },
//   { title: "Connections", icon: <Users />, href: "#" },
//   { title: "Events", icon: <Calendar />, href: "#" },
//   { title: "Profile", icon: <UserCircle />, href: "#" },
// ];

// const infoCards = [
//   {
//     title: "Mentorship",
//     description: "Connect with experienced alumni for guidance.",
//     icon: <Users className="h-8 w-8 text-indigo-400" />,
//   },
//   {
//     title: "Resource Sharing",
//     description: "Access study materials and collaborate easily.",
//     icon: <LayoutGrid className="h-8 w-8 text-indigo-400" />,
//   },
//   {
//     title: "Events",
//     description: "Stay updated on alumni meetups and webinars.",
//     icon: <Calendar className="h-8 w-8 text-indigo-400" />,
//   },
// ];

// export default function Page() {
//   const [selected, setSelected] = useState("Home");

//   return (
//     <>
//       <FloatingDock
//         items={navItems}
//         desktopClassName="fixed top-0 left-0 right-0 z-50"
//       />

//       <SidebarProvider>
//         <div
//           style={{
//             paddingTop: "4rem",
//             display: "flex",
//             minHeight: "100vh",
//             backgroundColor: "#121212",
//             color: "#E0E0E0",
//           }}
//         >
//           {/* Sidebar */}
//           <Sidebar
//             side="left"
//             variant="sidebar"
//             className="bg-gray-900 shadow-lg rounded-r-3xl"
//             collapsible="none"
//           >
//             <SidebarContent>
//               <nav className="flex flex-col gap-2 p-4">
//                 {navItems.map(({ title, icon }, idx) => (
//                   <button
//                     key={idx}
//                     onClick={() => setSelected(title)}
//                     className={`flex items-center gap-3 p-3 rounded-md w-full text-left text-gray-400 hover:text-indigo-400 hover:bg-gray-800 transition-colors ${
//                       selected === title ? "bg-indigo-600 text-white" : ""
//                     }`}
//                   >
//                     {icon}
//                     <span className="font-medium">{title}</span>
//                   </button>
//                 ))}
//               </nav>
//             </SidebarContent>
//           </Sidebar>

//           {/* Main Content */}
//           <main style={{ flexGrow: 1, padding: "2rem" }}>
//             <h1 className="text-indigo-400 text-4xl font-bold mb-6">{selected}</h1>

//             {selected === "Home" && (
//               <>
//                 <p className="mb-10 max-w-2xl">
//                   Welcome to ModNect — connecting Modern College of Engineering alumni and students seamlessly.
//                 </p>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//                   {infoCards.map(({ title, description, icon }) => (
//                     <div
//                       key={title}
//                       className="bg-gray-800 bg-opacity-40 backdrop-blur-md rounded-xl p-6 shadow-lg border border-gray-700 hover:shadow-indigo-500 transition-shadow cursor-pointer"
//                     >
//                       <div className="mb-4">{icon}</div>
//                       <h2 className="text-xl font-semibold mb-2">{title}</h2>
//                       <p className="text-gray-400">{description}</p>
//                     </div>
//                   ))}
//                 </div>
//               </>
//             )}

//             {selected !== "Home" && (
//               <p className="italic text-gray-400">Content for {selected} page will be added soon.</p>
//             )}
//           </main>
//         </div>
//       </SidebarProvider>
//     </>
//   );
// }
