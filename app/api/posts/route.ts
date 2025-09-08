import { connectDB } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { Post } from "@/models/post.model";

export async function GET(req: NextRequest){
    await connectDB();
    const posts = await Post.find().populate("user" , "firstName lastName userId profilePhoto").sort({createdAt : -1});
    return NextResponse.json(posts);
}

export async function POST(req:NextRequest){
    await connectDB();
    const body = await req.json();
    const { description , user , imageUrl } = body;

    if(!description || !user){
        return NextResponse.json({error: "Description and User required"},{status:400});
    }

    try{
        const post = new Post({description,user,imageUrl});
        await post.save();
        console.log(post);
        return NextResponse.json(post,{status:201});
    }catch(error){
        console.error("Post Creation Error. Complete Error Message : ",error);
        return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
    }
}