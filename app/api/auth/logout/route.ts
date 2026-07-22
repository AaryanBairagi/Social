import { NextResponse } from "next/server";

export async function POST() {
    const response = NextResponse.json({ success : true , message : "Logged out successfully"} , { status : 200 });
    response.cookies.delete("sc_access_token");
    response.cookies.delete("sc_refresh_token");
    return response;
}