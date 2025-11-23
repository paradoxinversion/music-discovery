import { beforeAll, beforeEach, describe, expect, it } from "vitest";
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
import {
  createTrack,
  getTrackById,
  updateTrack,
  deleteTrack,
  getAllTracks,
  getRandomTracks,
  getTracksByGenre,
  getTracksByArtistId,
  getTrackBySlugAndArtist,
} from "./Track";
import { emptyBucket } from "../../cloud/storage";
import { Readable } from "stream";

export function makeTestMulterFile(
  opts: Partial<Express.Multer.File> = {},
): Express.Multer.File {
  const buffer = Buffer.isBuffer(opts.buffer)
    ? (opts.buffer as Buffer)
    : Buffer.from(String(opts.buffer ?? "fake-image-data"));
  return {
    fieldname: opts.fieldname ?? "trackArt",
    originalname: opts.originalname ?? "track-art.jpg",
    encoding: opts.encoding ?? "7bit",
    mimetype: opts.mimetype ?? "image/jpeg",
    size: opts.size ?? buffer.length,
    destination: opts.destination ?? "",
    filename: opts.filename ?? "track-art.jpg",
    path: opts.path ?? "",
    buffer,
    stream: opts.stream ?? Readable.from(buffer),
  } as Express.Multer.File;
}

beforeEach(async () => {
  await User.deleteMany({});
  await Artist.deleteMany({});
  await Album.deleteMany({});
  await Track.deleteMany({});
  await emptyBucket();
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
    const art = makeTestMulterFile();
    const createdTrack = await createTrack(user, trackData, art);
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
    const createdTrack = await createTrack(user.id.toString(), trackData);
    expect(createdTrack).toBeDefined();

    // Attempt to create the same track again
    await expect(createTrack(user.id.toString(), trackData)).rejects.toThrow();
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

    const fetchedTrack = await getTrackById(track.id.toString());
    expect(fetchedTrack).toBeDefined();
  });

  it("Returns null for non-existent track ID", async () => {
    const nonExistentId = new mongoose.Types.ObjectId().toString();
    const fetchedTrack = await getTrackById(nonExistentId);
    expect(fetchedTrack).toBeNull();
  });
});

describe("Get Track By Slug and Artist", () => {
  it("Retrieves a track by its slug and artist slug", async () => {
    const user = new User(DEFAULT_TEST_USER_DATA);
    await user.save();
    const artist = new Artist({
      ...DEFAULT_TEST_ARTIST_DATA,
      managingUserId: user.id.toString(),
    });
    await artist.save();

    const track = new Track({
      ...DEFAULT_TEST_TRACK_DATA,
      artistId: artist.id.toString(),
      managingUserId: user.id.toString(),
    });
    await track.save();

    const fetchedTrack = await getTrackBySlugAndArtist(track.slug, artist.slug);
    expect(fetchedTrack).toBeDefined();
    expect(fetchedTrack?.slug).toBe(track.slug);
    expect((fetchedTrack as ITrack).artistId.slug).toBe(artist.slug);
  });

  it("Returns null for non-existent track slug and artist slug", async () => {
    const fetchedTrack = await getTrackBySlugAndArtist(
      "non-existent-track-slug",
      "non-existent-artist-slug",
    );
    expect(fetchedTrack).toBeNull();
  });
});

describe("Get all tracks", () => {
  it("Retrieves all tracks", async () => {
    const user = new User(DEFAULT_TEST_USER_DATA);
    const user2 = new User({
      ...DEFAULT_TEST_USER_DATA,
      email: "user2@example.com",
      username: "user2",
    });
    await user2.save();
    const artist = new Artist({
      ...DEFAULT_TEST_ARTIST_DATA,
      managingUserId: user.id.toString(),
    });
    await artist.save();
    const artist2 = new Artist({
      ...DEFAULT_TEST_ARTIST_DATA,
      name: "Artist 2",
      managingUserId: user2.id.toString(),
    });
    await artist2.save();

    const track = new Track({
      ...DEFAULT_TEST_TRACK_DATA,
      artistId: artist.id.toString(),
      managingUserId: user.id.toString(),
    });
    await track.save();

    const track2 = new Track({
      ...DEFAULT_TEST_TRACK_DATA,
      artistId: artist2.id.toString(),
      managingUserId: user2.id.toString(),
    });
    await track2.save();

    const tracks = await getAllTracks();
    expect(tracks.length).toBe(2);
  });
});

describe("Get Random Tracks", () => {
  it("Retrieves a specified number of random tracks", async () => {
    const user = new User(DEFAULT_TEST_USER_DATA);
    await user.save();
    const artist = new Artist({
      ...DEFAULT_TEST_ARTIST_DATA,
      managingUserId: user.id.toString(),
    });
    await artist.save();

    const tracksData = [
      {
        ...DEFAULT_TEST_TRACK_DATA,
        title: "Track 1",
        artistId: artist.id.toString(),
        managingUserId: user.id.toString(),
      },
      {
        ...DEFAULT_TEST_TRACK_DATA,
        title: "Track 2",
        artistId: artist.id.toString(),
        managingUserId: user.id.toString(),
      },
      {
        ...DEFAULT_TEST_TRACK_DATA,
        title: "Track 3",
        artistId: artist.id.toString(),
        managingUserId: user.id.toString(),
      },
    ];
    await Track.insertMany(tracksData);

    const randomTracks = await getRandomTracks(2);
    expect(randomTracks.length).toBe(2);
  });
});

describe("Get Tracks By Genre", () => {
  it("Retrieves tracks filtered by genre", async () => {
    const user = new User(DEFAULT_TEST_USER_DATA);
    await user.save();
    const artist = new Artist({
      ...DEFAULT_TEST_ARTIST_DATA,
      managingUserId: user.id.toString(),
    });
    await artist.save();

    const tracksData = [
      {
        ...DEFAULT_TEST_TRACK_DATA,
        title: "Rock Track 1",
        genre: "Rock",
        artistId: artist.id.toString(),
        managingUserId: user.id.toString(),
      },
      {
        ...DEFAULT_TEST_TRACK_DATA,
        title: "Pop Track 1",
        genre: "Pop",
        artistId: artist.id.toString(),
        managingUserId: user.id.toString(),
      },
      {
        ...DEFAULT_TEST_TRACK_DATA,
        title: "Rock Track 2",
        genre: "Rock",
        artistId: artist.id.toString(),
        managingUserId: user.id.toString(),
      },
    ];
    await Track.insertMany(tracksData);

    const rockTracks = getTracksByGenre("Rock", 2);
    expect((await rockTracks).length).toBe(2);
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
    const trackArt = makeTestMulterFile({ originalname: "new-track-art.jpg" });
    const updatedTrack = await updateTrack(
      user.id.toString(),
      track.id.toString(),
      {
        title: newTitle,
      },
      trackArt,
    );
    expect(updatedTrack).toBeDefined();
    expect(updatedTrack.title).toBe(newTitle);
    expect(updatedTrack.genre).toBe(track.genre); // unchanged
    expect(updatedTrack.trackArt).toBeDefined();
  });
  it("Throws error when using an invalid user", async () => {
    const nonExistentId = new mongoose.Types.ObjectId().toString();
    await expect(
      updateTrack(nonExistentId, nonExistentId, { title: "New Title" }),
    ).rejects.toThrow();
  });
});
it("Throws error when updating non-existent track", async () => {
  const user = new User(DEFAULT_TEST_USER_DATA);
  await user.save();
  const nonExistentId = new mongoose.Types.ObjectId().toString();
  await expect(
    updateTrack(user.id.toString(), nonExistentId, { title: "New Title" }),
  ).rejects.toThrow();
});

describe("Get Tracks By Artist ID", () => {
  it("Retrieves tracks filtered by artist ID", async () => {
    const user = new User(DEFAULT_TEST_USER_DATA);
    await user.save();
    const artist = new Artist({
      ...DEFAULT_TEST_ARTIST_DATA,
      managingUserId: user.id.toString(),
    });
    await artist.save();

    const tracksData = [
      {
        ...DEFAULT_TEST_TRACK_DATA,
        title: "Track 1",
        artistId: artist.id.toString(),
        managingUserId: user.id.toString(),
      },
      {
        ...DEFAULT_TEST_TRACK_DATA,
        title: "Track 2",
        artistId: artist.id.toString(),
        managingUserId: user.id.toString(),
      },
    ];
    await Track.insertMany(tracksData);

    const artistTracks = getTracksByArtistId(artist.id.toString());
    expect((await artistTracks).length).toBe(2);
    artistTracks.then((tracks) =>
      tracks.forEach((track) =>
        expect(track.artistId.toString()).toBe(artist.id.toString()),
      ),
    );
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

    const deletionResult = await deleteTrack(
      user.id.toString(),
      track._id.toString(),
    );
    expect(deletionResult).toBe(true);

    const fetchedTrack = await getTrackById(track._id.toString());
    expect(fetchedTrack).toBeNull();
  });

  it("Throws error when deleting non-existent track", async () => {
    const user = new User(DEFAULT_TEST_USER_DATA);
    await user.save();
    const nonExistentId = new mongoose.Types.ObjectId().toString();
    await expect(
      deleteTrack(user.id.toString(), nonExistentId),
    ).rejects.toThrow();
  });
});
