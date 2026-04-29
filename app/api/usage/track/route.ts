import { Usage } from "@/models/usage.model";
import { User } from "@/models/user.model";
import { NextRequest } from "next/server";

export async function POST(req : NextRequest){
    try{
        const { userId , duration } = await req.json();

        if(!userId || !duration){
            return new Response(JSON.stringify({error: "Missing required fields"}), {status: 400});
        }

        const user = await User.findOne({ clerkId : userId });
        
        if(!user){
            return new Response(JSON.stringify({error: "User not found"}), {status: 404});
        }

        const today = new Date().toISOString().split('T')[0];
        await Usage.findOneAndUpdate(
        { user: user._id, date: today },
        { $inc: { timeSpent: duration } },
        { upsert: true, new: true }
        );

        return new Response(JSON.stringify({message: "Usage tracked successfully"}), {status: 200});
    }catch(err){
        console.log("Error tracking usage", err);
        return new Response(JSON.stringify({error: "Internal server error"}), {status: 500});
    }
}