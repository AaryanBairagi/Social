import { connectDB } from "@/lib/db";
import { getRecommendedUsersForUser } from "@/lib/recommendation";
import { User } from "@/models/user.model";
import { getAuth } from "@/lib/auth/getAuth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  
  const {searchParams} = new URL(req.url);

  try {
    await connectDB();

    const { userId } = await getAuth(req);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const limitParam = searchParams.get("limit");
    const limit = limitParam ? Math.min(Number(limitParam) || 10 , 20) : 10 ;
    const recommendations = await getRecommendedUsersForUser(currentUser._id, limit);

    return NextResponse.json({
      data : recommendations,
      count : recommendations.length,
      success : true
    }, { status: 200 });
  } catch (error) {
    console.error("Recommendation fetch error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}