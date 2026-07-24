import { connectDB } from "@/lib/db";
import { validate } from "@/lib/validation";
import { CreateContactSchema } from "@/lib/validators/contact";
import { Contact } from "@/models/contact.model";
import { NextRequest , NextResponse } from "next/server";

export async function POST(req:NextRequest){
    try{
    await connectDB();

    const body = await req.json();

    const validated = validate(CreateContactSchema , body);
    if(!validated.success){
        return validated.response;
    }

    const { name , subject , email , message } = validated.data;
    
    if(!name || !message || !email || !subject) return NextResponse.json({message:'All fields are required'},{status:400});
    
    const contactEntry = new Contact({name,email,subject,message});
    await contactEntry.save();

    return NextResponse.json({message:"New Contact Support Entry Added Successfully"},{status:200})

    }catch(error){
        console.error("Internal Server Error. Complete Error Message :" , error);
        return NextResponse.json({message:"Internal Server Error"},{status:500})
    }
}