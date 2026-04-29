import mongoose, { Document } from "mongoose";

export interface IConnection{
    fromUser: mongoose.Types.ObjectId;
    toUser: mongoose.Types.ObjectId;
    type:"connection";
    status:"pending" | "accepted";
    respondedAt?:Date | null;
}

export interface IConnectionDocument extends IConnection , Document{
    createdAt:Date;
    updatedAt:Date;
}

const connectionSchema = new mongoose.Schema({
    fromUser: {
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref: "User"
    },
    toUser:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref: "User"
    },
    type:{
        type: String,
        required : true,
        default : "connection",
        enum : ["connection"],
    },
    status:{
        type: String,
        enum : ["pending","accepted"],
        required: true ,
        default: "pending"
    },
    respondedAt: {
      type: Date,
      default: null,
    },

},{timestamps:true , collection:"Connection"});

connectionSchema.index({fromUser : 1 , toUser : 1 , type : 1},{unique:true});
connectionSchema.index({fromUser : 1 , type : 1 , status : 1});
connectionSchema.index({toUser : 1 , status : 1 , type : 1});
connectionSchema.index({status : 1 , createdAt : -1});

connectionSchema.pre("validate" , function(next){
    if(this.fromUser?.toString() === this.toUser?.toString()){
        return next(new Error("Users cannot send request to themselves"))
    }
    next();
});

export const Connection = mongoose.models?.Connection as mongoose.Model<IConnectionDocument> || mongoose.model<IConnectionDocument>("Connection",connectionSchema) ;