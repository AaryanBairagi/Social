import { signAccessToken, verifyRefreshToken } from "@/lib/auth/tokens";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
    try{
        const cookieStore = await cookies();
        const refreshToken = cookieStore.get("sc_refresh_token")?.value;
        if(!refreshToken){
            return NextResponse.json({ success : false , message : "Invalid refresh token" } , { status : 401 });
        }

        const payload = await verifyRefreshToken(refreshToken);
        const newAccessToken = await signAccessToken({
            userId : payload.userId,
            email : payload.email
        });

        const response = NextResponse.json({ success : true });

        response.cookies.set("sc_access_token" , newAccessToken , {
            httpOnly : true,
            secure : process.env.NODE_ENV === "production",
            sameSite : "lax",
            path : "/",
            maxAge : 15 * 60
        });

        return response;
    }catch(err){
        console.error("Error refreshing token" , err);
        return NextResponse.json({ success : false , message : "Invalid refresh token" },{ status : 401 });
    }
}