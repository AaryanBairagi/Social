import mongoose from "mongoose";

export interface IUsage extends Document{
    user : mongoose.Schema.Types.ObjectId,
    date : string,
    timeSpent : number
}

const usageSchema = new mongoose.Schema({
    user:{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    date : {
        type:  String,
        required : true
    },
    timeSpent : {
        type : Number,
        required : true,
        default : 0
    }
},{timestamps:true});

export const Usage = mongoose.models?.Usage as mongoose.Model<IUsage> || mongoose.model<IUsage>("Usage" , usageSchema, "Usage");