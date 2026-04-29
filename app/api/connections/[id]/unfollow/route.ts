import { deleteCache } from "@/lib/cache/cache";
import { connectDB } from "@/lib/db";
import { checkLimiter } from "@/lib/rate/checkLimiter";
import { RATE_LIMITS } from "@/lib/rate/constants";
import { unfollowUser } from "@/lib/services/connection.service";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    await connectDB();

    const { userId: currentClerkId } = getAuth(req);
    if (!currentClerkId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    checkLimiter(currentClerkId,"CONNECTION_UNFOLLOW",{
      windowMs : 60 * 1000,
      max : 20 
    })
    
    const { id: targetUserId } = await context.params;
    if (!targetUserId) {
      return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
    }

    const result = await unfollowUser(currentClerkId, targetUserId);

    if(result.status===200 || result.status===201){
      deleteCache(`requests:${currentClerkId}`);
      deleteCache(`requests:${targetUserId}`);
    }

    return NextResponse.json(
      { message: result.message, data: result.data },
      { status: result.status }
    );
  } catch (error : any) {
    if(error.message.includes("Too many requests")){
      return NextResponse.json({error : "Please Try Again Later"},{status:429});
    }
    console.error("Error in unfollow API:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}






// import { connectDB } from "@/lib/db";
// import { User } from "@/models/user.model";
// import { getAuth } from "@clerk/nextjs/server";
// import { NextRequest, NextResponse } from "next/server";

// export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
//   try {
//     await connectDB();

//     const auth = getAuth(req);
//     const currentClerkId = auth.userId;
//     if (!currentClerkId)
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

//     const targetUserId = params.id;
//     if (!targetUserId)
//       return NextResponse.json({ message: "Invalid User ID" }, { status: 400 });

//     const currentUser = await User.findOne({ clerkId: currentClerkId });
//     const targetUser = await User.findById(targetUserId);

//     if (!currentUser || !targetUser) {
//       return NextResponse.json({ message: "User(s) not found" }, { status: 404 });
//     }

//     // Remove each other from connection lists
//     currentUser.connections = currentUser.connections.filter(
//       (id) => !id.equals(targetUser._id)
//     );
//     targetUser.connections = targetUser.connections.filter(
//       (id) => !id.equals(currentUser._id)
//     );

//     // Remove any pending requests between them
//     currentUser.sentRequests = currentUser.sentRequests.filter(
//       (id) => !id.equals(targetUser._id)
//     );
//     currentUser.receivedRequests = currentUser.receivedRequests.filter(
//       (id) => !id.equals(targetUser._id)
//     );
//     targetUser.sentRequests = targetUser.sentRequests.filter(
//       (id) => !id.equals(currentUser._id)
//     );
//     targetUser.receivedRequests = targetUser.receivedRequests.filter(
//       (id) => !id.equals(currentUser._id)
//     );

//     await Promise.all([currentUser.save(), targetUser.save()]);

//     return NextResponse.json({ message: "Unfollowed successfully" }, { status: 200 });
//   } catch (error) {
//     console.error("Error in unfollow API:", error);
//     return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
//   }
// }

