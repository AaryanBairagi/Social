import { connectDB } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { Post } from "@/models/post.model";
import { User } from "@/models/user.model";
import { Connection } from "@/models/connection.model";
import { checkLimiter } from "@/lib/rate/checkLimiter";
import { RATE_LIMITS } from "@/lib/rate/constants";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    const mongoId = searchParams.get("mongoId");
    const lastCreatedAt = searchParams.get("lastCreatedAt");
    const limit = 3;

    if (!mongoId) {
      return NextResponse.json({ error: "UserID is Required" }, { status: 400 });
    }

    await connectDB();

    const user = await User.findById(mongoId).select("_id");
    if (!user) {
      return NextResponse.json({ error: "User Not Found" }, { status: 404 });
    }

    const followingEdges = await Connection.find({
      type: "connection",
      fromUser: user._id,
      status: "accepted",
    })
      .select("toUser")
      .lean();

    const followingUserIds = followingEdges.map((edge) => edge.toUser.toString());

    const feedUserIds = [mongoId, ...followingUserIds];

    const query: any = {
      user: { $in: feedUserIds },
      isArchived : {$ne : true}
    };

    if (lastCreatedAt) {
      query.createdAt = { $lt: new Date(lastCreatedAt) };
    }

    const posts = await Post.find(query)
      .populate("user", "firstName lastName userId profilePhoto")
      .sort({ createdAt: -1 })
      .limit(limit);

    return NextResponse.json(posts);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const { description, user, imageUrls, fileNames, type, eventDate , fileTypes } = body;

  if (!description || !user) {
    return NextResponse.json(
      { error: "Description and User required" },
      { status: 400 }
    );
  }

  try {
    checkLimiter(user,"POST",RATE_LIMITS.POST);

    const imgs = Array.isArray(imageUrls) ? imageUrls : [];
    const post = new Post({
      description,
      user,
      imageUrls: imgs.length > 0 ? imgs : undefined,
      fileNames:fileNames.length > 0 ? fileNames : undefined,
      fileTypes:fileTypes.length > 0 ? fileTypes : undefined,
      type: type || "post",
      eventDate: type === "event" ? eventDate : undefined
    });

    await post.save();
    console.log(post);
    return NextResponse.json(post, { status: 201 });
  } catch (error : any) {
    if(error.message.includes("Too many requests")){
      return NextResponse.json({error : "Rate Limite Exceeded.Try Again Later"},{status: 429});
    }
    console.error("Post Creation Error. Complete Error Message : ", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}

