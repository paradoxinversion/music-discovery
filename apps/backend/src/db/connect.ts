import mongoose from "mongoose";
import { seedDatabase } from "./seed";
import User from "./models/User";
import { readFileSync } from "fs";

export const connectToDatabase = async () => {
  if (process.env.NODE_ENV === "development" && process.env.DB_URI) {
    await mongoose.connect(
      `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    );
  }

  if (process.env.NODE_ENV === "production") {
    const dbUser = readFileSync("/run/secrets/db_user", "utf-8").trim();
    const dbpassword = readFileSync("/run/secrets/db_password", "utf-8").trim();
    console.log(
      `mongodb://${dbUser}:${dbpassword}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    );
    await mongoose.connect(
      `mongodb://${dbUser}:${dbpassword}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
      { authSource: "admin" },
    );
  }

  if (process.env.NODE_ENV === "development" && mongoose.connection.db) {
    if ((await User.countDocuments({})) > 0) {
      console.log("Database already seeded");
      return;
    }
    await mongoose.connection.db.dropDatabase();
    console.log("Dropped existing database for development environment");
    await seedDatabase();
  }
};
