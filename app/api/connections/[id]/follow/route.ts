import { connectDB } from "@/lib/db";
import { User } from "@/models/user.model";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, context: { params: { id: string } }) {
  try {
    await connectDB();

    const params = await context.params;
    const { id: targetId } = params;
    const auth = getAuth(req);
    const currentClerkId = auth.userId;

    if (!currentClerkId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    if (!targetId) return NextResponse.json({ message: "Invalid target ID" }, { status: 400 });
    if (targetId === currentClerkId) return NextResponse.json({ message: "Cannot follow yourself" }, { status: 400 });

    const sender = await User.findOne({ clerkId: currentClerkId });
    const receiver = await User.findById(targetId);

    if (!sender || !receiver) return NextResponse.json({ message: "User(s) not found" }, { status: 404 });

    sender.connections = sender.connections || []

    if (sender.connections.includes(receiver._id)) 
      return NextResponse.json({ message: "Already connected" }, { status: 200 });

    sender.sentRequests = sender.sentRequests || [];
    if (sender.sentRequests.includes(receiver._id)) 
      return NextResponse.json({ message: "Request already sent" }, { status: 200 });

    sender.sentRequests.push(receiver._id);

    receiver.receivedRequests = receiver.receivedRequests || [];
    receiver.receivedRequests.push(sender._id);

    await Promise.all([sender.save(), receiver.save()]);

    return NextResponse.json({ message: "Follow request sent" }, { status: 201 });
  } catch (error) {
    console.error("Follow error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}








// import { connectDB } from "@/lib/db";
// import { User } from "@/models/user.model";
// import { getAuth } from "@clerk/nextjs/server";
// import { NextRequest, NextResponse } from "next/server";

// export async function POST(req: NextRequest, context: { params: Promise<{ userId: string }> }) {
//   try {
//     await connectDB();
//     const auth = getAuth(req);
//     const currentClerkId = auth.userId;
//     if (!currentClerkId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

//     const params = await context.params;
//     const targetUserId = params.userId;
//     if (!targetUserId) return NextResponse.json({ message: "Invalid User ID" }, { status: 400 });

//     if (currentClerkId === targetUserId) {
//       return NextResponse.json({ message: "Cannot follow yourself" }, { status: 400 });
//     }

//     // Find both users
//     const currentUser = await User.findOne({ clerkId: currentClerkId });
//     const targetUser = await User.findOne({ clerkId: targetUserId });

//     if (!currentUser || !targetUser) {
//       return NextResponse.json({ message: "User(s) not found" }, { status: 404 });
//     }

//     // Check if already connected
//     if (currentUser.connections.includes(targetUser._id)) {
//       return NextResponse.json({ message: "Already followed" }, { status: 200 });
//     }

//     // Check if a pending sent request exists
//     if (currentUser.sentRequests.includes(targetUser._id)) {
//       return NextResponse.json({ message: "Follow request already sent" }, { status: 200 });
//     }

//     // Add to sentRequests and receivedRequests arrays
//     currentUser.sentRequests.push(targetUser._id);
//     targetUser.receivedRequests.push(currentUser._id);

//     await Promise.all([currentUser.save(), targetUser.save()]);

//     return NextResponse.json({ message: "Follow request sent" }, { status: 201 });
//   } catch (error) {
//     console.error("Error in follow API:", error);
//     return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
//   }
// }




// // import { connectDB } from "@/lib/db";
// // import { Connection } from "@/models/connection.model";
// // import { User } from "@/models/user.model";
// // import { getAuth } from "@clerk/nextjs/server";
// // import { NextRequest, NextResponse } from "next/server";


// // export async function POST(req:NextRequest , context:{ params: Promise<{userId:string}> } ){
// //     try{
// //         await connectDB();
// //         const { userId: followerClerkId } = getAuth(req);
// //         if(!followerClerkId) return NextResponse.json({message:"Unauthorized User"},{status:401});

// //         const follower = await User.findOne({clerkId:followerClerkId});
// //         if(!follower) return NextResponse.json({message:"User Not Found"},{status:404});

// //         const params = await context.params;
// //         const followingUserId = params.userId;
// //         if(!followingUserId) return NextResponse.json({message:"Invalid User ID"},{status:400});

// //         //Cannot self follow
// //         if(follower._id.toString() === followingUserId) return NextResponse.json({message:"Cannot Follow Yourself"},{status:400});

// //         const existing = await Connection.findOne({
// //             follower: follower._id,
// //             following: followingUserId
// //         });
        
// //         if(existing) return NextResponse.json({message:"Already Followed"},{status:200});
// //         await Connection.create({follower:follower._id , following:followingUserId});

// //         return NextResponse.json({message:"Added to Following Successfully"},{status:201})

// //     }catch(error){
// //         console.error("Internal Server Error. Complete Error Message : ", error);
// //         return NextResponse.json({message:"Could not Foolow the User"} , {status:500});
// //     }
// // }