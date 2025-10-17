"use client";

import React, { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ImagesIcon, SmileIcon, PlusIcon, FileIcon, X } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import { uploadFileToCloudinary } from "@/lib/uploadCloudinary";

type PostDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  src?: string;
  name: string;
  currentUserId: string;
  mode: "create" | "edit";
  initialContent?: string;
  initialImageUrl?: string[];
  postIdToEdit?: string;
  onSave?: () => void;
};

const PostDialog = ({
  open,
  setOpen,
  src,
  name,
  currentUserId,
  mode,
  initialContent = "",
  initialImageUrl = [],
  postIdToEdit,
  onSave,
}: PostDialogProps) => {
  const [content, setContent] = useState(initialContent);
  const [files, setFiles] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState(initialImageUrl);
  const [picker, setPicker] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setContent(initialContent);
    setImageUrls(initialImageUrl);
    setFiles([]);
    setError(null);
  }, [initialContent,open]);

  const EmojiHandle = (emoji: any) => {
    const emojiChar =
      emoji.native ||
      (emoji?.unified &&
        String.fromCodePoint(...emoji.unified.split("-").map((u: string) => parseInt(u, 16)))) ||
      "";
    if (textareaRef.current) {
      const element = textareaRef.current;
      const start = element.selectionStart || 0;
      const end = element.selectionEnd || 0;
      setContent((prev) => {
        const newText = prev.slice(0, start) + emojiChar + prev.slice(end);
        setTimeout(() => {
          element.selectionStart = element.selectionEnd = start + emojiChar.length;
          element.focus();
        }, 0);
        return newText;
      });
    }
    setPicker(false);
  };

  const handlePost = async () => {
    // Prevent post if no content and no files or uploaded urls
    if (!content.trim() && files.length === 0 && imageUrls.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      let uploadedImageUrls = imageUrls;

      if (files.length > 0) {
        // Upload all files in parallel
        const urls = await Promise.all(files.map((file) => uploadFileToCloudinary(file)));
        uploadedImageUrls = [...uploadedImageUrls, ...urls];
        setImageUrls(uploadedImageUrls);
      }

      const postData = {
        description: content.trim(),
        user: currentUserId,
        imageUrls: uploadedImageUrls.length > 0 ? uploadedImageUrls : undefined,
      };

      let res: Response;

      if (mode === "create") {
        res = await fetch("/api/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(postData),
        });
      } else {
        if (!postIdToEdit) throw new Error("Post ID missing for edit mode");
        res = await fetch(`/api/posts/${postIdToEdit}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(postData),
        });
      }

      if (res.ok) {
        alert(mode === "create" ? "Posted successfully" : "Edited successfully");
        setContent("");
        setFiles([]);
        setImageUrls([]);
        setOpen(false);
        if (onSave) onSave();
      } else {
        const errorData = await res.json();
        alert("Failed to submit post: " + (errorData.error || "Unknown error"));
      }
    } catch (err) {
      setError("Error submitting post");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handlePost();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files)]);
      setError(null);
    }
  };

  const handleRemoveFile = (indexToRemove: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 max-w-lg rounded-xl min-w-[340px]">
        <DialogHeader className="flex justify-start border-b p-4 pb-2">
          <DialogTitle className="sr-only">{mode === "create" ? "Create a New Post" : "Edit Post"}</DialogTitle>
          <div className="flex items-center gap-3">
            {src ? (
              <img src={src} alt="User" className="rounded-full h-10 w-10 object-cover" draggable={false} />
            ) : (
              <div className="rounded-full h-10 w-10 bg-gray-200" />
            )}
            <div>
              <div className="font-semibold text-black">{name}</div>
              <div className="text-xs text-gray-500">{mode === "create" ? "Post to Anyone" : "Edit your Post"}</div>
            </div>
          </div>
        </DialogHeader>


        <form onSubmit={handleSubmit} className="flex flex-col p-4 gap-4">
          <textarea
            ref={textareaRef}
            autoFocus
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What do you want to talk about? Share your ideas, thoughts, or questions..."
            className="w-full min-h-[80px] resize-none border-none focus:ring-0 bg-transparent text-lg outline-none"
            disabled={loading}
          />

          {(files.length > 0) && (
            <div className="flex flex-wrap gap-2 mt-2 max-h-64 overflow-auto">
              {files.map((file, idx) => (
                <div key={idx} className="relative border rounded p-1 max-w-[120px]">
                  {file.type.startsWith("image/") ? (
                    <img src={URL.createObjectURL(file)} alt={`preview-${idx}`} className="max-h-28 max-w-full object-contain rounded" />
                  ) : (
                    <div className="flex items-center gap-2 px-2 py-1">
                      <FileIcon className="h-6 w-6 text-gray-500" />
                      <span className="text-xs truncate max-w-[80px]">{file.name}</span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(idx)}
                    className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-gray-100"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <div className="flex items-center gap-4 relative">
            <input
              type="file"
              id="post-image-upload"
              name="image"
              className="hidden"
              accept="image/*,video/*,application/pdf,text/plain,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              multiple
              onChange={handleFileChange}
              disabled={loading}
            />
            <input
              type="file"
              id="post-file-upload"
              name="file"
              className="hidden"
              multiple
              onChange={handleFileChange}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setMenuOpen((s) => !s)}
              className="text-cyan-400 hover:text-cyan-600"
              aria-label="Toggle Add Menu"
              disabled={loading}
            >
              <PlusIcon className="h-6 w-6" />
            </button>
            {menuOpen && (
              <div className="absolute bottom-full mb-2 left-0 bg-white border rounded-lg shadow p-2 flex flex-col gap-2 z-50">
                <label
                  htmlFor="post-image-upload"
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
                >
                  <ImagesIcon className="h-5 w-5 text-cyan-500" /> Image
                </label>
                <label
                  htmlFor="post-file-upload"
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
                >
                  <FileIcon className="h-5 w-5 text-indigo-500" /> File
                </label>


                {/* EMOJI */}
                <button
                  type="button"
                  onClick={() => {
                    setPicker((s) => !s);
                    setMenuOpen(false);
                  }}
                  className="flex items-center gap-2 hover:bg-gray-100 px-2 py-1 rounded"
                >
                  <SmileIcon className="h-5 w-5 text-yellow-500" /> Emoji
                </button>
              </div>
            )}
            {picker && (
              <div className="absolute z-50 bottom-full mt-2 mb-2 left-4">
                <EmojiPicker onEmojiClick={(emojiData) => EmojiHandle({ native: emojiData.emoji })} />
              </div>
            )}
          </div>

          <DialogFooter>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading || (!content.trim() && files.length === 0 && imageUrls.length === 0)}
                className={`${
                  loading ? "bg-cyan-300 cursor-wait" : "bg-cyan-500 hover:bg-cyan-600 cursor-pointer"
                } text-white font-semibold rounded-full px-6 py-2 transition shadow`}
              >
                {loading ? "Saving..." : mode === "create" ? "Post" : "Save"}
              </button>
            </div>
          </DialogFooter>
          {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PostDialog;

