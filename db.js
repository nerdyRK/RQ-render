import * as dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

const mongoUrl = process.env.MONGO_URL;
let db;

const connectDB = async () => {
  try {
    await mongoose.connect(mongoUrl);
    console.log("Connected to MongoDB");
    db = mongoose.connection.useDb("RQ_Analytics");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

export { db, connectDB };
