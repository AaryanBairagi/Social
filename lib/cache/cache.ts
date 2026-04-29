type CacheEntry = {
    data : any,
    expiry : number
}

const cache = new Map<string,CacheEntry>();
export const setCache = (key:string,data:any,ttlMs:number) => {
    const expiry = Date.now() + ttlMs;
    cache.set(key,{
        data,
        expiry
    });
} 

export const getCache = (key:string) => {
    const entry = cache.get(key);
    if(!entry) return null;

    if(Date.now() > entry.expiry){
        cache.delete(key);
        return null;
    }

    return entry.data;
}

export function deleteCache(key: string) {
  cache.delete(key);
}