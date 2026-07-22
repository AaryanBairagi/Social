import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/user.model";

import { verifyAccessToken } from "@/lib/auth/tokens";

export async function GET() {
    try {
        await connectDB();
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("sc_access_token")?.value;

        if (!accessToken) {
            return NextResponse.json({ user: null });
        }

        const payload = await verifyAccessToken(accessToken);
        const user = await User.findById(payload.userId).select("-password");

        return NextResponse.json({ user });
    } catch {
        return NextResponse.json({ user: null });
    }
}