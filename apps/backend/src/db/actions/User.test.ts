import { beforeEach, describe, expect, it } from "vitest";
import User from "../models/User";
import mongoose from "mongoose";
import { addFavoriteArtist, createUser, getUserById, removeFavoriteArtist, deleteUser } from "./User";
import Artist from "../models/Artist";
import {DEFAULT_TEST_ALBUM_DATA, DEFAULT_TEST_ARTIST_DATA, DEFAULT_TEST_TRACK_DATA, DEFAULT_TEST_USER_DATA, DEFAULT_TEST_USER_SIGNUP} from "../../../test-helpers/dbData";
import Album from "../models/Album";
import Track from "../models/Track";

beforeEach(async () => {
    await User.deleteMany({});
    await Artist.deleteMany({});
    await Track.deleteMany({});
    await Album.deleteMany({});
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

describe ("Get User By ID", ()=>{
    it("Retrieves a user by ID", async ()=>{
        const createdUser = await createUser(DEFAULT_TEST_USER_SIGNUP);
        expect(createdUser).toBeDefined();
        const fetchedUser = await getUserById(createdUser._id.toString());
        expect(fetchedUser).toBeDefined();
        expect(fetchedUser?._id.toString()).toBe(createdUser._id.toString());
    });
    
    it("Returns null if user does not exist", async ()=>{
        const fakeUserId = new mongoose.Types.ObjectId().toString();
        const fetchedUser = await getUserById(fakeUserId);
        expect(fetchedUser).toBeNull();
    });
});

describe("Add favorite artist", ()=>{
    it("Adds a favorite artist to user", async ()=>{
        const user = new User(DEFAULT_TEST_USER_DATA);
        await user.save();
        const artist = new Artist({
            "name": "The Crescendolls",
            "genre": "Electronic",
            "biography": "An extraterrestrial band known for their catchy tunes.",
            "managingUserId": user._id.toString()
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
            "biography": "An extraterrestrial band known for their catchy tunes.",
            managingUserId: user._id.toString()
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
            "biography": "An extraterrestrial band known for their catchy tunes.",
            managingUserId: fakeUserId
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
            "biography": "An extraterrestrial band known for their catchy tunes.",
            managingUserId: user._id.toString()
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
            "biography": "An extraterrestrial band known for their catchy tunes.",
            managingUserId: user._id.toString()
        });
        await artist.save();
        await expect(removeFavoriteArtist(user._id.toString(), artist._id.toString())).rejects.toThrow();
    });

    it ("Throws an error if the user does not exist", async ()=>{
        const fakeUserId = new mongoose.Types.ObjectId().toString();
        const artist = new Artist({
            "name": "The Crescendolls",
            "genre": "Electronic",
            "biography": "An extraterrestrial band known for their catchy tunes.",
            managingUserId: fakeUserId
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

describe("Delete User", ()=>{
    it("Deletes a user successfully", async ()=>{
        const user = new User(DEFAULT_TEST_USER_DATA);
        await user.save();
        const deletionResult = await deleteUser(user._id.toString());
        expect(deletionResult).toBe(true);
        const fetchedUser = await User.findById(user._id.toString());
        expect(fetchedUser).toBeNull();
    });

    it("Deletes a user and their managed artists along with associated albums and tracks", async ()=>{
        const user = new User(DEFAULT_TEST_USER_DATA);
        await user.save();
        const artist = new Artist({
            ...DEFAULT_TEST_ARTIST_DATA,
            managingUserId: user._id.toString()
        });
        await artist.save();

        const album = new Album({
            ...DEFAULT_TEST_ALBUM_DATA,
            artistId: artist._id.toString(),
        });
        await album.save();
        const track = new Track({
            ...DEFAULT_TEST_TRACK_DATA,
            albumId: album._id.toString(),
            artistId: artist._id.toString(),
        });
        await track.save();
        const deletionResult = await deleteUser(user._id.toString());
        expect(deletionResult).toBe(true);
        const fetchedUser = await User.findById(user._id.toString());
        expect(fetchedUser).toBeNull();

        const fetchedArtist = await Artist.findById(artist._id.toString());
        expect(fetchedArtist).toBeNull();

        const fetchedAlbum = await Album.findById(album._id.toString());
        expect(fetchedAlbum).toBeNull();

        const fetchedTrack = await Track.findById(track._id.toString());
        expect(fetchedTrack).toBeNull();
    });

    it("Throws an error when trying to delete a non-existent user", async ()=>{
        const nonExistentId = new mongoose.Types.ObjectId().toString();
        await expect(deleteUser(nonExistentId)).rejects.toThrow(`User with ID ${nonExistentId} not found`);
    });
});