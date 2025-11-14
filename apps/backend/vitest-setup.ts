import { afterAll, beforeAll } from "vitest";
import mongoose from "mongoose";
import User from "./src/db/models/User";
import Artist from "./src/db/models/Artist";
import Track from "./src/db/models/Track";
import Album from "./src/db/models/Album";
import { connectToDatabase } from "./src/db";

beforeAll(async () => {
  await connectToDatabase();
});

afterAll(async () => {
  await User.deleteMany({});
  await Artist.deleteMany({});
  await Track.deleteMany({});
  await Album.deleteMany({});
  await mongoose.connection.dropDatabase();
});
