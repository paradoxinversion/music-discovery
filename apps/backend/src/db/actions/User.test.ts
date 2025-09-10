import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import {prepareDB} from "../../../test-helpers/prepareDB"
import User from "../models/User";
import mongoose from "mongoose";
import { IArtist, IUser, IUserSignup } from "@common/types/src/types";
import { addFavoriteArtist, createUser, removeFavoriteArtist } from "./User";
import Artist from "../models/Artist";

const DEFAULT_TEST_USER_SIGNUP: IUserSignup = {
    username: "testuser",
    email: "testuser@example.com",
    password: "password123"
};

const DEFAULT_TEST_USER_DATA: IUser = {
    username: "testuser",
    email: "testuser@example.com",
    password: "password123",
    favoriteArtists: [],
    favoriteAlbums: [],
    favoriteTracks: []
};

beforeAll(async () => {
    console.log("Setting up tests...");
    await prepareDB();
})
afterAll(async () => {
    console.log("Tearing down tests...");
    await mongoose.connection.dropDatabase();
    await new Promise((resolve) => setTimeout(() => resolve(true), 500)); // Give some time for the DB to settle
});

beforeEach(async () => {
    // Clear users before each test
    await User.deleteMany({});
});

describe("Create User", () => {
    it("Creates a user", async () => {
        const createdUser = await createUser(DEFAULT_TEST_USER_SIGNUP);
        expect(createdUser).toBeDefined();
        expect(createdUser.username).toBe(DEFAULT_TEST_USER_SIGNUP.username);
        expect(createdUser.email).toBe(DEFAULT_TEST_USER_SIGNUP.email);
        expect(createdUser.password).not.toBe(DEFAULT_TEST_USER_SIGNUP.password); // Password should be hashed
    });

    it("Throws error if username is taken", async () => {
        const firstUser = await createUser(DEFAULT_TEST_USER_SIGNUP);
        expect(firstUser).toBeDefined();

        await expect(createUser(DEFAULT_TEST_USER_SIGNUP)).rejects.toThrow();
    });

    it("Throws error if email is already in use", async () => {
        const firstUser = await createUser(DEFAULT_TEST_USER_SIGNUP);
        expect(firstUser).toBeDefined();

        await expect(createUser({...DEFAULT_TEST_USER_SIGNUP, username: "notthesame"})).rejects.toThrow(/duplicate key error/);
    });
});

describe("Add favorite artist", ()=>{
    it("Adds a favorite artist to user", async ()=>{
        const user = new User(DEFAULT_TEST_USER_DATA);
        await user.save();
        const artist = new Artist({
            "name": "The Crescendolls",
            "genre": "Electronic",
            "biography": "An extraterrestrial band known for their catchy tunes."
        });
        await artist.save();
        await addFavoriteArtist(user._id.toString(), artist._id.toString());
        const updatedUser = await User.findById(user._id);
        expect(updatedUser).toBeDefined();
        expect(updatedUser?.favoriteArtists.length).toBe(1);
        expect(updatedUser?.favoriteArtists[0]?.toString()).toBe(artist._id.toString());
    });

    it("Throws an error if the user already has the artist as favorite", async ()=>{
        const user = new User(DEFAULT_TEST_USER_DATA);
        await user.save();
        const artist = new Artist({
            "name": "The Crescendolls",
            "genre": "Electronic",
            "biography": "An extraterrestrial band known for their catchy tunes."
        });
        await artist.save();
        await addFavoriteArtist(user._id.toString(), artist._id.toString());
        await expect(addFavoriteArtist(user._id.toString(), artist._id.toString())).rejects.toThrow();
    });

    it ("Throws an error if the user does not exist", async ()=>{
        const fakeUserId = new mongoose.Types.ObjectId().toString();
        const artist = new Artist({
            "name": "The Crescendolls",
            "genre": "Electronic",
            "biography": "An extraterrestrial band known for their catchy tunes."
        });
        await artist.save();
        await expect(addFavoriteArtist(fakeUserId, artist._id.toString())).rejects.toThrow();
    });
    
    it ("Throws an error if the artist does not exist", async ()=>{
        const user = new User(DEFAULT_TEST_USER_DATA);
        await user.save();
        const fakeArtistId = new mongoose.Types.ObjectId().toString();
        await expect(addFavoriteArtist(user._id.toString(), fakeArtistId)).rejects.toThrow();
    });
});

describe("Remove favorite artist", ()=>{
    it("Removes a favorite artist from user", async ()=>{
        const user = new User(DEFAULT_TEST_USER_DATA);
        await user.save();
        const artist = new Artist({
            "name": "The Crescendolls",
            "genre": "Electronic",
            "biography": "An extraterrestrial band known for their catchy tunes."
        });
        await artist.save();

        await User.updateOne({_id: user._id}, {$push: {favoriteArtists: artist._id.toString()}});
        await user.save();
        const updatedUser = await User.findById(user._id);
        expect(updatedUser).toBeDefined();
        expect(updatedUser?.favoriteArtists.length).toBe(1);
        expect(updatedUser?.favoriteArtists[0]?.toString()).toBe(artist._id.toString());

        // Now remove the artist
        await removeFavoriteArtist(user._id.toString(), artist._id.toString());
        const userAfterRemoval = await User.findById(user._id);
        expect(userAfterRemoval).toBeDefined();
        expect(userAfterRemoval?.favoriteArtists.length).toBe(0);
    });

    it("Throws an error if the user does not have the artist as favorite", async ()=>{
        const user = new User(DEFAULT_TEST_USER_DATA);
        await user.save();
        const artist = new Artist({
            "name": "The Crescendolls",
            "genre": "Electronic",
            "biography": "An extraterrestrial band known for their catchy tunes."
        });
        await artist.save();
        await expect(removeFavoriteArtist(user._id.toString(), artist._id.toString())).rejects.toThrow();
    });

    it ("Throws an error if the user does not exist", async ()=>{
        const fakeUserId = new mongoose.Types.ObjectId().toString();
        const artist = new Artist({
            "name": "The Crescendolls",
            "genre": "Electronic",
            "biography": "An extraterrestrial band known for their catchy tunes."
        });
        await artist.save();
        await expect(removeFavoriteArtist(fakeUserId, artist._id.toString())).rejects.toThrow();
    });
    
    it ("Throws an error if the artist does not exist", async ()=>{
        const user = new User(DEFAULT_TEST_USER_DATA);
        await user.save();
        const fakeArtistId = new mongoose.Types.ObjectId().toString();
        await expect(removeFavoriteArtist(user._id.toString(), fakeArtistId)).rejects.toThrow();
    });
})