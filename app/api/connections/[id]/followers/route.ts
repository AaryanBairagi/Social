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

    const followers = await User.find({ connections: user._id })
        .select("firstName lastName userId profilePhoto")
        .lean();

    return NextResponse.json(followers, { status: 200 });
    } catch (error) {
        console.error("Followers fetch error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}



// export async function GET(req: NextRequest, context: { params: Promise<{ userId: string }> }) {
//     try {
//         await connectDB();

//         const params = await context.params;
//         const userId = params.userId;

//         const connections = await Connection.find({ following: userId }).populate(
//         "follower",
//         "firstName lastName userId profilePhoto"
//         );

//         // Return array of follower user objects
//         const followers = connections.map(conn => conn.follower);

//         return NextResponse.json(followers, { status: 200 });
//     } catch (error) {
//         console.error("Error fetching followers:", error);
//         return NextResponse.json({ message: "Server error" }, { status: 500 });
//     }
// }
