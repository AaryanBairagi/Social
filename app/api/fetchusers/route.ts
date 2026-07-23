import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/user.model";
import { getAuth } from "@/lib/auth/getAuth";

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

    const users = await User.find({
      _id: { $ne: userId },
    })
      .select(
        "firstName lastName username profilePhoto bio interests college year department"
      )
      .lean();

    return NextResponse.json(users, {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching users:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}