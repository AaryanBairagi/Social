import { connectDB } from "@/lib/db";
import { Note } from "@/models/notes.model";
import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@/lib/auth/getAuth";
import { checkLimiter } from "@/lib/rate/checkLimiter";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { userId } = await getAuth(req);

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized User" },
        { status: 401 }
      );
    }

    const notes = await Note.find({ user: userId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(notes, { status: 200 });
  } catch (error) {
    console.error("Internal Server Error:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { userId } = await getAuth(req);

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized User" },
        { status: 401 }
      );
    }

    checkLimiter(userId, "NOTE_CREATE", {
      windowMs: 60 * 1000,
      max: 10,
    });

    const { fileUrl, description, createdAt, folder } = await req.json();

    const newNote = new Note({
      user: userId,
      fileUrl,
      description,
      folder: folder || null,
      createdAt: createdAt ? new Date(createdAt) : new Date(),
    });

    await newNote.save();

    return NextResponse.json(newNote, {
      status: 201,
    });
  } catch (error: any) {
    if (error.message?.includes("Too many requests")) {
      return NextResponse.json(
        { error: "Please Try Again Later" },
        { status: 429 }
      );
    }

    console.error("Internal Server Error:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}