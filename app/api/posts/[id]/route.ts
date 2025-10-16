import { connectDB } from "@/lib/db";
import { Post } from "@/models/post.model";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req:NextRequest, context : { params: {id:string} } ){
    await connectDB();
    const body = await req.json();

    //If Image Url is "" or null , remove the imageUrl from the post 
    if(body.imageUrl === "" || body.iamgeUrl === null ){
        body.imageUrl = undefined;
    }

    try{
        const params = await context.params;
        const id = params.id;
        const updated = await Post.findByIdAndUpdate(id, { ...body, ...(body.imageUrl === undefined ? { $unset: { imageUrl: 1 } } : {}) } , { new: true }).populate("user", "firstName lastName userId profilePhoto");
        if(!updated) return NextResponse.json({error: "Post Not Found"},{status:404});
        return NextResponse.json(updated);
    }catch(error){
        console.error("Update Post Error. Complete Error Message : " , error);
        return NextResponse.json({error: "Failed to Update Post"},{status:500});
    }
}

export async function DELETE(req:NextRequest , {params} : { params: { id:string } } ){
    await connectDB();
    try{
        const deleted = await Post.findByIdAndDelete(params.id);
        if(!deleted) return NextResponse.json({error:"Post Not Found"},{status:404});
        return NextResponse.json({message:"Post Deleted Successfully"},{status:200});
    }catch(error){
        console.error("Error Deleting the Post. Complete error message: " , error);
        return NextResponse.json({error:"Failed to delete post"},{status:500});
    }
}