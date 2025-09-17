import { beforeEach, describe, expect, it } from "vitest";
import {
  createArtist,
  deleteArtist,
  getArtistById,
  updateArtist,
} from "./Artist";
import {
  DEFAULT_TEST_USER_DATA,
  DEFAULT_TEST_ARTIST_DATA,
  DEFAULT_TEST_ALBUM_DATA,
  DEFAULT_TEST_TRACK_DATA,
} from "../../../test-helpers/dbData";
import User from "../models/User";
import mongoose from "mongoose";
import Artist from "../models/Artist";
import Track from "../models/Track";
import Album from "../models/Album";
import { EditableArtist, IArtist } from "@common/types/src/types";

beforeEach(async () => {
  await User.deleteMany({});
  await Artist.deleteMany({});
  await Track.deleteMany({});
  await Album.deleteMany({});
});

describe("Create Artist", () => {
  it("should create an artist successfully", async () => {
    const user = new User(DEFAULT_TEST_USER_DATA);
    await user.save();
    const artistData = {
      ...DEFAULT_TEST_ARTIST_DATA,
      managingUserId: user.id.toString(),
    } as IArtist;

    const createdArtist = await createArtist(user.id.toString(), artistData);
    expect(createdArtist).toHaveProperty("_id");
    expect(createdArtist.name).toBe(artistData.name);
  });

  it("should throw an error if managing user does not exist", async () => {
    const fakeUserId = new mongoose.Types.ObjectId().toString();
    const artistData = {
      ...DEFAULT_TEST_ARTIST_DATA,
      managingUserId: fakeUserId,
    } as IArtist;

    await expect(createArtist(fakeUserId, artistData)).rejects.toThrow();
  });

  it("Should throw an error if the artist name is not unique", async () => {
    const user = new User(DEFAULT_TEST_USER_DATA);
    await user.save();

    const artistData = {
      ...DEFAULT_TEST_ARTIST_DATA,
      managingUserId: user.id.toString(),
    } as IArtist;

    await createArtist(user.id.toString(), artistData);
    await expect(
      createArtist(user.id.toString(), artistData),
    ).rejects.toThrow();
  });
});

describe("Get Artist", () => {
  it("Fetches an artist by ID", async () => {
    const user = new User(DEFAULT_TEST_USER_DATA);
    await user.save();

    const artist = new Artist({
      ...DEFAULT_TEST_ARTIST_DATA,
      managingUserId: user.id.toString(),
    });
    await artist.save();

    const fetchedArtist = await getArtistById(artist.id.toString());
    expect(fetchedArtist).toBeDefined();
    expect(fetchedArtist?._id).toEqual(artist._id);
  });

  it("Returns null if artist does not exist", async () => {
    const fakeArtistId = new mongoose.Types.ObjectId().toString();
    const fetchedArtist = await getArtistById(fakeArtistId);
    expect(fetchedArtist).toBeNull();
  });
});

describe("Update Artist", () => {
  it("Updates an artist's details", async () => {
    const user = new User(DEFAULT_TEST_USER_DATA);
    await user.save();
    const artistData = {
      ...DEFAULT_TEST_ARTIST_DATA,
      managingUserId: user.id.toString(),
    };
    const artist = new Artist(artistData);
    await artist.save();
    const updateData: EditableArtist = {
      name: "Test Artist Update",
      links: {
        instagram: "https://instagram.com/testartist",
      },
    };
    const updatedArtist = await updateArtist(artist.id.toString(), updateData);
    expect(updatedArtist).toHaveProperty("_id", artist._id);
    expect(updatedArtist?.name).toBe(updateData.name);
    expect(updatedArtist?.links).toEqual(updateData.links);
    const updateData2: EditableArtist = {
      name: "Test Artist Update",
      links: {},
    };
    const updatedArtist2 = await updateArtist(
      artist.id.toString(),
      updateData2,
    );
    expect(updatedArtist2?.links).toEqual({});
  });

  it("Throws an error if artist does not exist", async () => {
    const fakeArtistId = new mongoose.Types.ObjectId().toString();
    const updateData: EditableArtist = {
      name: "Non-existent Artist",
    };
    await expect(updateArtist(fakeArtistId, updateData)).rejects.toThrow();
  });
});

describe("Delete Artist", () => {
  it("Deletes an artist by ID", async () => {
    const user = new User(DEFAULT_TEST_USER_DATA);
    await user.save();

    const artist = new Artist({
      ...DEFAULT_TEST_ARTIST_DATA,
      managingUserId: user.id.toString(),
    });
    await artist.save();

    const deletedArtist = await deleteArtist(user.id, artist.id.toString());
    expect(deletedArtist).toBe(true);
    expect(await Artist.findById(artist.id.toString())).toBeNull();
  });

  it("Also deletes associated albums and tracks, and removes artist from users' favorites", async () => {
    const user = new User({
      ...DEFAULT_TEST_USER_DATA,
      favoriteArtists: [],
      favoriteAlbums: [],
      favoriteTracks: [],
    });
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

    // Add artist to user's favorites
    user.favoriteArtists.push(artist.id.toString());
    await user.save();

    const deletedArtist = await deleteArtist(user.id, artist.id.toString());
    expect(deletedArtist).toBe(true);
    expect(await Artist.findById(artist.id.toString())).toBeNull();
    expect(await Album.findById(album.id.toString())).toBeNull();
    expect(await Track.findById(track.id.toString())).toBeNull();
    // Verify artist is removed from user's favorites
    const updatedUser = await User.findById(user.id.toString());
    expect(updatedUser?.favoriteArtists).not.toContain(artist.id.toString());
  });

  it("Throws an error if artist does not exist", async () => {
    const user = new User({
      ...DEFAULT_TEST_USER_DATA,
    });
    await user.save();
    const fakeArtistId = new mongoose.Types.ObjectId().toString();
    await expect(deleteArtist(user.id, fakeArtistId)).rejects.toThrow();
  });
});
