import { connectDB } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { Post } from "@/models/post.model";
import { User } from "@/models/user.model";

export async function GET(req: NextRequest){
    try{
        const url = new URL(req.url);
        const searchParams = url.searchParams;
        const mongoId = searchParams.get("mongoId");
        const lastCreatedAt = searchParams.get("lastCreatedAt");
        const limit = 3;
        
        if(!mongoId) return NextResponse.json({error:"UserID is Required"},{status:400});

        await connectDB();
        let posts = [];

        const user = await User.findById(mongoId);
        if(!user) return NextResponse.json({error:"User Not Found"},{status:404});

        const feedUserIds = [mongoId , ...user.connections];

        const query : any = {user : { $in : feedUserIds } } ;

        if(lastCreatedAt){
            query.createdAt = {$lt : new Date(lastCreatedAt)};
        }

        posts = await Post.find(query).populate("user" , "firstName lastName userId profilePhoto").sort({createdAt : -1}).limit(limit);
        return NextResponse.json(posts);
        

    }catch(error){
        console.log(error);
        return NextResponse.json({error:"Internal Server Error"},{status:500})
    }
}

export async function POST(req:NextRequest){
    await connectDB();
    const body = await req.json();
    const { description , user , imageUrls } = body;

    if(!description || !user){
        return NextResponse.json({error: "Description and User required"},{status:400});
    }

    try{
        const imgs = Array.isArray(imageUrls) ? imageUrls : [];
        const post = new Post({description,user,imageUrls : imgs.length > 0 ? imgs : undefined});
        await post.save();
        console.log(post);
        return NextResponse.json(post,{status:201});
    }catch(error){
        console.error("Post Creation Error. Complete Error Message : ",error);
        return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
    }
}