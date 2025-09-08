"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { Button } from "../../../../components/ui/button";

export default function UserProfilePage() {
  const { user: clerkUser, isLoaded, isSignedIn } = useUser();

  const baseProfile = clerkUser
    ? {
        firstName: clerkUser.firstName || "",
        lastName: clerkUser.lastName || "",
        userId: clerkUser.username || "",
        email: clerkUser.emailAddresses[0]?.emailAddress || "",
        profilePhoto: clerkUser.imageUrl || "/default-avatar.png",
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
        profilePhoto: "/default-avatar.png",
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

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !clerkUser) return;

    const clerkId = clerkUser.id;
    setLoading(true);

    fetch(`/api/user/profile?clerkId=${clerkId}`)
      .then(async (res) => {
        if (res.status === 404) {
          console.log("No user found in DB, using empty base profile");
          setUser(baseProfile);
          setPreview(baseProfile.profilePhoto);
          setLoading(false);
          return null;
        }
        const data = await res.json();
        console.log("Fetched user from DB:", data);
        setUser(data);
        setPreview(data.profilePhoto || "/default-avatar.png");
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching user profile:", err);
        setLoading(false);
      });
  }, [isLoaded, isSignedIn, clerkUser]);

  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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

  const handleInterestChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number
  ) => {
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

    const profilePhoto = user.profilePhoto;
    if (imageFile) {
      // TODO: implement image upload here, then update profilePhoto with returned URL
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
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-10 h-10 border-4 border-t-cyan-600 border-gray-300 rounded-full animate-spin text-cyan-600"></div>
        <p className="text-cyan-600">Loading User Profile...</p>
      </div>
    );

  const inputClassNames =
    "w-full rounded border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-shadow p-2";

  return (
    <div className="max-w-3xl mx-auto my-12">
      <div className="bg-white shadow-md rounded-xl p-8 border border-gray-100 mb-8">
        <div className="flex items-center gap-6">
          <label htmlFor="profile-photo" className="relative group cursor-pointer">
            <Image
              src={"/User-Prof.png"}
              width={60}
              height={60}
              className="rounded-full object-cover border-4 border-cyan-100 group-hover:brightness-75 transition"
              alt="Profile Photo"
            />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 px-2 py-1 text-xs bg-cyan-600 text-white rounded opacity-80 group-hover:opacity-100 transition">
              Change
            </div>
            <input
              type="file"
              id="profile-photo"
              accept="image/*"
              className="hidden"
              onChange={handleImagePick}
            />
          </label>
          <div>
            <h2 className="text-2xl font-bold">
              {user.firstName || ""} {user.lastName || "Your Name"}
            </h2>
            <p className="text-gray-500">@{user.userId || "yourusername"}</p>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSave}
        className="bg-white rounded-xl shadow-md p-8 border border-gray-100 flex flex-col gap-8"
      >
        <div>
          <h3 className="text-lg font-semibold text-cyan-700 mb-4">User Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Inputs with cyan focused border */}
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

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={saving}
            className="bg-cyan-600 hover:bg-cyan-700 px-8 py-2 text-lg rounded-full shadow hover:shadow-cyan-200 transition"
          >
            {saving ? (
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 border-4 border-t-white border-gray-300 rounded-full animate-spin"></div>
                <span>Saving...</span>
              </div>
            ) : (
              "Save Profile"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}








// "use client";
// import React, { useState, useEffect } from "react";
// import Image from "next/image";
// import { useUser } from "@clerk/nextjs";
// import { Button } from "../../../../components/ui/button";

// export default function UserProfilePage() {
//   const { user: clerkUser, isLoaded, isSignedIn } = useUser();

//   const baseProfile = clerkUser
//     ? {
//         firstName: clerkUser.firstName || "",
//         lastName: clerkUser.lastName || "",
//         userId: clerkUser.username || "",
//         email: clerkUser.emailAddresses[0]?.emailAddress || "",
//         profilePhoto: clerkUser.imageUrl || "/default-avatar.png",
//         bio: "",
//         college: "",
//         year: "",
//         department: "",
//         interests: [""],
//         socialLinks: { linkedin: "", github: "", twitter: "", instagram: "" },
//       }
//     : {
//         firstName: "",
//         lastName: "",
//         userId: "",
//         email: "",
//         profilePhoto: "/default-avatar.png",
//         bio: "",
//         college: "",
//         year: "",
//         department: "",
//         interests: [""],
//         socialLinks: { linkedin: "", github: "", twitter: "", instagram: "" },
//       };

//   const [user, setUser] = useState<any>(baseProfile);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [preview, setPreview] = useState<string | null>(baseProfile.profilePhoto);

//   useEffect(() => {
//     if (!isLoaded || !isSignedIn || !clerkUser) return;

//     const clerkId = clerkUser.id;
//     setLoading(true);

//     fetch(`/api/user/profile?clerkId=${clerkId}`)
//       .then((res) => {
//         if (res.status === 404) {
//           setUser(baseProfile);
//           setPreview(baseProfile.profilePhoto);
//           return null;
//         }
//         return res.json();
//       })
//       .then((data) => {
//         if (data) {
//           setUser(data);
//           setPreview(data.profilePhoto || "/default-avatar.png");
//         }
//       })
//       .finally(() => setLoading(false));
//   }, [isLoaded, isSignedIn, clerkUser]);

//   const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (!e.target.files?.[0]) return;
//     const file = e.target.files[0];
//     setImageFile(file);
//     setPreview(URL.createObjectURL(file));
//   };

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     if (!user) return;
//     const { name, value } = e.target;
//     if (name.startsWith("socialLinks.")) {
//       const key = name.split(".")[1];
//       setUser((prev: any) => ({
//         ...prev,
//         socialLinks: { ...prev.socialLinks, [key]: value },
//       }));
//     } else {
//       setUser((prev: any) => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleInterestChange = (
//     e: React.ChangeEvent<HTMLInputElement>,
//     idx: number
//   ) => {
//     const interests = [...(user?.interests || [])];
//     interests[idx] = e.target.value;
//     setUser((prev: any) => ({ ...prev, interests }));
//   };

//   const addInterest = () => {
//     setUser((prev: any) => ({
//       ...prev,
//       interests: [...(prev.interests || []), ""],
//     }));
//   };

//   const handleSave = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!user || !clerkUser) return;

//     setSaving(true);

//     const profilePhoto = user.profilePhoto;
//     if (imageFile) {
//       // TODO: upload logic, then get URL, save in profilePhoto
//     }

//     const clerkId = clerkUser.id;
//     const updateData = { ...user, clerkId, profilePhoto };

//     const method = user._id ? "PUT" : "POST";
//     const res = await fetch("/api/user/profile", {
//       method,
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(updateData),
//     });

//     setSaving(false);

//     console.log(res);

//     if (res.ok) {
//       const savedUser = await res.json();
//       setUser(savedUser);  // update the state with freshly created user including _id
//       alert("Profile created successfully!");
//     } else {
//       alert("Failed to save profile.");
//     }

//   };

//     if (!isLoaded)
//       return (
//         <div className="flex flex-col items-center justify-center py-20 space-y-4">
//           <div className="w-10 h-10 border-4 border-t-cyan-600 border-gray-300 rounded-full animate-spin"></div>
//             <p className="text-cyan-600">Loading User Info...</p>
//           </div>
//       );

//     if (!isSignedIn)
//       return (
//         <div className="text-center py-20 text-red-600 font-semibold text-cyan-600">
//           Please Login to view your Profile.
//         </div>
//       );

//     if (loading || !user)
//       return (
//         <div className="flex flex-col items-center justify-center py-20 space-y-4">
//           <div className="w-10 h-10 border-4 border-t-cyan-600 border-gray-300 rounded-full animate-spin text-cyan-600"></div>
//             <p>Loading User Profile...</p>
//           </div>
//       );


//   const inputClassNames = "w-full rounded border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-shadow p-2";

//   return (
//     <div className="max-w-3xl mx-auto my-12">
//       <div className="bg-white shadow-md rounded-xl p-8 border border-gray-100 mb-8">
//         <div className="flex items-center gap-6">
//           <label htmlFor="profile-photo" className="relative group cursor-pointer">
//             <Image
//               src={preview || "/default-avatar.png"}
//               width={100}
//               height={100}
//               className="rounded-full object-cover border-4 border-cyan-100 group-hover:brightness-75 transition"
//               alt="Profile Photo"
//             />
//             <div className="absolute bottom-0 left-1/2 -translate-x-1/2 px-2 py-1 text-xs bg-cyan-600 text-white rounded opacity-80 group-hover:opacity-100 transition">
//               Change
//             </div>
//             <input
//               type="file"
//               id="profile-photo"
//               accept="image/*"
//               className="hidden"
//               onChange={handleImagePick}
//             />
//           </label>
//           <div>
//             <h2 className="text-2xl font-bold">
//               {user.firstName || ""} {user.lastName || "Your Name"}
//             </h2>
//             <p className="text-gray-500">@{user.userId || "yourusername"}</p>
//           </div>
//         </div>
//       </div>

//       <form
//         onSubmit={handleSave}
//         className="bg-white rounded-xl shadow-md p-8 border border-gray-100 flex flex-col gap-8"
//       >
//         <div>
//           <h3 className="text-lg font-semibold text-cyan-700 mb-4">User Information</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block mb-1 font-medium">First Name</label>
//               <input
//                 type="text"
//                 name="firstName"
//                 placeholder="Enter your first name"
//                 value={user.firstName || ""}
//                 onChange={handleChange}
//                 className={inputClassNames}
//                 required
//               />
//             </div>
//             <div>
//               <label className="block mb-1 font-medium">Last Name</label>
//               <input
//                 type="text"
//                 name="lastName"
//                 placeholder="Enter your last name"
//                 value={user.lastName || ""}
//                 onChange={handleChange}
//                 className={inputClassNames}
//               />
//             </div>
//             <div>
//               <label className="block mb-1 font-medium">Username</label>
//               <input
//                 type="text"
//                 name="userId"
//                 placeholder="Unique username"
//                 value={user.userId || ""}
//                 onChange={handleChange}
//                 className={inputClassNames}
//                 required
//               />
//             </div>
//             <div>
//               <label className="block mb-1 font-medium">Email</label>
//               <input
//                 type="email"
//                 name="email"
//                 placeholder="Email"
//                 value={user.email || ""}
//                 onChange={handleChange}
//                 className={inputClassNames + " cursor-not-allowed bg-gray-100"}
//                 required
//                 disabled
//               />
//             </div>
//             <div>
//               <label className="block mb-1 font-medium">College</label>
//               <input
//                 type="text"
//                 name="college"
//                 placeholder="Your college or university"
//                 value={user.college || ""}
//                 onChange={handleChange}
//                 className={inputClassNames}
//               />
//             </div>
//             <div>
//               <label className="block mb-1 font-medium">Department</label>
//               <input
//                 type="text"
//                 name="department"
//                 placeholder="Department, e.g. CSE"
//                 value={user.department || ""}
//                 onChange={handleChange}
//                 className={inputClassNames}
//               />
//             </div>
//             <div>
//               <label className="block mb-1 font-medium">Year</label>
//               <input
//                 type="number"
//                 name="year"
//                 placeholder="Year, e.g. 1, 2, 3, 4"
//                 value={user.year || ""}
//                 onChange={handleChange}
//                 min={1}
//                 max={4}
//                 className={inputClassNames}
//               />
//             </div>
//           </div>
//           <div className="mt-4">
//             <label className="block mb-1 font-medium">Bio</label>
//             <textarea
//               name="bio"
//               placeholder="Share something about yourself (max 200 chars)"
//               value={user.bio || ""}
//               onChange={handleChange}
//               rows={3}
//               maxLength={200}
//               className={inputClassNames + " resize-none"}
//             />
//           </div>
//         </div>

//         <div>
//           <h3 className="text-lg font-semibold text-cyan-700 mb-4">Interests</h3>
//           <div className="flex flex-wrap gap-2">
//             {(user.interests || []).map((tag: string, i: number) => (
//               <div key={i} className="w-auto">
//                 <label className="block text-sm mb-1">Interest #{i + 1}</label>
//                 <input
//                   type="text"
//                   value={tag}
//                   onChange={(e) => handleInterestChange(e, i)}
//                   placeholder={`Interest #${i + 1}`}
//                   className={inputClassNames + " w-auto"}
//                 />
//               </div>
//             ))}
//             <Button
//               variant="outline"
//               size="sm"
//               type="button"
//               onClick={addInterest}
//               className="hover:shadow-cyan-200 mt-6"
//             >
//               + Add
//             </Button>
//           </div>
//         </div>

//         <div>
//           <h3 className="text-lg font-semibold text-cyan-700 mb-4">Social Links</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//             <div>
//               <label className="block mb-1 font-medium">LinkedIn</label>
//               <input
//                 type="text"
//                 name="socialLinks.linkedin"
//                 value={user.socialLinks?.linkedin || ""}
//                 onChange={handleChange}
//                 placeholder="LinkedIn URL"
//                 className={inputClassNames}
//               />
//             </div>
//             <div>
//               <label className="block mb-1 font-medium">GitHub</label>
//               <input
//                 type="text"
//                 name="socialLinks.github"
//                 value={user.socialLinks?.github || ""}
//                 onChange={handleChange}
//                 placeholder="GitHub URL"
//                 className={inputClassNames}
//               />
//             </div>
//             <div>
//               <label className="block mb-1 font-medium">Twitter</label>
//               <input
//                 type="text"
//                 name="socialLinks.twitter"
//                 value={user.socialLinks?.twitter || ""}
//                 onChange={handleChange}
//                 placeholder="Twitter URL"
//                 className={inputClassNames}
//               />
//             </div>
//             <div>
//               <label className="block mb-1 font-medium">Instagram</label>
//               <input
//                 type="text"
//                 name="socialLinks.instagram"
//                 value={user.socialLinks?.instagram || ""}
//                 onChange={handleChange}
//                 placeholder="Instagram URL"
//                 className={inputClassNames}
//               />
//             </div>
//           </div>
//         </div>

//         <div className="flex justify-end">
//           <Button
//             type="submit"
//             disabled={saving}
//             className="bg-cyan-600 hover:bg-cyan-700 px-8 py-2 text-lg rounded-full shadow hover:shadow-cyan-200 transition"
//           >
//             {saving ? (
//               <div className="flex items-center space-x-2">
//                 <div className="w-5 h-5 border-4 border-t-white border-gray-300 rounded-full animate-spin"></div>
//                 <span>Saving...</span>
//               </div>
//             ) : (
//               "Save Profile"
//             )}
//           </Button>
//         </div>
//       </form>
//     </div>
//   );
// }
