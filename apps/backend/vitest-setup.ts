import { afterAll, beforeAll } from "vitest";
import { prepareDB } from "./test-helpers/prepareDB";
import mongoose from "mongoose";
import User from "./src/db/models/User";
import Artist from "./src/db/models/Artist";

beforeAll(async () => {
    await prepareDB();
});
afterAll(async () => {
    await User.deleteMany({});
    await Artist.deleteMany({});
    await mongoose.connection.dropDatabase();
});
