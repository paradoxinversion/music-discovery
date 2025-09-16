import { afterAll, beforeAll } from "vitest";
import { prepareDB } from "./test-helpers/prepareDB";
import mongoose from "mongoose";
import User from "./src/db/models/User";
import Artist from "./src/db/models/Artist";
import Track from "./src/db/models/Track";
import Album from "./src/db/models/Album";

beforeAll(async () => {
  await prepareDB();
});
afterAll(async () => {
  await User.deleteMany({});
  await Artist.deleteMany({});
  await Track.deleteMany({});
  await Album.deleteMany({});
  await mongoose.connection.dropDatabase();
});
