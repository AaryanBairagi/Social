import { connectDB } from "@/lib/db";
import { User } from "@/models/user.model";
import { NextRequest , NextResponse } from "next/server";

export async function GET(req:NextRequest){
    try{ 
    await connectDB();
    const q = req.nextUrl.searchParams.get('q')?.trim();

    if(!q || q.length<2 ) return NextResponse.json([],{status:200});

    //i means ignore case sentitvity//// search case-insensitive
    const regex = RegExp(q,"i");

    const users = await User.find({
        $or : [
            //search by userId or username or lastname
            {username : regex},
            {userId : regex},
            {firstName : regex},
            {lastName : regex}
        ]
    }).select("_id username firstName lastName profilePhoto").limit(20).lean();

    return NextResponse.json(users,{status:200});
    }catch(error){
        console.log('Internal Server Error. Complete Error Message : ',error);
        return NextResponse.json({message:'Internal Server Error'},{status:500});
    }
} 