import mongoose from "mongoose";

export const prepareDB = async () => {
  const client = await mongoose.connect(
    "mongodb://localhost:27017/music-discovery-app-test",
  );
  return client;
};
