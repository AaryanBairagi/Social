import { connectDB } from "@/lib/db";
import { User } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, context: { params: { id: string } }) {
    try {
    await connectDB();
    
    const params = await context.params;
    const { id } = params;
    const user = await User.findById(id);

    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    const ids = (user.connections || []).map((id: any) => id.toString());

    if (!ids.length) return NextResponse.json([], { status: 200 });

    const following = await User.find({ _id: { $in: ids } })
        .select("firstName lastName userId profilePhoto")
        .lean();

    return NextResponse.json(following, { status: 200 });
    } catch (error) {
        console.error("Following fetch error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}



// export async function GET(req: NextRequest, context: { params: Promise<{ userId: string }> }) {
//     try {
//     await connectDB();

//     const auth = getAuth(req);
//     const currentClerkId = auth.userId;
//     if (!currentClerkId) {
//         return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }

//     const params = await context.params;
//     const clerkUserId = params.userId;

//     // Find MongoDB ObjectIds for logged-in user and queried user
//     const currentUser = await User.findOne({ clerkId: currentClerkId });
//     if (!currentUser) {
//         return NextResponse.json({ message: "Current user not found" }, { status: 404 });
//     }
//     const currentUserId = currentUser._id;

//     const queriedUser = await User.findOne({ clerkId: clerkUserId });
//     if (!queriedUser) {
//         return NextResponse.json({ message: "User not found" }, { status: 404 });
//     }
//     const queriedUserId = queriedUser._id;

//     // Fetch connections where queriedUser is the follower
//     const connections = await Connection.find({ follower: queriedUserId })
//         .populate("following", "firstName lastName userId profilePhoto")
//         .lean();

//     const followings = connections.map(conn => conn.following);

//     // Prepare set of userIds the current user follows
//     const currentUserConnections = await Connection.find({ follower: currentUserId }).lean();
//     const currentUserFollowingSet = new Set(currentUserConnections.map(conn => conn.following.toString()));

//     // Annotate users with isFollowedByCurrentUser
//     const followingsWithFlag = followings.map(user => ({
//         ...user,
//         isFollowedByCurrentUser: currentUserFollowingSet.has(user._id.toString()),
//     }));

//     return NextResponse.json(followingsWithFlag, { status: 200 });
//     } catch (error) {
//         console.error("Internal Server Error:", error);
//         return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
//     }
// }
