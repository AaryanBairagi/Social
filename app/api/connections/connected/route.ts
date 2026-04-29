import { connectDB } from "@/lib/db";
import { getFollowing } from "@/lib/services/connection.service";
import { User } from "@/models/user.model";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { userId: currentClerkId } = getAuth(req);
    if (!currentClerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = await User.findOne({ clerkId: currentClerkId }).select("_id");
    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const result = await getFollowing(currentUser._id.toString(), false);

    if (!result.success) {
      return NextResponse.json(
        { error: result.message || "Failed to fetch following" },
        { status: result.status }
      );
    }

    return NextResponse.json(result.data, { status: result.status });
  } catch (error) {
    console.error("Error fetching following users:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}



// import { connectDB } from "@/lib/db";
// import { getConnectedUsers } from "@/lib/services/connection.service";
// import { User } from "@/models/user.model";
// import { getAuth } from "@clerk/nextjs/server";
// import { NextRequest, NextResponse } from "next/server";

// export async function GET(req: NextRequest) {
//   try {
//     await connectDB();

//     const { userId } = getAuth(req);
//     if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const currentUser = await User.findOne({ clerkId: userId }).select("connections");
//     if (!currentUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

//     // Find all users in current user's connections
//     const result = await getConnectedUsers(currentUser._id.toString());

//     return NextResponse.json(result.data , { status : result.status});
//   } catch (error) {
//     console.error("Error fetching connected users:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }
