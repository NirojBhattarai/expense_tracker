import mongoose from "mongoose";

// Connecting Database using Mongoose 
const connectDB = async()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.mongoDB_URI}`);
        console.log(`MongoDB Successfully Connected !! Host: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error("Database Connection Failed !!",error);
        process.exit(1);
    }
}

export default connectDB;