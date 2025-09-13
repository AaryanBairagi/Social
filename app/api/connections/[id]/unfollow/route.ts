import { connectDB } from "@/lib/db";
import { User } from "@/models/user.model";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, context: { params: Promise<{ userId: string }> }) {
  try {
    await connectDB();
    const auth = getAuth(req);
    const currentClerkId = auth.userId;
    if (!currentClerkId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const params = await context.params;
    const targetUserId = params.userId;
    if (!targetUserId) return NextResponse.json({ message: "Invalid User ID" }, { status: 400 });

    const currentUser = await User.findOne({ clerkId: currentClerkId });
    const targetUser = await User.findOne({ clerkId: targetUserId });

    if (!currentUser || !targetUser) {
      return NextResponse.json({ message: "User(s) not found" }, { status: 404 });
    }

    // Remove each other from connections arrays
    currentUser.connections = currentUser.connections.filter(id => !id.equals(targetUser._id));
    targetUser.connections = targetUser.connections.filter(id => !id.equals(currentUser._id));

    // Remove any pending requests between them as well
    currentUser.sentRequests = currentUser.sentRequests.filter(id => !id.equals(targetUser._id));
    currentUser.receivedRequests = currentUser.receivedRequests.filter(id => !id.equals(targetUser._id));
    targetUser.sentRequests = targetUser.sentRequests.filter(id => !id.equals(currentUser._id));
    targetUser.receivedRequests = targetUser.receivedRequests.filter(id => !id.equals(currentUser._id));

    await Promise.all([currentUser.save(), targetUser.save()]);

    return NextResponse.json({ message: "Unfollowed successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error in unfollow API:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}








// import { connectDB } from "@/lib/db";
// import { Connection } from "@/models/connection.model";
// import { User } from "@/models/user.model";
// import { getAuth } from "@clerk/nextjs/server";
// import { NextRequest, NextResponse } from "next/server";

// export async function POST(req:NextRequest , context:{ params: Promise<{userId:string}> }){
//     try{
//         await connectDB();

//         const {userId : followerClerkId} = getAuth(req);
//         if(!followerClerkId) return NextResponse.json({message:"Unauthorized User"},{status:401});

//         const follower = await User.findOne({clerkId : followerClerkId});
//         if(!follower) return NextResponse.json({message:"user Not Found"},{status:404});

//         const params = await context.params;
//         const followingUserId = params.userId;
//         if(!followingUserId) return NextResponse.json({message:"Invalid User ID"},{status:400});

//         await Connection.findOneAndDelete({
//             follower: follower._id,
//             following: followingUserId
//         });
//         return NextResponse.json({message:"Unfollowed User Successfully"},{status:200});

//     }catch(error){
//         console.error("Internal Server Error. Complete Error Message : ",error);
//         return NextResponse.json({message:"Internal Server Error"},{status:500});
//     }
// }