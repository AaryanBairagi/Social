import { getCache, setCache } from "@/lib/cache/cache";
import { connectDB } from "@/lib/db";
import {
  getReceivedRequests,
  getSentRequests,
} from "@/lib/services/connection.service";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { userId: currentClerkId } = getAuth(req);
    if (!currentClerkId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    //Check if the data is already cached
    const cacheKey = `requests:${currentClerkId}`;

    const cachedData = getCache(cacheKey);
    if(cachedData){
      return NextResponse.json(cachedData,{status:200});
    }

    //In case of Cache Miss
    const [sentResult, receivedResult] = await Promise.all([
      getSentRequests(currentClerkId),
      getReceivedRequests(currentClerkId),
    ]);

    if (!sentResult.success) {
      return NextResponse.json(
        { message: sentResult.message },
        { status: sentResult.status }
      );
    }

    if (!receivedResult.success) {
      return NextResponse.json(
        { message: receivedResult.message },
        { status: receivedResult.status }
      );
    }

    const responseData = {
      sentRequests : sentResult.data,
      receivedRequests : receivedResult.data
    };

    //Add the response data in cache
    setCache(cacheKey , responseData , 10 * 1000);

    return NextResponse.json(
      responseData,
      { status: 200 }
    );
  } catch (error) {
    console.error("Requests fetch error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}




// import { connectDB } from "@/lib/db";
// import { User } from "@/models/user.model";
// import { getAuth } from "@clerk/nextjs/server";
// import { NextRequest, NextResponse } from "next/server";

// export async function GET(req: NextRequest) {
//   try {
//     await connectDB();

//     const auth = getAuth(req);
//     const clerkId = auth.userId;

//     if (!clerkId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

//     const user = await User.findOne({ clerkId });

//     if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

//     return NextResponse.json({
//       sentRequests: (user.sentRequests || []).map(id => id.toString()),
//       receivedRequests: (user.receivedRequests || []).map(id => id.toString())
//     }, { status: 200 });
//   } catch (error) {
//     console.error("Requests fetch error:", error);
//     return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
//   }
// }
