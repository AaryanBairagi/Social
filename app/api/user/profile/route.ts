import { NextRequest, NextResponse } from "next/server";
import { User } from "@/models/user.model"; 
import { connectDB } from "@/lib/db";

export async function GET(req: NextRequest) {
  await connectDB();
  const clerkId = req.nextUrl.searchParams.get("clerkId");
  if (!clerkId) return NextResponse.json({ error: "clerkId required" }, { status: 400 });
  const user = await User.findOne({ clerkId }).lean();
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  return NextResponse.json(user);
}

export async function POST(req: NextRequest) {
  await connectDB();
  try {
    const body = await req.json();
    const { userId, email, clerkId, ...rest } = body;

    if (!userId || !email || !clerkId) {
      return NextResponse.json({ error: "userId, email, and clerkId required" }, { status: 400 });
    }

    const existingUser = await User.findOne({ clerkId });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }

    const newUser = new User({ userId, email, clerkId, password: "dummyPassword123!", ...rest });
    await newUser.save();

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  await connectDB();
  try {
    const body = await req.json();
    const { clerkId, ...updates } = body;
    if (!clerkId) return NextResponse.json({ error: "clerkId required" }, { status: 400 });

    const updatedUser = await User.findOneAndUpdate({ clerkId }, updates, { new: true });
    if (!updatedUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}


