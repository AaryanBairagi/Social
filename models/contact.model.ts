import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    subject:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    },
    email:{
        type:String,
        requitred:true
    }
},{timestampe:true,collection:"Contact"})

export interface IContact{
    name:string;
    email:string;
    subject:string;
    message:string;
}

export interface IContactDocument extends IContact, Document{
    createdAt:Date;
    updatedAt:Date;
}

export const Contact = mongoose.models?.Contact as mongoose.Model<IContactDocument> || mongoose.model<IContactDocument>("Contact",contactSchema)