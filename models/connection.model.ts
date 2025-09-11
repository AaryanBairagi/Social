import mongoose from "mongoose";

export interface IConnection{
    follower: mongoose.Types.ObjectId;
    following: mongoose.Types.ObjectId;
}

export interface IConnectionDocument extends IConnection , Document{
    createdAt:Date;
    updatedAt:Date;
}

const connectionSchema = new mongoose.Schema({
    follower: {
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref: "User"
    },
    following:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref: "User"
    }
},{timestamps:true , collection:"Connection"});

export const Connection = mongoose.models?.Connection as mongoose.Model<IConnectionDocument> || mongoose.model<IConnectionDocument>("Connection",connectionSchema) ;