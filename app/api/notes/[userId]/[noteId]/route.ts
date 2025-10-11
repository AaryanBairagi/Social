import { connectDB } from "@/lib/db";
import { Note } from "@/models/notes.model";
import { User } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ userId: string; noteId: string }> }
) {
  try {
    await connectDB();
    const { userId, noteId } = await context.params;
    const data = await req.json();

    // Find the MongoDB user by Clerk ID
    const appUser = await User.findOne({ clerkId: userId });
    if (!appUser)
      return NextResponse.json({ error: "User Not Found" }, { status: 400 });

    // Update note
    const updatedNote = await Note.findOneAndUpdate(
      { _id: noteId, user: appUser._id },
      { $set: { description: data.description, folder: data.folder } },
      { new: true }
    );

    if (!updatedNote)
      return NextResponse.json({ error: "Note Not Found" }, { status: 404 });
    return NextResponse.json(updatedNote, { status: 200 });
  } catch (error) {
    console.error("Error updating note:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}


export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ userId: string; noteId: string }> }
) {
  try {
    await connectDB();
    const { userId, noteId } = await context.params;
    const appUser = await User.findOne({ clerkId: userId });
    if (!appUser)
      return NextResponse.json({ error: "User Not Found" }, { status: 400 });

    const note = await Note.findOneAndDelete({ _id: noteId, user: appUser._id });

    if (!note)
      return NextResponse.json({ error: "Note Not Found" }, { status: 404 });
    return NextResponse.json({ message: "Note deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting note:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
