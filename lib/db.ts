import mongoose, { Connection } from "mongoose";

let isConnected:Connection | boolean = false; //initially isConnected is false so we dont need to connect to db again and again 

export const connectDB = async()=>{
    if(isConnected){
        console.log("MongoDB is already Connected");
        return isConnected;
    }
    try{
        const res = await mongoose.connect(process.env.MONGO_URI!);
        isConnected = res.connection;
        console.log("MongoDB Connected Successfully");
        return isConnected;
    }catch(error){
        console.log("Error Connecting to MongoDB");
        console.error(error);
    }
}