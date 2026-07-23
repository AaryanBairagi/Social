import { connectDB } from "@/lib/db";
import { Post } from "@/models/post.model";
import { NextRequest, NextResponse } from "next/server";
import { checkLimiter } from "@/lib/rate/checkLimiter";
import { RATE_LIMITS } from "@/lib/rate/constants";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const {id} = await params;

    const post = await Post.findById(id).populate(
      "user",
      "firstName lastName username profilePhoto"
    );

    if (!post) {
      return NextResponse.json(
        { error: "Post Not Found" },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "Invalid ID or server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  await connectDB();
  const body = await req.json();

  checkLimiter(body.user, "POST_UPDATED", {
    windowMs: 60 * 1000,
    max: 10,
  });

  try {
    const params = await context.params;
    const id = params.id;

    const updated = await Post.findByIdAndUpdate(
      id,
      {
        ...body,
        imageUrls: body.imageUrls ?? [], 
      },
      { new: true }
    ).populate("user", "firstName lastName username profilePhoto");

    if (!updated)
      return NextResponse.json({ error: "Post Not Found" }, { status: 404 });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update Post Error. Complete Error Message : ", error);
    return NextResponse.json({ error: "Failed to Update Post" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{id: string}> }) {
  await connectDB();
  const {id} = await params;
  try {
    const deleted = await Post.findByIdAndDelete(id);
    
    if (!deleted)
      return NextResponse.json({ error: "Post Not Found" }, { status: 404 });

    return NextResponse.json({ message: "Post Deleted Successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error Deleting the Post. Complete error message: ", error);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}










// import { connectDB } from "@/lib/db";
// import { Post } from "@/models/post.model";
// import { NextRequest, NextResponse } from "next/server";
// import { checkLimiter } from "@/lib/rate/checkLimiter";
// import { RATE_LIMITS } from "@/lib/rate/constants";

// export async function PUT(req:NextRequest, context : { params: {id:string} } ){
//     await connectDB();
//     const body = await req.json();

//     //If Image Url is "" or null , remove the imageUrl from the post 
//     if(body.imageUrl === "" || body.iamgeUrl === null ){
//         body.imageUrl = undefined;
//     }

//     checkLimiter(body.user,"POST_UPDATED",{
//         windowMs : 60 * 1000,
//         max : 10
//     });
    
//     try{
//         const params = await context.params;
//         const id = params.id;
//         const updated = await Post.findByIdAndUpdate(id, { ...body, ...(body.imageUrl === undefined ? { $unset: { imageUrl: 1 } } : {}) } , { new: true }).populate("user", "firstName lastName username profilePhoto");
//         if(!updated) return NextResponse.json({error: "Post Not Found"},{status:404});
//         return NextResponse.json(updated);
//     }catch(error){
//         console.error("Update Post Error. Complete Error Message : " , error);
//         return NextResponse.json({error: "Failed to Update Post"},{status:500});
//     }
// }

// export async function DELETE(req:NextRequest , {params} : { params: { id:string } } ){
//     await connectDB();
//     try{
//         const deleted = await Post.findByIdAndDelete(params.id);
//         if(!deleted) return NextResponse.json({error:"Post Not Found"},{status:404});
//         return NextResponse.json({message:"Post Deleted Successfully"},{status:200});
//     }catch(error){
//         console.error("Error Deleting the Post. Complete error message: " , error);
//         return NextResponse.json({error:"Failed to delete post"},{status:500});
//     }
// }