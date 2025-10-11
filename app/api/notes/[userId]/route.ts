import { connectDB } from "@/lib/db";
import { Note } from "@/models/notes.model";
import { NextRequest , NextResponse } from "next/server";
import mongoose from "mongoose";
import { User } from "@/models/user.model";

export async function GET(req:NextRequest , context:{ params: Promise<{userId:string}> }){
    try{
    await connectDB();
    const params = await context.params;
    const clerkId = params.userId;

    if(!clerkId) return NextResponse.json({message:"Unauthorized User"},{status:400});
    
    const appUser = await User.findOne({ clerkId : clerkId });
    if(!appUser) return NextResponse.json({error: "User Not Found"} , {status:400});
        
    const notes = await Note.find({ user: appUser._id }).sort({ createdAt: -1 }).lean();

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
        const { fileUrl, description, createdAt, folder } = data;

        const params = await context.params;
        const userId = params.userId;
        const userObjectId = new mongoose.Types.ObjectId(userId);

        if(!userId) return NextResponse.json({message:"Unauthorized User"},{status:400});

        const newNote = new Note({
            user : userObjectId,
            fileUrl,
            description,
            folder : folder || null ,
            createdAt: createdAt ? new Date(createdAt) : new Date(),
        });

        await newNote.save();
        return NextResponse.json(newNote, { status: 201 });
    }catch(error){
        console.error("Internal Server Error.Complete Error Message : " ,error);
        return NextResponse.json({message:"Internal Server Error"},{status:500});
    }
}

