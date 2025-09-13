// File: app/api/fetchusers/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/user.model";

export async function GET(req: NextRequest) {
    try {
    await connectDB();

    const url = new URL(req.url);
    const excludeClerkId = url.searchParams.get("excludeClerkId");

    // Build filter to exclude current user if specified
    const filter = excludeClerkId ? { clerkId: { $ne: excludeClerkId } } : {};

    // Fetch users, excluding sensitive fields (password, etc)
    const users = await User.find(filter)
        .select("firstName lastName userId profilePhoto bio interests clerkId")
        .lean();

    return NextResponse.json(users, { status: 200 });
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
