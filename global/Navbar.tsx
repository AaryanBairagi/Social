"use client"
import React from 'react'
import { FloatingDock } from '@/components/ui/floating-dock'
import { Calendar, Home, LayoutGrid, UserCircle, Users } from 'lucide-react'
import Searchbar from './Searchbar'
import Image from 'next/image'
import { useUser } from '@clerk/nextjs'

const Navbar = () => {
  const navItems = [
    { title: "Home" , icon: <Home/> , href:"/dashboard"},
    { title: "Posts", icon: <LayoutGrid />, href: "#" },
    { title: "Connections", icon: <Users />, href: "#" },
    { title: "Events", icon: <Calendar />, href: "/dashboard/events" },
    { title: "Profile", icon: <UserCircle />, href: "/dashboard/profile" },
  ];

  const { user , isSignedIn } = useUser();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md border-b border-gray-500/40 
                    shadow-lg rounded-b-2xl mx-auto flex justify-between items-center gap-6 pt-3 px-6 transition-all h-[120px]">
      {/* Logo + BrandName */}
      <div className="flex items-center gap-2 min-w-max ml-2">
        <Image src="/ModNectLogo.png" alt="logo" width={32} height={32} />
        <span className='font-bold text-gray-800 text-xl'>ModNect</span>
      </div>

      {/* Left Side */}
      <div className="flex items-center max-w-md w-full shadow-md ml-10 mr-8">
        <Searchbar />
      </div>

      {/* Middle Icons */}
      <div className="flex justify-center flex-grow w-full max-w-md">
        <FloatingDock
          items={navItems}
          desktopClassName="flex gap-6 bg-[#F5F7F7] shadow-md"
        />
      </div>

      {/* Right Side  */}
      <div className="min-w-max ml-2 mr-4 flex items-center">

          {
            isSignedIn && user && (
            <div className="min-w-max text-gray-800 font-semibold hidden md:flex items-center">
              Hi, { user.firstName || user.username ||  "User" } !
            </div>
            )
          }

      </div>
    </nav>
  )
}

export default Navbar

