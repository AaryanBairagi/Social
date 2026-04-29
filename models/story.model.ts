import mongoose from "mongoose";

const storySchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,
    },
    mediaUrl : {
        type : String,
        required : true,
    },
    fileType:{
        type : String, //image or video
        default : "image"
    },
    createdAt : {
        type : Date,
        default : Date.now
    },
    expiresAt : {
        type : Date,
        required : true
    }
},{timestamps:true});

storySchema.index({expiresAt:1},{expireAfterSeconds:0});

export const Story =  mongoose.models.Story || mongoose.model("Story" , storySchema);