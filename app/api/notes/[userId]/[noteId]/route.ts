// app/api/notes/[userId]/[noteId]/route.ts
import { connectDB } from "@/lib/db";
import { Note } from "@/models/notes.model";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function PATCH(req: NextRequest, context: { params: Promise<{ userId: string, noteId: string }> }) {
    try {
        await connectDB();
        const { userId, noteId } = await context.params;
        const data = await req.json();

        // Only allow updating certain fields
        const updateFields: any = {};
        if (data.description) updateFields.description = data.description;
        if (data.folder) updateFields.folder = data.folder;

        const updatedNote = await Note.findOneAndUpdate(
        { _id: noteId, user: new mongoose.Types.ObjectId(userId) },
        { $set: updateFields },
        { new: true }
        );

        if (!updatedNote) return NextResponse.json({ message: "Note not found" }, { status: 404 });
        return NextResponse.json(updatedNote, { status: 200 });
    } catch (error) {
        console.error("Error updating note:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
