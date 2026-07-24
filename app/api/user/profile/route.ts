import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/user.model";
import { getAuth } from "@/lib/auth/getAuth";
import { validate } from "@/lib/validation";
import { UpdateProfileSchema } from "@/lib/validators";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { userId } = await getAuth(req);

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await User.findById(userId).lean();

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("GET profile error:", error);

    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();

    const { userId } = await getAuth(req);

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    console.log(body);

    const validated = validate(UpdateProfileSchema , body);
    if (!validated.success) {
      console.log("ZOD ERROR:", validated);

      return NextResponse.json(
      {
        error: "Validation failed",
        validation: validated,
      },
      { status: 400 }
      );
    }

    const {
      firstName,
      lastName,
      bio,
      college,
      department,
      year,
      interests,
      socialLinks,
      profilePhoto,
    } = validated.data;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        bio,
        college,
        department,
        year,
        interests,
        socialLinks,
        profilePhoto,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("PUT profile error:", error);

    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}