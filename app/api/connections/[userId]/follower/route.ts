import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Connection } from "@/models/connection.model";

export async function GET(req: NextRequest, context: { params: Promise<{ userId: string }> }) {
    try {
        await connectDB();

        const params = await context.params;
        const userId = params.userId;

        const connections = await Connection.find({ following: userId }).populate(
        "follower",
        "firstName lastName userId profilePhoto"
        );

        // Return array of follower user objects
        const followers = connections.map(conn => conn.follower);

        return NextResponse.json(followers, { status: 200 });
    } catch (error) {
        console.error("Error fetching followers:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
