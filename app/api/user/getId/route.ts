import { NextResponse } from "next/server";
import { User } from "@/models/user.model";
import { connectDB } from "@/lib/db";
import { getAuth } from "@clerk/nextjs/server";

export async function GET(req: Request) {
    try {
    await connectDB();
    const auth = getAuth(req);
    const clerkId = auth.userId;

    if (!clerkId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ clerkId }).select("_id");
    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ id: user._id.toString() }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
