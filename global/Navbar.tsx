"use client"
import React, { useState , useCallback, useRef, useEffect } from 'react'
import { FloatingDock } from '@/components/ui/floating-dock'
import { Calendar, Home, LayoutGrid, UserCircle, Users } from 'lucide-react'
import Searchbar from './Searchbar'
import Image from 'next/image'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { UserCard } from './UserCard'
import { SearchDropdownItem } from './SearchDropDownComponent'

const Navbar = () => {
  const navItems = [
    { title: "Home" , icon: <Home/> , href:"/dashboard"},
    { title: "Posts", icon: <LayoutGrid />, href: "/dashboard/posts" },
    { title: "Connections", icon: <Users />, href: "/dashboard/connections" },
    { title: "Events", icon: <Calendar />, href: "/coming-soon" },
    { title: "Profile", icon: <UserCircle />, href: "/dashboard/profile" },
  ];

  const { user , isSignedIn } = useUser();

  const [searchLoading , SetSearchLoading] = useState(false);
  const [searchResults , SetSearchResults] = useState([]);
  const [DropdownOpen,SetDropDownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(()=>{
    function handleMouseClickOutside(event:MouseEvent){
      if(dropdownRef.current && !dropdownRef.current.contains(event.target as Node)){
          SetDropDownOpen(false);
      }
    }
    // Attach the 'mousedown' event listener when the component mounts
    document.addEventListener("mousedown", handleMouseClickOutside);

    // Cleanup function that removes the event listener when component unmounts
    return () => document.removeEventListener("mousedown", handleMouseClickOutside);
  },[]);

  const handleSearch = useCallback(async(query:string)=>{
    if(!query || query.length<2){
      SetSearchResults([]);
      SetDropDownOpen(false);
      return;
    }
    SetSearchLoading(true);
    try{
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if(!res.ok) throw new Error("Search API failed");
      const users = await res.json();
      SetSearchResults(users);
      SetDropDownOpen(true);
    }catch{
      SetSearchResults([]);
    }finally{
      SetSearchLoading(false);
    }
  } , []);
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md border-b border-gray-500/40 
                    shadow-lg rounded-b-2xl mx-auto flex justify-between items-center gap-6 pt-3 px-6 transition-all h-[120px]">
      {/* Logo + BrandName */}
      <div className="flex items-center gap-2 min-w-max ml-2">
        <Image src="/ModNectLogo.png" alt="logo" width={32} height={32} />
        <span className='font-bold text-gray-800 text-xl'><Link href="/">ModNect</Link></span>
      </div>

      {/* Left Side */}
      <div className="relative flex items-center max-w-md w-full shadow-md ml-10 mr-8" ref={dropdownRef}>
        <Searchbar onSearch={handleSearch} />
        {DropdownOpen && (
        <div className="absolute top-12 w-full bg-white/40 border border-gray-200 rounded-xl shadow-xl max-h-72 overflow-y-auto z-50">
    
          {/* Loading State */}
          {searchLoading && (
          <div className="p-4 flex items-center justify-center text-gray-500 text-sm">
            <svg
              className="animate-spin h-5 w-5 mr-2 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
            
              <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              />

              <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
              />

            </svg>
            Searching...
          </div>
          )}

          {/* No Results */}
          {!searchLoading && searchResults.length === 0 && (
          <div className="p-4 text-gray-500 text-sm text-center">
            🔍 No users found
          </div>
          )}

          {/* Results */}
          {!searchLoading &&
            searchResults.map((user) => (
            <SearchDropdownItem
              key={user.userId}
              user={user}
              onClick={() => SetDropDownOpen(false)}
            />
            ))}
          </div>
          )}
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
          { isSignedIn && user && (
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

