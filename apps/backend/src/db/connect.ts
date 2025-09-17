import mongoose from "mongoose";

export const connectToDatabase = async () => {
  if (!process.env.DB_URI) {
    throw new Error("DB_URI is not defined in environment variables");
  }
  await mongoose.connect(process.env.DB_URI || "");

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
};
