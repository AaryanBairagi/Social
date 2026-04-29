import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/user.model";
import { Connection } from "@/models/connection.model";
import { getAuth } from "@clerk/nextjs/server";

export async function GET(
  req: NextRequest,
  context: { params: { userId: string } }
) {
  try {
    await connectDB();

    const { userId: profileUserId } = await context.params;

    const user = await User.findOne({ userId: profileUserId })
      .select("firstName lastName userId profilePhoto bio interests clerkId")
      .lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const targetMongoUser = await User.findOne({ userId: profileUserId })
      .select("_id")
      .lean();

    if (!targetMongoUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const [followersCount, followingCount] = await Promise.all([
      Connection.countDocuments({
        type: "connection",
        status: "accepted",
        toUser: targetMongoUser._id,
      }),
      Connection.countDocuments({
        type: "connection",
        fromUser: targetMongoUser._id,
        status: { $in: ["pending", "accepted"] },
      }),
    ]);

    const { userId: currentClerkId } = getAuth(req);

    let isFollowing = false;
    let isRequestPending = false;
    let isRequestSent = false;

    if (currentClerkId) {
      const currentMongoUser = await User.findOne({ clerkId: currentClerkId })
        .select("_id")
        .lean();

      if (currentMongoUser) {
        const [outgoingEdge, incomingEdge] = await Promise.all([
          Connection.findOne({
            type: "connection",
            fromUser: currentMongoUser._id,
            toUser: targetMongoUser._id,
          }).lean(),
          Connection.findOne({
            type: "connection",
            fromUser: targetMongoUser._id,
            toUser: currentMongoUser._id,
          }).lean(),
        ]);

        isFollowing = outgoingEdge?.status === "accepted";
        isRequestSent = outgoingEdge?.status === "pending";
        isRequestPending = incomingEdge?.status === "pending";
      }
    }

    return NextResponse.json(
      {
        ...user,
        mongoId: targetMongoUser._id.toString(),
        followersCount,
        followingCount,
        isFollowing,
        isRequestPending,
        isRequestSent,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user by userId:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}







// import { NextResponse } from "next/server";
// import { connectDB, getUserIdMongo } from "@/lib/db";
// import { User } from "@/models/user.model";

// export async function GET(
//     _req: Request,
//     context : { params: { userId: string } }
// ) {
//     try {
//         await connectDB();
//         const params = await context.params;
//         const userId = params.userId;
//         const user = await User.findOne({ userId: userId }).select("firstName lastName userId profilePhoto bio interests clerkId connections sentRequests receivedRequests").lean();
//         if(!user) return NextResponse.json({error: "User not found"} , {status : 404})
//         console.log(user);

//         const currentuserMongoId = await getUserIdMongo();
//         console.log(currentuserMongoId);

//         // const connections = (user?.connections || []).map(id => id.toString());
//         // const sentRequests = (user?.sentRequests || []).map(id => id.toString());
//         // const receivedRequests = (user?.receivedRequests || []).map(id => id.toString());

//         const isFollowing = connections.includes(currentuserMongoId);
//         const isRequestPending = receivedRequests.includes(currentuserMongoId);
//         const isRequestSent = sentRequests.includes(currentuserMongoId);


//         return NextResponse.json({...user,isFollowing,isRequestPending,isRequestSent}, { status: 200 });

//         } catch (error) {
//             console.error("Error fetching user by userId:", error);
//         return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//     }
// }
