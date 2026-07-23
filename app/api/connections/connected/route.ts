import { connectDB } from "@/lib/db";
import { getFollowing } from "@/lib/services/connection.service";
import { User } from "@/models/user.model";
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

    const result = await getFollowing(userId, false);

    if (!result.success) {
      return NextResponse.json(
        { error: result.message || "Failed to fetch following" },
        { status: result.status }
      );
    }

    return NextResponse.json(result.data, {
      status: result.status,
    });

  } catch (error) {
    console.error("Error fetching following users:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}