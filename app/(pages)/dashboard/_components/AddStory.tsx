"use client";

import axios from "axios";

export default function AddStory({ userId, onUpload }: any) {
  const handleUpload = async (e: any) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);

      // const uploadRes = await axios.post("/api/upload", formData);
      // console.log(uploadRes.data);
      // await axios.post("/api/stories", {
      //   mediaUrl: uploadRes.data.secure_url,
      //   user: userId,
      // });

      const uploadRes = await axios.post("/api/upload", formData);

      await axios.post("/api/stories", {
        mediaUrl: uploadRes.data.url,
        fileType: file.type.startsWith("video") ? "video" : "image",
      });

      // refresh UI
      if (onUpload) onUpload();
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  return (
    <label className="cursor-pointer flex flex-col items-center">
      <div className="w-16 h-16 border-black/50 rounded-full hover:bg-gray-300 bg-gray-400 transition-colors flex items-center justify-center text-xl">
        +
      </div>
      <span className="text-xs mt-1">Your Story</span>
      <input type="file" hidden onChange={handleUpload} />
    </label>
  );
}