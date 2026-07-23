import { deleteCache } from "@/lib/cache/cache";
import { connectDB } from "@/lib/db";
import { createNotification } from "@/lib/notifications/notifications.service";
import { checkLimiter } from "@/lib/rate/checkLimiter";
import { acceptConnectionRequest } from "@/lib/services/connection.service";
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

    checkLimiter(userId, "CONNECTION_ACCEPT", {
      windowMs: 60 * 1000,
      max: 20,
    });

    const { id: requesterId } =
      await context.params;

    if (!requesterId) {
      return NextResponse.json(
        {
          message: "Invalid requester ID",
        },
        {
          status: 400,
        }
      );
    }

    const result =
      await acceptConnectionRequest(
        userId,
        requesterId
      );

    if (result.success) {

      deleteCache(`requests:${userId}`);
      deleteCache(`requests:${requesterId}`);

      await createNotification({
        userId: requesterId,
        actorId: userId,
        type: "FOLLOW_ACCEPT",
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

    if (
      error.message?.includes(
        "Too many requests"
      )
    ) {
      return NextResponse.json(
        {
          error: "Please Try Again Later",
        },
        {
          status: 429,
        }
      );
    }

    console.error(error);

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