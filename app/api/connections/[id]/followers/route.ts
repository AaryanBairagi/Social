import { connectDB } from "@/lib/db";
import { getFollowers } from "@/lib/services/connection.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id: userId } = await context.params;
    if (!userId) {
      return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
    }

    const result = await getFollowers(userId);

    if (!result.success) {
      return NextResponse.json(
        { message: result.message },
        { status: result.status }
      );
    }

    return NextResponse.json(
      { followers: result.data },
      { status: result.status }
    );
  } catch (error) {
    console.error("Followers fetch error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// import { connectDB } from "@/lib/db";
// import { User } from "@/models/user.model";
// import { NextRequest, NextResponse } from "next/server";

// export async function GET(req: NextRequest, context: { params: { id: string } }) {
//     try {
//     await connectDB();
    
//     const params = await context.params;
//     const { id } = params;
//     const user = await User.findById(id);

//     if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

//     const followers = await User.find({ connections: user._id })
//         .select("firstName lastName userId profilePhoto")
//         .lean();

//     return NextResponse.json(followers, { status: 200 });
//     } catch (error) {
//         console.error("Followers fetch error:", error);
//         return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
//     }
// }



