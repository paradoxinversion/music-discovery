import { beforeEach, describe, expect, it } from "vitest";
import User from "../models/User";
import mongoose from "mongoose";
import Artist from "../models/Artist";
import {
  DEFAULT_TEST_USER_DATA,
  DEFAULT_TEST_ARTIST_DATA,
  DEFAULT_TEST_ALBUM_DATA,
  DEFAULT_TEST_TRACK_DATA,
} from "../../../test-helpers/dbData";
import Album from "../models/Album";
import { createAlbum, deleteAlbum, getAlbumById, updateAlbum } from "./Album";
import { IAlbum } from "@common/types/src/types";
import Track from "../models/Track";

beforeEach(async () => {
  await User.deleteMany({});
  await Artist.deleteMany({});
  await Album.deleteMany({});
  await Track.deleteMany({});
});

describe("Create Album", () => {
  it("Creates an album successfully", async () => {
    const user = new User(DEFAULT_TEST_USER_DATA);
    await user.save();
    const artist = new Artist({
      ...DEFAULT_TEST_ARTIST_DATA,
      managingUserId: user.id.toString(),
    });
    await artist.save();
    const albumData = {
      ...DEFAULT_TEST_ALBUM_DATA,
      artistId: artist._id.toString(),
      managingUserId: user.id.toString(),
    } as IAlbum;
    const createdAlbum = await createAlbum(albumData);
    expect(createdAlbum).toBeDefined();
    expect(createdAlbum.title).toBe(albumData.title);
    expect(createdAlbum.artistId.toString()).toBe(artist._id.toString());
  });
  it("Throws error if album with same title by same artist exists", async () => {
    const user = new User(DEFAULT_TEST_USER_DATA);
    await user.save();
    const artist = new Artist({
      ...DEFAULT_TEST_ARTIST_DATA,
      managingUserId: user.id.toString(),
    });
    await artist.save();
    const albumData = {
      ...DEFAULT_TEST_ALBUM_DATA,
      artistId: artist.id.toString(),
      managingUserId: user.id.toString(),
    } as IAlbum;
    await createAlbum(albumData);
    await expect(createAlbum(albumData)).rejects.toThrow(
      `Album with title ${albumData.title} by artist ${albumData.artistId} already exists`,
    );
  });
});

describe("Get Album", () => {
  it("Fetches an album by ID", async () => {
    const user = new User(DEFAULT_TEST_USER_DATA);
    await user.save();
    const artist = new Artist({
      ...DEFAULT_TEST_ARTIST_DATA,
      managingUserId: user.id.toString(),
    });
    await artist.save();
    const album = new Album({
      ...DEFAULT_TEST_ALBUM_DATA,
      artistId: artist.id.toString(),
      managingUserId: user.id.toString(),
    });
    await album.save();
    const fetchedAlbum = await getAlbumById(album.id.toString());
    expect(fetchedAlbum).toBeDefined();
    expect(fetchedAlbum?._id.toString()).toBe(album._id.toString());
  });
  it("Returns null if album does not exist", async () => {
    const fakeAlbumId = new mongoose.Types.ObjectId().toString();
    const fetchedAlbum = await getAlbumById(fakeAlbumId);
    expect(fetchedAlbum).toBeNull();
  });
});

describe("Update Album", () => {
  it("Updates an album's details", async () => {
    const user = new User(DEFAULT_TEST_USER_DATA);
    await user.save();
    const artist = new Artist({
      ...DEFAULT_TEST_ARTIST_DATA,
      managingUserId: user.id.toString(),
    });
    await artist.save();
    const album = new Album({
      ...DEFAULT_TEST_ALBUM_DATA,
      artistId: artist.id.toString(),
      managingUserId: user.id.toString(),
    });
    await album.save();
    const updateData = {
      title: "Updated Album Title",
      releaseDate: new Date("2023-01-01"),
      managingUserId: user.id.toString(),
    };
    const updatedAlbum = await updateAlbum(album.id.toString(), updateData);
    expect(updatedAlbum).toBeDefined();
    expect(updatedAlbum.title).toBe(updateData.title);
    expect(updatedAlbum.releaseDate?.toISOString()).toBe(
      updateData.releaseDate.toISOString(),
    );
  });
  it("Throws error if album to update does not exist", async () => {
    const fakeAlbumId = new mongoose.Types.ObjectId().toString();
    const updateData = {
      title: "Updated Album Title",
      releaseDate: new Date("2023-01-01"),
    };
    await expect(updateAlbum(fakeAlbumId, updateData)).rejects.toThrow(
      `Album with ID ${fakeAlbumId} not found`,
    );
  });
});

describe("Delete Album", () => {
  it("Deletes an album successfully", async () => {
    const user = new User(DEFAULT_TEST_USER_DATA);
    await user.save();
    const artist = new Artist({
      ...DEFAULT_TEST_ARTIST_DATA,
      managingUserId: user.id.toString(),
    });
    await artist.save();
    const album = new Album({
      ...DEFAULT_TEST_ALBUM_DATA,
      artistId: artist.id.toString(),
      managingUserId: user.id.toString(),
    });
    await album.save();
    const deletedAlbum = await deleteAlbum(album.id.toString());
    expect(deletedAlbum).toBe(true);
    expect(await Album.findById(album.id.toString())).toBeNull();
  });

  it("Deletes associated tracks when album is deleted", async () => {
    const user = new User(DEFAULT_TEST_USER_DATA);
    await user.save();
    const artist = new Artist({
      ...DEFAULT_TEST_ARTIST_DATA,
      managingUserId: user.id.toString(),
    });
    await artist.save();
    const album = new Album({
      ...DEFAULT_TEST_ALBUM_DATA,
      artistId: artist.id.toString(),
      managingUserId: user.id.toString(),
    });
    await album.save();
    const track = new Track({
      ...DEFAULT_TEST_TRACK_DATA,
      artistId: artist.id.toString(),
      albumId: album.id.toString(),
      managingUserId: user.id.toString(),
    });
    await track.save();
    const deletedAlbum = await deleteAlbum(album.id.toString());
    expect(deletedAlbum).toBe(true);
    expect(await Album.findById(album.id.toString())).toBeNull();
    expect(await Track.findById(track.id.toString())).toBeNull();
  });

  it("Removes album from users' favorites when deleted", async () => {
    const user = new User(DEFAULT_TEST_USER_DATA);
    await user.save();
    const artist = new Artist({
      ...DEFAULT_TEST_ARTIST_DATA,
      managingUserId: user.id.toString(),
    });
    await artist.save();
    const album = new Album({
      ...DEFAULT_TEST_ALBUM_DATA,
      artistId: artist.id.toString(),
      managingUserId: user.id.toString(),
    });
    await album.save();
    const track = new Track({
      ...DEFAULT_TEST_TRACK_DATA,
      artistId: artist.id.toString(),
      albumId: album.id.toString(),
      managingUserId: user.id.toString(),
    });
    await track.save();
    user.favoriteAlbums.push(album.id.toString());
    user.favoriteTracks.push(track.id.toString());
    await user.save();
    const deletedAlbum = await deleteAlbum(album.id.toString());
    expect(deletedAlbum).toBe(true);
    const updatedUser = await User.findById(user.id.toString());
    expect(updatedUser?.favoriteAlbums).not.toContain(album.id.toString());
    expect(updatedUser?.favoriteTracks).not.toContain(track.id.toString());
  });

  it("Throws error if album to delete does not exist", async () => {
    const fakeAlbumId = new mongoose.Types.ObjectId().toString();
    await expect(deleteAlbum(fakeAlbumId)).rejects.toThrow(
      `Album with ID ${fakeAlbumId} not found`,
    );
  });
});
