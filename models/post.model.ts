import mongoose from "mongoose";
import { IUser } from "./user.model";
import { IComment } from "./comment.model";

export interface IPost{
    description:string,
    user:IUser,
    imageUrls?:string[],
    fileNames?:string[],
    likes?:mongoose.Types.ObjectId[];    
    comments?: (mongoose.Types.ObjectId | IComment)[];    
    type?:"post" | "event",
    eventDate?:Date,
    savedBy?:string[],
    isArchived?:boolean,
    savedPostsBy?:mongoose.Types.ObjectId[];
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

    imageUrls:[{
        type:String
    }],

    fileNames:[{
        type:String
    }],

    fileTypes:[{
        type:String
    }],
    
    likes:[{ 
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],

    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment"
    }],

    type:{
        type : String,
        enum : ["post","event"],
        default : "post"
    },
    
    eventDate: {
        type: Date,
        required: function () {
            return this.type === "event";
        }
    },

    savedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],

    isArchived:{
        type : Boolean,
        default : false
    },

    savedPostsBy:[{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }]
},
    { timestamps: true , collection:"Post" }  
);

export const Post = mongoose.models?.Post as mongoose.Model<IPostDocument> || mongoose.model<IPostDocument>("Post", postSchema);
