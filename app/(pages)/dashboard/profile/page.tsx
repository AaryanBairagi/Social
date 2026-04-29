"use client";

import React, { useState, useEffect } from "react";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { Button } from "../../../../components/ui/button";
import { uploadFileToCloudinary } from "@/lib/uploadCloudinary";
import { Trash , Save } from "lucide-react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useRouter } from "next/navigation";
import {
  Activity,
  Bookmark,
  Archive,
  Clock,
  Shield,
  ChevronRight,
} from "lucide-react";

export default function UserProfilePage() {
  const { user: clerkUser, isLoaded, isSignedIn } = useUser();

  const baseProfile = clerkUser
    ? {
        firstName: clerkUser.firstName || "",
        lastName: clerkUser.lastName || "",
        userId: clerkUser.username || "",
        email: clerkUser.emailAddresses[0]?.emailAddress || "",
        profilePhoto: "", // no Clerk image, start empty
        bio: "",
        college: "",
        year: undefined,
        department: "",
        interests: [""],
        socialLinks: { linkedin: "", github: "", twitter: "", instagram: "" },
      }
    : {
        firstName: "",
        lastName: "",
        userId: "",
        email: "",
        profilePhoto: "", // no default avatar
        bio: "",
        college: "",
        year: undefined,
        department: "",
        interests: [""],
        socialLinks: { linkedin: "", github: "", twitter: "", instagram: "" },
      };

  const [user, setUser] = useState<any>(baseProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(baseProfile.profilePhoto);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [openSettings , setOpenSettings] = useState(false);
  
  const options = [
    {
      label: "Your Activity",
      icon: Activity,
      desc: "See your posts, likes, and interactions",
      route: "your-activity",
    },
    {
      label: "Saved Posts",
      icon: Bookmark,
      desc: "View posts you’ve bookmarked",
      route: "saved",
    },
    {
      label: "Archive",
      icon: Archive,
      desc: "Hidden or archived content",
      route: "archive",
    },
    {
      label: "Time Management",
      icon: Clock,
      desc: "Track your app usage",
      route: "time-management",
    },
    {
      label: "Security",
      icon: Shield,
      desc: "Manage password & account safety",
      route: "security",
    },
  ];

  const router = useRouter();


  useEffect(() => {
    if (!isLoaded || !isSignedIn || !clerkUser) return;

    const clerkId = clerkUser.id;
    setLoading(true);

    fetch(`/api/user/profile?clerkId=${clerkId}`)
      .then(async (res) => {
        if (res.status === 404) {
          console.log("No user found in DB, using empty base profile");
          setUser(baseProfile);
          setPreview("");
          setLoading(false);
          return null;
        }
        const data = await res.json();
        console.log("Fetched user from DB:", data);
        setUser(data);
        setPreview(data.profilePhoto || "");
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching user profile:", err);
        setUser(baseProfile);
        setPreview("");
        setLoading(false);
      });
  }, [isLoaded, isSignedIn, clerkUser]);

  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!user) return;
    const { name, value } = e.target;
    if (name.startsWith("socialLinks.")) {
      const key = name.split(".")[1];
      setUser((prev: any) => ({
        ...prev,
        socialLinks: { ...prev.socialLinks, [key]: value },
      }));
    } else {
      setUser((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const handleInterestChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const interests = [...(user?.interests || [])];
    interests[idx] = e.target.value;
    setUser((prev: any) => ({ ...prev, interests }));
  };

  const addInterest = () => {
    setUser((prev: any) => ({
      ...prev,
      interests: [...(prev.interests || []), ""],
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !clerkUser) return;

    setSaving(true);

    let profilePhoto = user.profilePhoto;

    if (imageFile) {
      try {
        profilePhoto = await uploadFileToCloudinary(imageFile);
      } catch (uploadErr) {
        alert("Failed to upload profile photo. Please try again.");
        setSaving(false);
        return;
      }
    }

    const clerkId = clerkUser.id;
    const updateData = { ...user, clerkId, profilePhoto };

    const method = user._id ? "PUT" : "POST";

    console.log("Saving user data with method:", method, updateData);

    try {
      const res = await fetch("/api/user/profile", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (res.ok) {
        const savedUser = await res.json();
        setUser(savedUser);
        setPreview(savedUser.profilePhoto || "");
        setImageFile(null);
        alert("Profile saved successfully!");
      } else {
        const errorData = await res.json();
        console.error("Failed to save profile:", errorData);
        alert("Failed to save profile: " + (errorData.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Error saving profile:", err);
      alert("Error saving profile.");
    } finally {
      setSaving(false);
    }
  };

  if (!isLoaded)
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-10 h-10 border-4 border-t-cyan-600 border-gray-300 rounded-full animate-spin"></div>
        <p className="text-cyan-600">Loading User Info...</p>
      </div>
    );

  if (!isSignedIn)
    return (
      <div className="text-center py-20 text-red-600 font-semibold text-cyan-600">
        <p className="text-cyan-600">Please Login to view your Profile.</p>
      </div>
    );

  if (loading || !user) 
    return (
      <div className="flex flex-row justify-center items-center py-20 space-y-4 gap-4">
        <p className="text-gray-400">Loading User Profile</p>
        <svg className="animate-spin h-10 w-10 text-cyan-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4}></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
        </svg>
      </div>
    );

  const inputClassNames =
    "w-full rounded border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-shadow p-2";

  return (
    <div className="max-w-3xl mx-auto my-12">
      <div className="bg-white shadow-md rounded-xl p-8 border border-gray-100 mb-8 relative">
        <div className="flex items-center gap-6">
          <label htmlFor="profile-photo" className="relative group cursor-pointer">
            {preview ? (
              <img
                src={preview}
                alt="Profile Photo"
                width={60}
                height={60}
                className="rounded-full object-cover border-4 border-cyan-100 group-hover:brightness-75 transition"
              />
            ) : (
              <div className="w-15 h-15 rounded-full bg-gray-300 border-4 border-cyan-100" />
            )}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 px-2 py-1 text-xs bg-cyan-600 text-white rounded opacity-80 group-hover:opacity-100 transition">
              Change
            </div>
            <input
              type="file"
              id="profile-photo"
              accept="image/*"
              className="hidden"
              onChange={handleImagePick}
              disabled={saving}
            />
          </label>
          <div>
            <h2 className="text-2xl font-bold">
              {user.firstName || ""} {user.lastName || "Your Name"}
            </h2>
            <p className="text-gray-500">@{user.userId || "yourusername"}</p>
          </div>
        </div>
        
        <div className="absolute top-6 right-6">
          <button onClick={()=> setOpenSettings(true)} className="p-2 rounded-full hover:bg-gray-100 transition">
            <BsThreeDotsVertical className="text-gray-500 hover:text-gray-700 transition-colors duration-200" size={24} />              
          </button>
        </div>

      </div>

      <form onSubmit={handleSave} className="bg-white rounded-xl shadow-md p-8 border border-gray-100 flex flex-col gap-8">
        <div>
          <h3 className="text-lg font-semibold text-cyan-700 mb-4">User Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">First Name</label>
              <input
                type="text"
                name="firstName"
                placeholder="Enter your first name"
                value={user.firstName || ""}
                onChange={handleChange}
                className={inputClassNames}
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Last Name</label>
              <input
                type="text"
                name="lastName"
                placeholder="Enter your last name"
                value={user.lastName || ""}
                onChange={handleChange}
                className={inputClassNames}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Username</label>
              <input
                type="text"
                name="userId"
                placeholder="Unique username"
                value={user.userId || ""}
                onChange={handleChange}
                className={inputClassNames}
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={user.email || ""}
                onChange={handleChange}
                className={inputClassNames + " cursor-not-allowed bg-gray-100"}
                required
                disabled
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">College</label>
              <input
                type="text"
                name="college"
                placeholder="Your college or university"
                value={user.college || ""}
                onChange={handleChange}
                className={inputClassNames}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Department</label>
              <input
                type="text"
                name="department"
                placeholder="Department, e.g. CSE"
                value={user.department || ""}
                onChange={handleChange}
                className={inputClassNames}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Year</label>
              <input
                type="number"
                name="year"
                placeholder="Year, e.g. 1, 2, 3, 4"
                value={user.year || ""}
                onChange={handleChange}
                min={1}
                max={4}
                className={inputClassNames}
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block mb-1 font-medium">Bio</label>
            <textarea
              name="bio"
              placeholder="Share something about yourself (max 200 chars)"
              value={user.bio || ""}
              onChange={handleChange}
              rows={3}
              maxLength={200}
              className={inputClassNames + " resize-none"}
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-cyan-700 mb-4">Interests</h3>
          <div className="flex flex-wrap gap-2">
            {(user.interests || []).map((tag: string, i: number) => (
              <div key={i} className="w-auto">
                <label className="block text-sm mb-1">Interest #{i + 1}</label>
                <input
                  type="text"
                  value={tag}
                  onChange={(e) => handleInterestChange(e, i)}
                  placeholder={`Interest #${i + 1}`}
                  className={inputClassNames + " w-auto"}
                />
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={addInterest}
              className="hover:shadow-cyan-200 mt-6"
            >
              + Add
            </Button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-cyan-700 mb-4">Social Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 font-medium">LinkedIn</label>
              <input
                type="text"
                name="socialLinks.linkedin"
                value={user.socialLinks?.linkedin || ""}
                onChange={handleChange}
                placeholder="LinkedIn URL"
                className={inputClassNames}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">GitHub</label>
              <input
                type="text"
                name="socialLinks.github"
                value={user.socialLinks?.github || ""}
                onChange={handleChange}
                placeholder="GitHub URL"
                className={inputClassNames}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Twitter</label>
              <input
                type="text"
                name="socialLinks.twitter"
                value={user.socialLinks?.twitter || ""}
                onChange={handleChange}
                placeholder="Twitter URL"
                className={inputClassNames}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Instagram</label>
              <input
                type="text"
                name="socialLinks.instagram"
                value={user.socialLinks?.instagram || ""}
                onChange={handleChange}
                placeholder="Instagram URL"
                className={inputClassNames}
              />
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-end gap-2 flex-row">
        <div className="flex justify-end mb-2">
          <SignOutButton>
            <Button
            type="button"
            variant="outline"
            className="border-black/20 bg-red-600 px-6 py-2 shadow hover:shadow-cyan-200  text-white/90 hover:bg-red-700 hover:text-white/80 transition-colors duration-300 font-semibold">
              Sign Out
              <span><Trash className="w-5 h-5"/></span>
            </Button>
          </SignOutButton>
        </div>


        <div className="flex justify-end mb-2">
          <Button
            type="submit"
            disabled={saving}
            className="bg-cyan-600 hover:bg-cyan-700 px-6 py-2 border-cyan-900 rounded-md shadow hover:shadow-cyan-200 transition"
          >
            {saving ? (
              <div className="flex items-center space-x-1">
                <div className="w-5 h-5 border-4 border-t-white border-gray-300 rounded-full animate-spin"></div>
                <span>Saving...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <p>Save Profile</p>
                <span><Save className="w-5 h-5 ml-1" /></span>
              </div>
            )}
          </Button>
        </div>
        
      </div>
      </form>

      {openSettings && (
  <div className="fixed inset-0 z-50 flex items-center justify-center">

    {/* BACKDROP */}
    <div
      className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      onClick={() => setOpenSettings(false)}
    />

    {/* MODAL */}
    <div className="relative z-50 w-full max-w-md rounded-2xl shadow-xl animate-in fade-in zoom-in-95">

      {/* CONTENT */}
      <div className="bg-gradient-to-br from-cyan-50 to-white p-6 rounded-2xl">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-cyan-800">
           Profile Settings 
          </h2>

        </div>

        {/* SETTINGS CARD */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {options.map((opt, i) => {
            const Icon = opt.icon;

            return (
              <div
                key={i}
                onClick={()=>{
                  setOpenSettings(false);
                  router.push(`/dashboard/profile/settings/${opt.route}`);
                }}
                className="flex items-center justify-between p-4 cursor-pointer group transition hover:bg-cyan-50"
              >
                {/* LEFT */}
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-xl bg-cyan-100 text-cyan-700 group-hover:scale-110 transition">
                    <Icon size={18} />
                  </div>

                  <div>
                    <p className="font-semibold text-gray-800">
                      {opt.label}
                    </p>
                    <p className="text-sm text-gray-500">
                      {opt.desc}
                    </p>
                  </div>
                </div>

                {/* RIGHT */}
                <ChevronRight className="text-gray-400 group-hover:translate-x-1 transition" />
              </div>
            );
          })}
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={() => setOpenSettings(false)}
            className="px-4 py-2 rounded-md border hover:bg-gray-100"
          >
            Close
          </button>

          <button
            onClick={() => setOpenSettings(false)}
            className="px-4 py-2 rounded-md bg-cyan-600 text-white hover:bg-cyan-700"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  </div>
    )}
    </div>
  );
}

