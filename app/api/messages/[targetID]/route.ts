import { Decryption, Encryption } from "@/lib/chat-crypto";
import { connectDB } from "@/lib/db";
import { Message } from "@/models/chat.model";
import { User } from "@/models/user.model";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

/* ===========================
   GET MESSAGES
=========================== */
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ targetID: string }> }
) {
  try {
    await connectDB();

    const params = await context.params;
    const targetID = params.targetID;

    if (!mongoose.Types.ObjectId.isValid(targetID)) {
      return NextResponse.json([], { status: 200 });
    }

    const targetObjectId = new mongoose.Types.ObjectId(targetID);

    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json([], { status: 200 });
    }

    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return NextResponse.json([], { status: 200 });
    }

    const messages = await Message.find({
      $or: [
        { sender: user._id, receiver: targetObjectId },
        { sender: targetObjectId, receiver: user._id },
      ],
    })
      .populate({
        path: "post",
        populate: {
          path: "user",
          select: "firstName lastName userId profilePhoto",
        },
      })
      .sort({ createdAt: 1 });

    const safeMessages = messages.map((msg: any) => {
      let plainText = "";

      try {
        if (msg.encryptedText && msg.authTag && msg.iv) {
          plainText = Decryption({
            encryptedText: msg.encryptedText,
            iv: msg.iv,
            authTag: msg.authTag,
          });
        } else if (msg.text) {
          plainText = msg.text;
        }
      } catch (error) {
        console.error("Decrypt failed:", msg._id, error);
        plainText = "[Unable to decrypt message]";
      }

      return {
        _id: msg._id,
        sender: msg.sender,
        receiver: msg.receiver,
        text: plainText,
        createdAt: msg.createdAt,
        updatedAt: msg.updatedAt,
        post: msg.post || null,
      };
    });

    return NextResponse.json(safeMessages, { status: 200 });

  } catch (error) {
    console.error("Fetch messages error:", error);
    return NextResponse.json([], { status: 200 }); 
  }
}

/* ===========================
   SEND MESSAGE
=========================== */
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ targetID: string }> }
) {
  try {
    await connectDB();

    const params = await context.params;
    const targetID = params.targetID;

    if (!mongoose.Types.ObjectId.isValid(targetID)) {
      return NextResponse.json(
        { error: "Invalid target ID" },
        { status: 400 }
      );
    }

    const targetObjectId = new mongoose.Types.ObjectId(targetID);

    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const senderUser = await User.findOne({ clerkId: userId });
    if (!senderUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const text = body?.text?.trim();

    if (!text && !body.post) {
      return NextResponse.json(
        { error: "Message or post required" },
        { status: 400 }
      );
    }

    let encrypted = null;

    if (text) {
      encrypted = Encryption(text);
    }

    const message = await Message.create({
      sender: senderUser._id,
      receiver: targetObjectId,
      encryptedText: encrypted?.encryptedText,
      iv: encrypted?.iv,
      authTag: encrypted?.authTag,
      keyVersion: encrypted?.keyVersion,
      post: body.post || null,
    });

    return NextResponse.json(
      {
        _id: message._id,
        sender: message.sender,
        receiver: message.receiver,
        post: message.post,
        text,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Send message error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
