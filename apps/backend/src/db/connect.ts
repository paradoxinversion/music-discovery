import mongoose from "mongoose";
import { seedDatabase } from "./seed";
import User from "./models/User";
import { readFileSync } from "fs";

export const connectToDatabase = async () => {
  if (process.env.NODE_ENV === "development") {
    try {
      await mongoose.connect(
        `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
      );
      if (mongoose.connection.db) {
        if ((await User.countDocuments({})) > 0) {
          console.log("Database already seeded");
          return;
        }
        await mongoose.connection.db.dropDatabase();
        console.log("Dropped existing database for development environment");
        await seedDatabase();
      }
    } catch (error) {
      console.error("Error connecting to the database:", error);
      throw error; // Re-throw the error after logging it
    }
  }

  if (process.env.NODE_ENV === "production") {
    const dbUser = readFileSync("/run/secrets/DB_USER", "utf-8").trim();
    const dbpassword = readFileSync("/run/secrets/DB_PASSWORD", "utf-8").trim();
    await mongoose.connect(
      `mongodb://${dbUser}:${dbpassword}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
      { authSource: "admin" },
    );
  }
};
