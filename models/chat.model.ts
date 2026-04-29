import mongoose from "mongoose";

export interface IMessage{
    sender:mongoose.Types.ObjectId;
    receiver:mongoose.Types.ObjectId;
    encryptedText:string;
    authTag:string;
    iv:string;
    keyVersion:string;
    text?:string;
    post?:mongoose.Types.ObjectId | null;
    read:boolean;
}

export interface IMessageDocument extends IMessage , Document{
    createdAt:Date;
    updatedAt:Date;
}

const MessageSchema = new mongoose.Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User",
        index:true
    },
    receiver:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User",
        index:true
    },
    encryptedText:{
        type:String,
        required:false
    },
    authTag:{
        type:String,
        required:false
    },
    iv:{
        type:String,
        required:false
    },
    keyVersion:{
        type:String,
        default:"v1"
    },
    text:{
        type:String,
        required:false,
        select:false
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        default: null
    },
    read:{
        type:Boolean,
        default:false,
        index:true
    }
},
{timestamps:true, collection:"Message"});

MessageSchema.index({ sender : 1 , receiver : 1 , createdAt : 1 });
MessageSchema.index({ receiver : 1 , sender : 1 , createdAt : 1 });

export const Message = mongoose.models?.Message || mongoose.model<IMessageDocument>("Message",MessageSchema);