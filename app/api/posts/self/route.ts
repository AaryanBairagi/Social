import { connectDB } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { Post } from "@/models/post.model";
import { User } from "@/models/user.model";
import { is } from "@react-three/fiber/dist/declarations/src/core/utils";

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const mongoId = url.searchParams.get("mongoId");
        const lastCreatedAt = url.searchParams.get("lastCreatedAt");
        const limit = 3;

        if (!mongoId) return NextResponse.json({ error: "UserID is Required" }, { status: 400 });

        await connectDB();

        // Only fetch posts by this user
        const query: any = { user: mongoId , isArchived : {$ne: true} };
        if (lastCreatedAt) {
            query.createdAt = { $lt: new Date(lastCreatedAt) };
        }

        const posts = await Post.find(query)
        .populate("user", "firstName lastName username profilePhoto")
        .sort({ createdAt: -1 })
        .limit(limit);

        return NextResponse.json(posts);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
