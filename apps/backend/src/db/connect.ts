import mongoose from "mongoose";
import { seedDatabase } from "./seed";
import User from "./models/User";

export const connectToDatabase = async () => {
  console.log("Connecting to database:", process.env.DB_URI);
  if (!process.env.DB_URI) {
    throw new Error("DB_URI is not defined in environment variables");
  }
  await mongoose.connect(process.env.DB_URI || "");

  if (process.env.NODE_ENV === "development" && mongoose.connection.db) {
    if ((await User.countDocuments({})) > 0) {
      console.log("Database already seeded");
      return;
    }
    await mongoose.connection.db.dropDatabase();
    console.log("Dropped existing database for development environment");
    await seedDatabase();
  }

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
};
