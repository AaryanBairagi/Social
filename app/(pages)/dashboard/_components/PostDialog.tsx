"use client";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Image } from "lucide-react";
import React, { useState } from "react";

type PostDialogProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
    src?: string;
    name: string;
};

const PostDialog = ({ open, setOpen, src, name }: PostDialogProps) => {
    const [content, setContent] = useState("");
    const [file, setFile] = useState<File | null>(null);

    const handlePost = () => {
    // TODO: Replace with actual post logic handling content and file
    setOpen(false);
    setContent("");
    setFile(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return; // Prevent empty posts
    handlePost();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
        setFile(e.target.files[0]);
        }
    };

    return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 max-w-lg rounded-xl min-w-[340px]">
            <DialogHeader className="flex justify-start border-b p-4 pb-2">
            <DialogTitle className="sr-only">Create a New Post</DialogTitle>
            <div className="flex items-center gap-3">
                <img
                src={src}
                alt="User"
                className="w-10 h-10 rounded-full object-cover"
                draggable={false}
                />
                <div>
                    <div className="font-semibold text-black">{name}</div>
                    <div className="text-xs text-gray-500">Post to Anyone</div>
                </div>
            </div>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="flex flex-col p-4 gap-4">
            <textarea
                autoFocus
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What do you want to talk about?"
                className="w-full min-h-[80px] resize-none border-none focus:ring-0 bg-transparent text-lg outline-none"
            />

          {/* File Input & Label */}
            <div className="flex items-center gap-4">
                <input
                type="file"
                id="post-image-upload"
                name="image"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
                />
                <label
                    htmlFor="post-image-upload"
                    className="flex cursor-pointer items-center gap-2 text-cyan-400 hover:text-cyan-600"
                    >
                    <Image className="h-5 w-5" />
                </label>
                {/* Optionally display file name or thumbnail */}
                {file && <span className="text-gray-600 truncate max-w-xs">{file.name}</span>}
            </div>

            <DialogFooter>
                <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={!content.trim()}
                    className="bg-cyan-500 text-white font-semibold rounded-full px-6 py-2 transition shadow hover:bg-cyan-600 hover:shadow-[0_0_10px_#22d3ee] disabled:bg-gray-200 disabled:text-gray-400"
                >
                    Post
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
// import { Button } from "@/components/ui/button";
// import {
//     Dialog,
//     DialogContent,
//     DialogFooter,
//     DialogHeader,
//     DialogTitle,
// } from "@/components/ui/dialog";
// import { Image } from "lucide-react";
// import React, { useState } from "react";

// type PostDialogProps = {
//     open: boolean;
//     setOpen: (open: boolean) => void;
//     src?: string;
//     name: string;
// };

// const PostDialog = ({ open, setOpen, src, name }: PostDialogProps) => {
//     const [content, setContent] = useState("");

//     const handlePost = () => {
//         // TODO: Replace with actual post logic
//         setOpen(false);
//         setContent("");
//     };

//     return (
//     <Dialog open={open} onOpenChange={setOpen}>
//         <DialogContent className="p-0 max-w-lg rounded-xl min-w-[340px]">
//             <DialogHeader className="flex justify-start border-b p-4 pb-2">
//             <DialogTitle className="sr-only">Create a New Post</DialogTitle>  
//             <div className="flex items-center gap-3">
//                 <img src={src} alt="User" className="w-10 h-10 rounded-full object-cover" />
//                 <div>
//                     <div className="font-semibold text-black">{name}</div>
//                     <div className="text-xs text-gray-500">Post to Anyone</div>
//                 </div>
//             </div>
//             </DialogHeader>

//             <form action="">
//                 <div className="flex flex-col p-4">
//                 <textarea
//                     autoFocus
//                     value={content}
//                     onChange={(e) => setContent(e.target.value)}
//                     placeholder="What do you want to talk about?"
//                     className="w-full min-h-[80px] resize-none border-none focus:ring-0 bg-transparent text-lg outline-none mb-3" />

//                     {/* Emoji */}
//                     <div>

//                     </div>

//                 </div>
            

//             <DialogFooter>
//                 <div className="flex items-center gap-4">
//                     yha par imagwe upload
//                     <input type="file" name="image" className="hidden" accept="image/* " />
//                 </div>
//                 <div className="flex justify-end px-4 pb-3">
//                                 <Button variant="ghost">
//                 <Image className="text-cyan-400"/>
//                 <span>Media</span>
//             </Button>
//                     <button
//                         onClick={handlePost}
//                         disabled={!content.trim()}
//                         className="bg-cyan-500 text-white font-semibold rounded-full px-6 py-2 transition shadow
//                         hover:bg-cyan-600 hover:shadow-[0_0_10px_#22d3ee]">
//                         Post
//                     </button>

//                 </div>
//             </DialogFooter>
//             </form> 

//         </DialogContent>
//     </Dialog>
//     );
// };

// export default PostDialog;
