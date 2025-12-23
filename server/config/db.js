import mongoose from "mongoose";

export const connectDb=async ()=>{
    try {
        const connection=await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connection Successful");
        
    } catch (error) {
        console.log("MongoDB connection Failed : ",error);
        process.exit(1);
    }
}

