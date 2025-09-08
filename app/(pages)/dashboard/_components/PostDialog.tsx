"use client";
import React, { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ImagesIcon, SmileIcon, PlusIcon, FileIcon, X } from "lucide-react";
import Picker from "@emoji-mart/react";
import emojiData from "@emoji-mart/data";

type PostDialogProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
    src?: string; // user profile image (optional)
    name: string; 
    currentUserId: string;
    mode: "create" | "edit";
    initialContent?: string;
    initialImageUrl?: string;
    postIdToEdit?: string;
    onSave?: () => void; // callback after save to refresh parent
};

const PostDialog = ({
    open,
    setOpen,
    src,
    name,
    currentUserId,
    mode,
    initialContent = "",
    initialImageUrl = "",
    postIdToEdit,
    onSave,
}: PostDialogProps) => {
    const [content, setContent] = useState(initialContent);
    const [file, setFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState(initialImageUrl);
    const [picker, setPicker] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setContent(initialContent);
        setImageUrl(initialImageUrl);
        setFile(null);
    }, [initialContent, initialImageUrl, open]);

    const EmojiHandle = (emoji: any) => {
        const emojiChar =
        emoji.native ||
        (emoji?.unified &&
            String.fromCodePoint(
            ...emoji.unified.split("-").map((u: string) => parseInt(u, 16))
            )) ||
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

  // Placeholder function for file upload; Replace with your cloud upload logic
    const uploadFile = async (fileToUpload: File): Promise<string> => {
    // Simulate upload delay & URL return:
    return new Promise((resolve) =>
        setTimeout(() => resolve(URL.createObjectURL(fileToUpload)), 1000)
        );
    };

    const handlePost = async () => {
        if (!content.trim() && !file && !imageUrl) return;

        setLoading(true);

        let uploadedImageUrl = imageUrl;
        if (file) {
            uploadedImageUrl = await uploadFile(file);
            setImageUrl(uploadedImageUrl);
        }

        const postData = {
            description: content.trim(),
            user: currentUserId,
            imageUrl: uploadedImageUrl || undefined,
        };

        try {
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
            setFile(null);
            setImageUrl("");
            setOpen(false);
            if (onSave) onSave();
            } else {
                const errorData = await res.json();
                alert("Failed to submit post: " + (errorData.error || "Unknown error"));
            }
        } catch (err) {
            alert("Error submitting post");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() && !file && !imageUrl) return;
        handlePost();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleRemoveImage = () => {
        setFile(null);
        setImageUrl("");
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
            placeholder="What do you want to talk about?"
            className="w-full min-h-[80px] resize-none border-none focus:ring-0 bg-transparent text-lg outline-none"
          />

          {(file || imageUrl) && (
            <div className="relative mt-2 border rounded-lg p-2 max-h-64 overflow-hidden">
              {(file?.type.startsWith("image/") || imageUrl) ? (
                <img
                  src={file ? URL.createObjectURL(file) : imageUrl}
                  alt="preview"
                  className="max-h-60 rounded-md object-contain"
                />
              ) : (
                <div className="flex items-center gap-2">
                  <FileIcon className="h-6 w-6 text-gray-500" />
                  <span className="text-gray-700 truncate">{file?.name}</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          <div className="flex items-center gap-4 relative">
            {/* Hidden Inputs */}
            <input
              type="file"
              id="post-image-upload"
              name="image"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />

            <input type="file" id="post-file-upload" name="file" className="hidden" onChange={handleFileChange} />

            {/* Plus Menu */}
            <button
              type="button"
              onClick={() => setMenuOpen((s) => !s)}
              className="text-cyan-400 hover:text-cyan-600"
              aria-label="Toggle Add Menu"
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
                <Picker data={emojiData} onEmojiSelect={EmojiHandle} />
              </div>
            )}
          </div>

          <DialogFooter>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading || (!content.trim() && !file && !imageUrl)}
                className={`${
                  loading
                    ? "bg-cyan-300 cursor-wait"
                    : "bg-cyan-500 hover:bg-cyan-600 cursor-pointer"
                } text-white font-semibold rounded-full px-6 py-2 transition shadow`}
              >
                {loading ? "Saving..." : mode === "create" ? "Post" : "Save"}
              </button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PostDialog;













// "use client";
// import { Dialog , DialogContent, DialogFooter , DialogHeader , DialogTitle } from "@/components/ui/dialog";
// import { ImagesIcon, SmileIcon, PlusIcon, FileIcon, X } from "lucide-react";
// import React, { useRef, useState } from "react";
// import Picker from "@emoji-mart/react";
// import emojiData from "@emoji-mart/data";

// type PostDialogProps = {
//     open: boolean;
//     setOpen: (open: boolean) => void;
//     src?: string;
//     name: string;
//     currentUserId:string;
// };

// const PostDialog = ({ open, setOpen, src, name , currentUserId }: PostDialogProps) => {
//     const [content, setContent] = useState("");
//     const [file, setFile] = useState<File | null>(null);
//     const [picker, setPicker] = useState(false);
//     const [menuOpen, setMenuOpen] = useState(false);
//     const textareaRef = useRef<HTMLTextAreaElement>(null);

//     const EmojiHandle = (emoji: any) => {
//         const emojiChar =
//         emoji.native ||
//         (emoji?.unified &&
//             String.fromCodePoint(
//                 ...emoji.unified.split("-").map((u: string) => parseInt(u, 16))
//             )) ||
//         "";

//         if (textareaRef.current) {
//         const element = textareaRef.current;
//         const start = element.selectionStart || 0;
//         const end = element.selectionEnd || 0;

//         setContent((prev) => {
//             const newText = prev.slice(0, start) + emojiChar + prev.slice(end);
//             setTimeout(() => {
//                 element.selectionStart = element.selectionEnd = start + emojiChar.length;
//                 element.focus();
//             }, 0);
//             return newText;
//         });
//         }
//         setPicker(false);  // close picker after insert
//     };

//     // const handlePost = async() => {
//     //     setOpen(false);
//     //     setContent("");
//     //     setFile(null);
//     //     alert("Posted successfully");
//     //     console.log(content, file);
//     // };

//     const handlePost = async () => {
//     if (!content.trim() && !file) return;

//     // For now, ignoring file upload, sending only content and user id
//     const postData = {
//         description: content.trim(),
//         user: currentUserId,
//     };

//     try {
//         const res = await fetch("/api/posts", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(postData),
//         });

//         if (res.ok) {
//             alert("Posted successfully");
//             setContent("");
//             setFile(null);
//             setOpen(false);
//         } else {
//             const errorData = await res.json();
//             alert("Failed to post: " + (errorData.error || "Unknown error"));
//         }
//     } catch (err) {
//             alert("Error posting");
//             console.error(err);
//     }
//     };

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         if (!content.trim() && !file) return; // Prevent empty posts
//         handlePost();
//     };

//     const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         if (e.target.files && e.target.files.length > 0) {
//             setFile(e.target.files[0]);
//         }
//     };

//     return (
//     <Dialog open={open} onOpenChange={setOpen}>
//         <DialogContent className="p-0 max-w-lg rounded-xl min-w-[340px]">
//             <DialogHeader className="flex justify-start border-b p-4 pb-2">
//                 <DialogTitle className="sr-only">Create a New Post</DialogTitle>
//                 <div className="flex items-center gap-3">
//                     <img
//                         src={src}
//                         alt="User"
//                         className="rounded-full h-10 w-10 object-cover"
//                         draggable={false}
//                     />
//                     <div>
//                         <div className="font-semibold text-black">{name}</div>
//                         <div className="text-xs text-gray-500">Post to Anyone</div>
//                     </div>
//                 </div>
//             </DialogHeader>

//             <form onSubmit={handleSubmit} className="flex flex-col p-4 gap-4">
//             <textarea
//                 ref={textareaRef}
//                 autoFocus
//                 value={content}
//                 onChange={(e) => setContent(e.target.value)}
//                 placeholder="What do you want to talk about?"
//                 className="w-full min-h-[80px] resize-none border-none focus:ring-0 bg-transparent text-lg outline-none"
//             />

//             {/* Preview Section */}
//             {file && (
//                 <div className="relative mt-2 border rounded-lg p-2 max-h-64 overflow-hidden">
//                 {file.type.startsWith("image/") ? (
//                 <img
//                     src={URL.createObjectURL(file)}
//                     alt="preview"
//                     className="max-h-60 rounded-md object-contain"
//                 />
//                 ) : (
//                     <div className="flex items-center gap-2">
//                         <FileIcon className="h-6 w-6 text-gray-500" />
//                         <span className="text-gray-700 truncate">{file.name}</span>
//                     </div>
//                 )}

//                     <button
//                     type="button"
//                     onClick={() => setFile(null)}
//                     className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-gray-100">
//                         <X className="h-4 w-4" />
//                     </button>
//                 </div>
//             )}

//             {/* Action Bar */}
//             <div className="flex items-center gap-4 relative">
//                 {/* Hidden Inputs */}
//                 <input
//                 type="file"
//                 id="post-image-upload"
//                 name="image"
//                 className="hidden"
//                 accept="image/*"
//                 onChange={handleFileChange} />

//                 <input
//                 type="file"
//                 id="post-file-upload"
//                 name="file"
//                 className="hidden"
//                 onChange={handleFileChange} />

//                 {/* Plus Menu */}
//                 <button
//                 type="button"
//                 onClick={() => setMenuOpen((s) => !s)}
//                 className="text-cyan-400 hover:text-cyan-600"
//                 aria-label="Toggle Add Menu">
//                 <PlusIcon className="h-6 w-6" />
//                 </button>

//                 {menuOpen && (
//                 <div className="absolute bottom-full mb-2 left-0 bg-white border rounded-lg shadow p-2 flex flex-col gap-2 z-50">
//                     <label
//                     htmlFor="post-image-upload"
//                     className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded">
//                         <ImagesIcon className="h-5 w-5 text-cyan-500" /> Image
//                     </label>

//                     <label
//                     htmlFor="post-file-upload"
//                     className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded">
//                         <FileIcon className="h-5 w-5 text-indigo-500" /> File
//                     </label>
//                     <button
//                     type="button"
//                     onClick={() => {
//                         setPicker((s) => !s);
//                         setMenuOpen(false);
//                     }}
//                     className="flex items-center gap-2 hover:bg-gray-100 px-2 py-1 rounded">
//                         <SmileIcon className="h-5 w-5 text-yellow-500" /> Emoji
//                     </button>
//                 </div>
//             )}

//                 {/* Emoji Picker */}
//                 {picker && (
//                     <div className="absolute z-50 bottom-full mt-2 mb-2 left-4">
//                         <Picker data={emojiData} onEmojiSelect={EmojiHandle} />
//                     </div>
//                 )}
//             </div>

//             <DialogFooter>
//                 <div className="flex justify-end">
//                 <button
//                     type="submit"
//                     disabled={!content.trim() && !file}
//                     className="bg-cyan-500 text-white font-semibold rounded-full px-6 py-2 transition shadow hover:bg-cyan-600 hover:shadow-[0_0_10px_#22d3ee] disabled:bg-gray-200 disabled:text-gray-400">
//                 Post
//                 </button>
//                 </div>
//             </DialogFooter>
//             </form>
//         </DialogContent>
//     </Dialog>
//   );
// };

// export default PostDialog;
