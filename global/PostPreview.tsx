import { Heart, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export const PostPreview = ({ post }: any) => {
  const router = useRouter();

  const postId = post?._id || post?.postId;

  if (!postId) {
    console.error("❌ Invalid post object:", post);
    return null;
  }

  const likeCount = post?.likes?.length || 0;
  const commentCount = post?.comments?.length || 0;

  return (
    <div
      onClick={() => router.push(`/dashboard/posts/${postId}`)}
      className="rounded-xl overflow-hidden border border-gray-200 bg-white cursor-pointer hover:shadow-md transition max-w-xs"
    >
      {/* Image */}
      {post?.imageUrls?.[0] && (
        <img
          src={post.imageUrls[0]}
          className="w-full h-40 object-cover"
        />
      )}

      {/* Content */}
      <div className="p-3">
        <div className="text-sm font-semibold text-gray-800">
          @{post?.user?.username || "unknown"}
        </div>

        <div className="text-xs text-gray-600 mt-1 line-clamp-2">
          {post?.description || "Shared post"}
        </div>

        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Heart className="w-3 h-3" />
            {likeCount}
          </div>

          <div className="flex items-center gap-1">
            <MessageCircle className="w-3 h-3" />
            {commentCount}
          </div>
        </div>
      </div>
    </div>
  );
};






// import { useRouter } from "next/navigation";

// export const PostPreview = ({ post }: any) => {
//   const router = useRouter();

//   const postId = post?._id || post?.postId;

//   if (!postId) {
//     console.error("❌ Invalid post object:", post);
//     // return null
//   }

//   return (
//     <div
//       onClick={() => router.push(`/dashboard/posts/${postId}`)}
//       className="rounded-xl overflow-hidden border border-gray-200 bg-white cursor-pointer hover:shadow-md transition max-w-xs"
//     >
//       {/* Image */}
//       {post?.imageUrls?.[0] && (
//         <img
//           src={post.imageUrls[0]}
//           className="w-full h-40 object-cover"
//         />
//       )}

//       {/* Content */}
//       <div className="p-3">
//         <div className="text-sm font-semibold text-gray-800">
//           @{post?.user?.username || "unknown"}
//         </div>

//         <div className="text-xs text-gray-600 mt-1 line-clamp-2">
//           {post?.description || "Shared post"}
//         </div>
//       </div>
//     </div>
//   );
// };