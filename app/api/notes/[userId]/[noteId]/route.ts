import { connectDB } from "@/lib/db";
import { Note } from "@/models/notes.model";
import { getAuth } from "@/lib/auth/getAuth";
import { NextRequest, NextResponse } from "next/server";
import { validate } from "@/lib/validation";
import { UpdateNoteSchema } from "@/lib/validators/note";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ noteId: string }> }
) {
  try {
    await connectDB();
    const { noteId } = await context.params;
    const { userId } = await getAuth(req);

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const validated = validate(UpdateNoteSchema , body);
    if(!validated.success){
      return validated.response;
    }

    const data = validated.data;

    // Update note
    const updatedNote = await Note.findOneAndUpdate(
      { _id: noteId, user: userId },
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
  context: { params: Promise<{ noteId: string }> }
) {
  try {
    await connectDB();
    const { noteId } = await context.params;
    const { userId } = await getAuth(req);


    const note = await Note.findOneAndDelete({ _id: noteId, user: userId });

    if (!note)
      return NextResponse.json({ error: "Note Not Found" }, { status: 404 });
    return NextResponse.json({ message: "Note deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting note:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
