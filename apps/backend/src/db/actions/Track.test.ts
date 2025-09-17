import { beforeEach, describe, expect, it } from "vitest";
import User from "../models/User";
import mongoose from "mongoose";
import Artist from "../models/Artist";
import {
  DEFAULT_TEST_ALBUM_DATA,
  DEFAULT_TEST_ARTIST_DATA,
  DEFAULT_TEST_TRACK_DATA,
  DEFAULT_TEST_USER_DATA,
} from "../../../test-helpers/dbData";
import Album from "../models/Album";
import { ITrack } from "@common/types/src/types";
import Track from "../models/Track";
import { createTrack, getTrackById, updateTrack, deleteTrack } from "./Track";

beforeEach(async () => {
  await User.deleteMany({});
  await Artist.deleteMany({});
  await Album.deleteMany({});
  await Track.deleteMany({});
});

describe("Create Track", () => {
  it("Creates a track successfully", async () => {
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

    const trackData: ITrack = {
      ...DEFAULT_TEST_TRACK_DATA,
      albumId: album.id.toString(),
      artistId: artist.id.toString(),
      managingUserId: user.id.toString(),
    } as ITrack;
    const createdTrack = await createTrack(trackData);
    expect(createdTrack).toBeDefined();
    expect(createdTrack.title).toBe(trackData.title);
    expect(createdTrack.albumId.toString()).toBe(album.id.toString());
    expect(createdTrack.artistId.toString()).toBe(artist.id.toString());
  });

  it("Prevents creating duplicate tracks in the same album", async () => {
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

    const trackData: ITrack = {
      ...DEFAULT_TEST_TRACK_DATA,
      albumId: album.id.toString(),
      artistId: artist.id.toString(),
      managingUserId: user.id.toString(),
    } as ITrack;
    const createdTrack = await createTrack(trackData);
    expect(createdTrack).toBeDefined();

    // Attempt to create the same track again
    await expect(createTrack(trackData)).rejects.toThrow(
      `Track with title ${trackData.title} in album ${trackData.albumId} already exists`,
    );
  });
});

describe("Get Track By ID", () => {
  it("Retrieves a track by its ID", async () => {
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
      albumId: album.id.toString(),
      artistId: artist.id.toString(),
      managingUserId: user.id.toString(),
    });
    await track.save();

    const fetchedTrack = getTrackById(track.id.toString());
    expect(fetchedTrack).toBeDefined();
    expect((await fetchedTrack)?.id.toString()).toBe(track.id.toString());
  });

  it("Returns null for non-existent track ID", async () => {
    const nonExistentId = new mongoose.Types.ObjectId().toString();
    const fetchedTrack = await getTrackById(nonExistentId);
    expect(fetchedTrack).toBeNull();
  });
});

describe("Update Track", () => {
  it("Updates track details successfully", async () => {
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
      albumId: album.id.toString(),
      artistId: artist.id.toString(),
      managingUserId: user.id.toString(),
    });
    await track.save();

    const newTitle = "Updated Track Title";
    const updatedTrack = await updateTrack(track.id.toString(), {
      title: newTitle,
    });
    expect(updatedTrack).toBeDefined();
    expect(updatedTrack.title).toBe(newTitle);
    expect(updatedTrack.genre).toBe(track.genre); // unchanged
  });

  it("Throws error when updating non-existent track", async () => {
    const nonExistentId = new mongoose.Types.ObjectId().toString();
    await expect(
      updateTrack(nonExistentId, { title: "New Title" }),
    ).rejects.toThrow(`Track with ID ${nonExistentId} not found`);
  });
});

describe("Delete Track", () => {
  it("Deletes a track successfully", async () => {
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
      albumId: album.id.toString(),
      artistId: artist._id.toString(),
      managingUserId: user.id.toString(),
    });
    await track.save();

    const deletionResult = await deleteTrack(track._id.toString());
    expect(deletionResult).toBe(true);

    const fetchedTrack = await getTrackById(track._id.toString());
    expect(fetchedTrack).toBeNull();
  });

  it("Throws error when deleting non-existent track", async () => {
    const nonExistentId = new mongoose.Types.ObjectId().toString();
    await expect(deleteTrack(nonExistentId)).rejects.toThrow(
      `Track with ID ${nonExistentId} not found`,
    );
  });
});
