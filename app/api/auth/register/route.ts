import { hashPassword } from "@/lib/auth/password";
import { signAccessToken, signRefreshToken } from "@/lib/auth/tokens";
import { connectDB } from "@/lib/db";
import { validate } from "@/lib/validation";
import { RegisterSchema } from "@/lib/validators";
import { User } from "@/models/user.model";
import { NextRequest , NextResponse } from "next/server";

export async function POST(req : NextRequest){
    try{
        await connectDB();

        const body = await req.json();
        
        const validated = validate(RegisterSchema , body);
        if(!validated.success){
            return validated.response;
        }

        const { firstName , lastName , username ,  email , password } = validated.data;

        if(!firstName || !lastName || !username || !email || !password){
            return NextResponse.json({ success : false , message : "All fields are required" }, { status : 400 });
        }

        const existingEmail = await User.findOne({email});
        if(existingEmail){
            return NextResponse.json({ success : false , message : "Email already exists" }, { status : 409 });
        }

        const existingUser = await User.findOne({username});
        if(existingUser){
            return NextResponse.json({ success : false , message : "User already exists" }, { status : 409 });
        }

        const hashedPassword = await hashPassword(password);
        const user = await User.create({
            firstName,
            lastName,
            username,
            email,
            password : hashedPassword
        });

        const accessToken =  await signAccessToken({
            userId : user._id.toString(),
            email : user.email
        });

        const refreshToken = await signRefreshToken({
            userId : user._id.toString(),
            email : user.email
        });

        const userObj = await User.findById(user._id).select("-password").lean();

        const response = NextResponse.json({ success : true , user : userObj});

        response.cookies.set("sc_access_token" , accessToken , {
            httpOnly : true,
            secure : process.env.NODE_ENV === "production",
            sameSite : "lax",
            path : "/",
            maxAge : 15 * 60,
        });

        response.cookies.set("sc_refresh_token" , refreshToken , {
            httpOnly : true,
            secure : process.env.NODE_ENV === "production",
            sameSite : "lax",
            path : "/",
            maxAge : 30 * 24 * 60 * 60 
        });

        return response;
        
    }catch(err : any){
        console.error("Error registering the user : " , err);
        return NextResponse.json({ success : false , message : "Internal Server Error" }, { status : 500 });
    }
}