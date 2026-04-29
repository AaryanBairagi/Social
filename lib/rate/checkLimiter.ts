import { rateLimit } from "./rateLimiter";

export function checkLimiter(userId : string , action : string , config : {
    windowMs : number , max : number
}) {
    const key = `${userId}:${action}`;

    const result = rateLimit(key,config);

    if(!result.success){
        throw new Error("Too Many Requests. Please Slow Down.");
    }
    
    return result;
}