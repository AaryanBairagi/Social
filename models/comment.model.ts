import mongoose from 'mongoose';
import { IUser } from './user.model';

export interface IComment{
    textMessage:string,
    user:IUser
}

export interface ICommentDocument extends IComment , Document{
    createdAt:Date,
    updatedAt:Date
}

const commentSchema = new mongoose.Schema({
    textMessage:{
        type:String,
        required:true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
},{timestamps:true , collection:"Comment"});

export const Comment = mongoose.models?.Comment as mongoose.Model<ICommentDocument> || mongoose.model<ICommentDocument>("Comment", commentSchema);
