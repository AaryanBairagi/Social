import { deleteCache } from "@/lib/cache/cache";
import { connectDB } from "@/lib/db";
import { createNotification } from "@/lib/notifications/notifications.service";
import { checkLimiter } from "@/lib/rate/checkLimiter";
import { RATE_LIMITS } from "@/lib/rate/constants";
import { sendConnectionRequest } from "@/lib/services/connection.service";
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

    checkLimiter(currentClerkId , "CONNECTION_REQUEST" , RATE_LIMITS.CONNECTION)
    const { id: targetUserId } = await context.params;
    if (!targetUserId) {
      return NextResponse.json({ message: "Invalid target ID" }, { status: 400 });
    }

    const result = await sendConnectionRequest(currentClerkId, targetUserId);

    if(result.status===200 || result.status===201){
      //DELETE STALE DATA FROM CACHE
      deleteCache(`requests:${currentClerkId}`);
      deleteCache(`requests:${targetUserId}`);

      //CREATE NOTIFICATION
      await createNotification({
        userId : targetUserId,
        actorId : currentClerkId,
        type : "FOLLOW_REQUEST"
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
    console.error("Follow error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}




// import { connectDB } from "@/lib/db";
// import { User } from "@/models/user.model";
// import { getAuth } from "@clerk/nextjs/server";
// import { NextRequest, NextResponse } from "next/server";

// export async function POST(req: NextRequest, context: { params: { id: string } }) {
//   try {
//     await connectDB();

//     const params = await context.params;
//     const { id: targetId } = params;
//     const auth = getAuth(req);
//     const currentClerkId = auth.userId;

//     if (!currentClerkId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     if (!targetId) return NextResponse.json({ message: "Invalid target ID" }, { status: 400 });
//     if (targetId === currentClerkId) return NextResponse.json({ message: "Cannot follow yourself" }, { status: 400 });

//     const sender = await User.findOne({ clerkId: currentClerkId });
//     const receiver = await User.findById(targetId);

//     if (!sender || !receiver) return NextResponse.json({ message: "User(s) not found" }, { status: 404 });

//     //Cannot follow yourself
//     if (sender._id.toString() === receiver._id.toString()) {
//       return NextResponse.json({ message: "Cannot follow yourself" }, { status: 400 });
//     }

//     sender.connections = sender.connections || []

//     if (sender.connections.includes(receiver._id)) 
//       return NextResponse.json({ message: "Already connected" }, { status: 200 });

//     sender.sentRequests = sender.sentRequests || [];
//     if (sender.sentRequests.includes(receiver._id)) 
//       return NextResponse.json({ message: "Request already sent" }, { status: 200 });

//     sender.sentRequests.push(receiver._id);

//     receiver.receivedRequests = receiver.receivedRequests || [];
//     receiver.receivedRequests.push(sender._id);

//     await Promise.all([sender.save(), receiver.save()]);

//     return NextResponse.json({ message: "Follow request sent" }, { status: 201 });
//   } catch (error) {
//     console.error("Follow error:", error);
//     return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
//   }
// }


