"use client";

import React from "react";
import { FileIcon } from "lucide-react";
import { useRouter } from "next/navigation";

type Post = {
  _id: string;
  description: string;
  imageUrls?: string[];
  createdAt?: string;
};

type PostsComponentProps = {
  posts: Post[];
};

const isImageUrl = (url: string) =>
  /\.(jpeg|jpg|png|gif|bmp|webp|svg)$/i.test(url);

const PostsComponent: React.FC<PostsComponentProps> = ({ posts }) => {
    const router = useRouter();

  if (!posts || posts.length === 0) {
    return <p className="text-gray-600 italic text-center">No posts available.</p>;
  }

  return (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">     
   {posts.map((post) => (
        <div
          key={post._id}
          onClick={() => router.push(`/dashboard/posts/${post._id}`)}
          className="border rounded p-4 bg-white shadow hover:shadow-lg transition max-w-full"
        >
          <p className="mb-2 text-gray-800 whitespace-pre-wrap">{post.description}</p>

          {/* Images */}
          {post.imageUrls && post.imageUrls.some(isImageUrl) && (
            <div className="flex flex-wrap gap-4 mt-2">
              {post.imageUrls.filter(isImageUrl).map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt={`Post image ${idx + 1}`}
                  className="max-w-[200px] max-h-36 object-cover rounded border"
                  loading="lazy"
                />
              ))}
            </div>
          )}

          {/* Files (not images) */}
          {post.imageUrls && post.imageUrls.some((url) => !isImageUrl(url)) && (
            <div className="flex flex-col gap-2 mt-4">
              {post.imageUrls.filter((url) => !isImageUrl(url)).map((url, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 bg-cyan-50 border border-cyan-200 p-2 rounded"
                >
                  <FileIcon className="w-5 h-5 text-cyan-600" />
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-700 underline font-medium"
                    download
                    onClick={(e) => e.stopPropagation()}
                  >
                    Download {url.split("/").pop()?.slice(0, 40) || "file"}
                  </a>
                </div>
              ))}
            </div>
          )}

          {post.createdAt && (
            <p className="text-xs text-gray-500 mt-2">
              {new Date(post.createdAt).toLocaleString()}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default PostsComponent;



