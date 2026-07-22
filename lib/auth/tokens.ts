import { SignJWT , jwtVerify , type JWTPayload } from 'jose';

const accessSecret = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET!);
const refreshSecret = new TextEncoder().encode(process.env.JWT_REFRESH_SECRET!);

export interface TokenPayload extends JWTPayload {
    userId: string;
    email: string;
}

export async function signAccessToken(payload : TokenPayload) {
    return await new SignJWT(payload).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("15m").sign(accessSecret);
}

export async function signRefreshToken(payload : TokenPayload){
    return await new SignJWT(payload).setProtectedHeader({ alg : "HS256" }).setIssuedAt().setExpirationTime("30d").sign(refreshSecret);
}

export async function verifyAccessToken(token : string) : Promise<TokenPayload> {
    const { payload } = await jwtVerify(token, accessSecret);
    return payload as TokenPayload;
}

export async function verifyRefreshToken(token : string) : Promise<TokenPayload> {
    const { payload } = await jwtVerify(token, refreshSecret);
    return payload as TokenPayload;
}