import mongoose, { Schema, Types } from "mongoose";
import { Noto_Sans_Tifinagh } from "next/font/google";

const NotificationSchema = new Schema({
    user:{
        type:Types.ObjectId,
        ref:"User",
        required:true
    },
    //who triggered it
    actor:{
        type:Types.ObjectId,
        ref:"User",
        required:true
    },
    type:{
        type:String,
        enum:["LIKE","COMMENT","FOLLOW_REQUEST","FOLLOW_ACCEPT"],
        required:true
    },
    post:{
        type:Types.ObjectId,
        ref:"Post"
    },
    comment:{
        type:Types.ObjectId,
        ref:"Comment"
    },
    isRead:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

export const Notification = mongoose.models.Notification || mongoose.model("Notification",NotificationSchema)