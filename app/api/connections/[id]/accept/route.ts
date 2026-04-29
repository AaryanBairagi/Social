import { deleteCache } from "@/lib/cache/cache";
import { connectDB } from "@/lib/db";
import { createNotification } from "@/lib/notifications/notifications.service";
import { checkLimiter } from "@/lib/rate/checkLimiter";
import { acceptConnectionRequest } from "@/lib/services/connection.service";
import { currentUser, getAuth } from "@clerk/nextjs/server";
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

    checkLimiter(currentClerkId, "CONNECTION_ACCEPT", {
      windowMs: 60 * 1000,
      max: 20,
    });

    const { id: requesterId } = await context.params;
    if (!requesterId) {
      return NextResponse.json({ message: "Invalid requester ID" }, { status: 400 });
    }

    const result = await acceptConnectionRequest(currentClerkId, requesterId);

    if(result.success){
      deleteCache(`requests:${currentClerkId}`);
      deleteCache(`requests:${requesterId}`);

      //CREATE NOTIFICATION
      await createNotification({
        userId : requesterId,
        actorId : currentUser._id.toString(),
        type : "FOLLOW_ACCEPT"
      });
    }

    return NextResponse.json(
      { message: result.message, data: result.data },
      { status: result.status }
    );
  } catch (error : any) {
    if(error.message.includes("Too many requests")){
      return NextResponse.json({error : "Please Try Again Later"},{status:429});
    }
    console.error("Accept error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}



// import { connectDB } from "@/lib/db";
// import { User } from "@/models/user.model";
// import { getAuth } from "@clerk/nextjs/server";
// import { Crimson_Text } from "next/font/google";
// import { NextRequest, NextResponse } from "next/server";

// export async function POST(req: NextRequest, context: { params: { id: string } }) {
//     try {
//     await connectDB();
    
//     const params = await context.params;
//     const { id: requesterId } = params;
//     const auth = getAuth(req);
//     const currentClerkId = auth.userId;

//     if (!currentClerkId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     if (!requesterId) return NextResponse.json({ message: "Invalid requester ID" }, { status: 400 });
//     if (requesterId === currentClerkId) return NextResponse.json({ message: "Cannot accept self" }, { status: 400 });

//     const currentUser = await User.findOne({ clerkId: currentClerkId });
//     const requester = await User.findById(requesterId);

//     if (!currentUser || !requester) return NextResponse.json({ message: "User(s) not found" }, { status: 404 });

//     // Defensive array init
//     currentUser.connections = currentUser.connections || [];
//     currentUser.receivedRequests = currentUser.receivedRequests || [];
//     requester.connections = requester.connections || [];
//     requester.sentRequests = requester.sentRequests || [];

//     // Safe check for request
//     if (!currentUser.receivedRequests.map(id => id.toString()).includes(requester._id.toString()))
//         return NextResponse.json({ message: "No such follow request" }, { status: 400 });

//     if (!currentUser.connections.map(id => id.toString()).includes(requester._id.toString()))
//         currentUser.connections.push(requester._id);
//     if (!requester.connections.map(id => id.toString()).includes(currentUser._id.toString()))
//         requester.connections.push(currentUser._id);

//     currentUser.receivedRequests = currentUser.receivedRequests.filter(id => id.toString() !== requester._id.toString());
//     requester.sentRequests = requester.sentRequests.filter(id => id.toString() !== currentUser._id.toString());

//     await Promise.all([currentUser.save(), requester.save()]);

//     return NextResponse.json({ message: "Follow request accepted" }, { status: 200 });
//     } catch (error) {
//         console.error("Accept error:", error);
//         return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
//     }
// }
