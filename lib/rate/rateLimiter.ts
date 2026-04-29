type RequestLog = {
    timestamps : number[]
};

type RateLimitConfig = {
    windowMs : number,
    max : number
};

const store = new Map<string,RequestLog>();

export function rateLimit (key:string,config:RateLimitConfig) : {success: boolean ; remaining: number} {
    const now = Date.now();
    const windowStart = now - config.windowMs; 
    
    let entry = store.get(key);
    if(!entry){
        entry = {
            timestamps : []
        };
        store.set(key , entry);
    }

    entry.timestamps.filter((ts)=> ts > windowStart);

    if(entry.timestamps.length>=config.max){
        return{
            success : false,
            remaining : 0
        }
    }
    entry.timestamps.push(now);
    return{
        success : true,
        remaining : config.max - entry.timestamps.length
    }
}