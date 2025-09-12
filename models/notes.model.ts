import mongoose from "mongoose";

export interface INote{
    description:string;
    user: mongoose.Types.ObjectId;
    fileUrl:string;
}

export interface INoteDocument extends INote , Document{
    createdAt:Date;
    updatedAt:Date;
}

const noteSchema = new mongoose.Schema({
    description:{
        type:String
    },

    user: {
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },

    fileUrl:{
        type:String,
        required:true
    }

},
    {timestamps:true,collection:"Note"}
);

export const Note = mongoose.models?.Note as mongoose.Model<INoteDocument> || mongoose.model<INoteDocument>("Note",noteSchema);