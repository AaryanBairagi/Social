import { NextRequest, NextResponse } from "next/server";
import { User } from "@/models/user.model";
import { connectDB } from "@/lib/db";
import { getAuth } from "@/lib/auth/getAuth";

export async function GET(req: NextRequest) {
    try {
    await connectDB();
    const auth = await getAuth(req);
    const userId = auth.userId;

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(userId).select("_id");
    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ id: user._id.toString() }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
