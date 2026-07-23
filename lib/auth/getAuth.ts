import { NextRequest } from "next/server";
import { verifyAccessToken } from "./tokens";

export interface AuthResult{
    userId : string | null;
}

export async function getAuth(req : NextRequest) : Promise<AuthResult> {
    const token = req.cookies.get("sc_access_token")?.value;
    if(!token){
        return { userId : null };
    }

    try{
        const payload = await verifyAccessToken(token);
        return { userId : payload.userId };
    }catch(err){
        console.error("Error getting userId from cookies" , err);
        return { userId : null };
    }
}