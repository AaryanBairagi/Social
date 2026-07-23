import { connectDB } from "@/lib/db";
import { Post } from "@/models/post.model";
import { getAuth } from "@/lib/auth/getAuth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const { userId } = await getAuth(req);

        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const events = await Post.find({
            type: "event",
            savedBy: userId,
        })
            .populate("user", "firstName lastName username")
            .sort({ eventDate: 1 });

        return NextResponse.json(events);

    } catch (error) {
        console.log(error);

        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}