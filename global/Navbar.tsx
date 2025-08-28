"use client"
import React from 'react'
import { FloatingDock } from '@/components/ui/floating-dock'
import { Calendar, Home, LayoutGrid, UserCircle, Users } from 'lucide-react'

const Navbar = () => {
  const navItems = [
    { title: "Home" , icon: <Home/> , href:"#"},
    { title: "Posts", icon: <LayoutGrid />, href: "#" },
    { title: "Connections", icon: <Users />, href: "#" },
    { title: "Events", icon: <Calendar />, href: "#" },
    { title: "Profile", icon: <UserCircle />, href: "#" },
  ];

  return (
    <>

      <FloatingDock
        items={navItems}
        desktopClassName="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md border-b border-indigo-500/40 
        shadow-lg rounded-b-2xl mx-auto flex justify-center items-center gap-8 pt-3 px-6 transition-all h-[120px]"
      />
    </>
  )
}

export default Navbar