import { connectDB } from "@/lib/db";
import { User } from "@/models/user.model";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const auth = getAuth(req);
    const clerkId = auth.userId;

    if (!clerkId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const user = await User.findOne({ clerkId });

    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    return NextResponse.json({
      sentRequests: (user.sentRequests || []).map(id => id.toString()),
      receivedRequests: (user.receivedRequests || []).map(id => id.toString())
    }, { status: 200 });
  } catch (error) {
    console.error("Requests fetch error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
