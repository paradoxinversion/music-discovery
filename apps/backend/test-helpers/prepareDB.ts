import mongoose from "mongoose";

export const prepareDB = async () => {
    await mongoose.connect("mongodb://mongo:27017/music-discovery-app-test");
    mongoose.connection.once("open", () => {
        console.log("Connected to the test database");
    });
    mongoose.connection.on("error", (err) => {
        console.error("MongoDB connection error:", err);
    });
};

