"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

export default function UsageTracker(){
    const { user } = useAuth();

    useEffect(()=>{
        if(!user) return;

        const startTime = Date.now();
        let sent = false;

        const handleBeforeUnload = () => {
            const duration = Math.floor((Date.now() - startTime) / 1000);
            if(sent) return;
            sent = true;
            navigator.sendBeacon("/api/usage/track" , new Blob([JSON.stringify({userId : user._id , duration})] , {type : "application/json"}));
        }

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            handleBeforeUnload();
            window.removeEventListener("beforeunload", handleBeforeUnload);
        }
        
    },[user]);

    return null;
}