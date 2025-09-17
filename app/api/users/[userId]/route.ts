import { NextResponse } from "next/server";
import { connectDB, getUserIdMongo } from "@/lib/db";
import { User } from "@/models/user.model";

export async function GET(
    _req: Request,
    context : { params: { userId: string } }
) {
    try {
        await connectDB();
        const params = await context.params;
        const userId = params.userId;
        const user = await User.findOne({ userId: userId }).select("firstName lastName userId profilePhoto bio interests clerkId connections sentRequests receivedRequests").lean();
        console.log(user);

        const currentuserMongoId = await getUserIdMongo();
        console.log(currentuserMongoId);

        const connections = (user?.connections || []).map(id => id.toString());
        const sentRequests = (user?.sentRequests || []).map(id => id.toString());
        const receivedRequests = (user?.receivedRequests || []).map(id => id.toString());

        const isFollowing = connections.includes(currentuserMongoId);
        const isRequestPending = receivedRequests.includes(currentuserMongoId);
        const isRequestSent = sentRequests.includes(currentuserMongoId);

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({...user,isFollowing,isRequestPending,isRequestSent}, { status: 200 });

        } catch (error) {
            console.error("Error fetching user by userId:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
