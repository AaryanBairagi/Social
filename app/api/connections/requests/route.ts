import { getCache, setCache } from "@/lib/cache/cache";
import { connectDB } from "@/lib/db";
import { getReceivedRequests, getSentRequests } from "@/lib/services/connection.service";
import { getAuth } from "@/lib/auth/getAuth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { userId } = await getAuth(req);

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const cacheKey = `requests:${userId}`;

    const cachedData = getCache(cacheKey);

    if (cachedData) {
      return NextResponse.json(cachedData, {
        status: 200,
      });
    }

    const [sentResult, receivedResult] =
      await Promise.all([
        getSentRequests(userId),
        getReceivedRequests(userId),
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
      sentRequests: sentResult.data,
      receivedRequests: receivedResult.data,
    };

    setCache(
      cacheKey,
      responseData,
      10 * 1000
    );

    return NextResponse.json(
      responseData,
      {
        status: 200,
      }
    );

  } catch (error) {
    console.error("Requests fetch error:", error);

    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}