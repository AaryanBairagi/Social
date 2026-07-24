import { deleteCache } from "@/lib/cache/cache";
import { connectDB } from "@/lib/db";
import { createNotification } from "@/lib/notifications/notifications.service";
import { checkLimiter } from "@/lib/rate/checkLimiter";
import { RATE_LIMITS } from "@/lib/rate/constants";
import { sendConnectionRequest } from "@/lib/services/connection.service";
import { getAuth } from "@/lib/auth/getAuth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { userId } = await getAuth(req);

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    checkLimiter(
      userId,
      "CONNECTION_REQUEST",
      RATE_LIMITS.CONNECTION
    );

    const { id: targetUserId } = await context.params;

    if (!targetUserId) {
      return NextResponse.json(
        {
          message: "Invalid target ID",
        },
        {
          status: 400,
        }
      );
    }

    // ✅ Prevent users from following themselves
    if (userId === targetUserId) {
      return NextResponse.json(
        {
          message: "You cannot follow yourself",
        },
        {
          status: 400,
        }
      );
    }

    const result = await sendConnectionRequest(
      userId,
      targetUserId
    );

    if (
      result.status === 200 ||
      result.status === 201
    ) {
      deleteCache(`requests:${userId}`);
      deleteCache(`requests:${targetUserId}`);

      await createNotification({
        userId: targetUserId,
        actorId: userId,
        type: "FOLLOW_REQUEST",
      });
    }

    return NextResponse.json(
      {
        message: result.message,
        data: result.data,
      },
      {
        status: result.status,
      }
    );
  } catch (error: any) {
    if (error.message?.includes("Too many requests")) {
      return NextResponse.json(
        {
          error: "Please Try Again Later",
        },
        {
          status: 429,
        }
      );
    }

    console.error("Follow error:", error);

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