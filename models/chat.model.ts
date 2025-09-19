import mongoose from "mongoose";

export interface IMessage{
    sender:mongoose.Types.ObjectId;
    receiver:mongoose.Types.ObjectId;
    text:string;
}

export interface IMessageDocument extends IMessage , Document{
    createdAt:Date;
    updatedAt:Date;
}

const MessageSchema = new mongoose.Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    receiver:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    text:{
        type:String,
        required:true
    }
},
{timestamps:true, collection:"Message"});

export const Message = mongoose.models?.Message || mongoose.model<IMessageDocument>("Message",MessageSchema);