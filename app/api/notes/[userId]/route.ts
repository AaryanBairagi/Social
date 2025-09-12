import { connectDB } from "@/lib/db";
import { Note } from "@/models/notes.model";
import { NextRequest , NextResponse } from "next/server";

export async function GET(req:NextRequest , context:{ params: Promise<{userId:string}> }){
    try{
    await connectDB();
    const params = await context.params;
    const userId = params.userId;

    if(!userId) return NextResponse.json({message:"Unauthorized User"},{status:400});

    const notes = await Note.find({userId},{createdAt:-1}).lean();

    return NextResponse.json(notes,{status:200});

    }catch(error){
        console.error("Internal Server Error. Complete Error Message: " , error);
        return NextResponse.json({message:"Inernal Server Error"},{status:500});
    }
    
}

export async function POST(req:NextRequest , context:{ params:Promise<{userId:string}> }){
    try{
        await connectDB();
        const data = await req.json();
        const { fileUrl, description, createdAt } = data;

        const params = await context.params;
        const userId = params.userId;
        if(!userId) return NextResponse.json({message:"Unauthoruzed User"},{status:400});

        const newNote = new Note({
            userId,
            fileUrl,
            description,
            createdAt: createdAt ? new Date(createdAt) : new Date(),
        });

        await newNote.save();
        return NextResponse.json(newNote, { status: 201 });
    }catch(error){
        console.error("Internal Server Error.Complete Error Message : " ,error);
        return NextResponse.json({message:"Internal Server Error"},{status:500});
    }
}

