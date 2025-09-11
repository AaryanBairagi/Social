import mongoose from "mongoose";
import { IUser } from "./user.model";
import { IComment } from "./comment.model";

export interface IPost{
    description:string,
    user:IUser,
    imageUrl?:string,
    likes?:string[],
    comments?: mongoose.Types.ObjectId[] | IComment[];
}

export interface IPostDocument extends IPost , Document{
    createdAt:Date,
    updatedAt:Date
}

const postSchema = new mongoose.Schema(
{
    description:{
        type:String,
        required:true
    },
    
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    imageUrl:{
        type:String
    },

    likes:[{ 
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],

    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment"
    }]
},
    { timestamps: true , collection:"Post" }  
);

export const Post = mongoose.models?.Post as mongoose.Model<IPostDocument> || mongoose.model<IPostDocument>("Post", postSchema);
