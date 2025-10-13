import { beforeEach, describe, expect, it } from "vitest";
import User from "../models/User";
import mongoose from "mongoose";
import {
  addFavoriteArtist,
  createUser,
  getUserById,
  removeFavoriteArtist,
  deleteUser,
  addFavoriteAlbum,
  removeFavoriteAlbum,
  addFavoriteTrack,
  removeFavoriteTrack,
  getManagedArtists,
  updateUser,
} from "./User";
import Artist from "../models/Artist";
import {
  DEFAULT_TEST_ALBUM_DATA,
  DEFAULT_TEST_ARTIST_DATA,
  DEFAULT_TEST_TRACK_DATA,
  DEFAULT_TEST_USER_DATA,
  DEFAULT_TEST_USER_SIGNUP,
} from "../../../test-helpers/dbData";
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

    await expect(
      createUser({ ...DEFAULT_TEST_USER_SIGNUP, username: "notthesame" }),
    ).rejects.toThrow(/duplicate key error/);
  });
});

describe("Get User By ID", () => {
  it("Retrieves a user by ID", async () => {
    const createdUser = await createUser(DEFAULT_TEST_USER_SIGNUP);
    expect(createdUser).toBeDefined();
    const fetchedUser = await getUserById(createdUser.id.toString());
    expect(fetchedUser).toBeDefined();
    expect(fetchedUser?.id.toString()).toBe(createdUser.id.toString());
  });

  it("Returns null if user does not exist", async () => {
    const fakeUserId = new mongoose.Types.ObjectId().toString();
    const fetchedUser = await getUserById(fakeUserId);
    expect(fetchedUser).toBeNull();
  });
});
describe("Get Managed Artists", () => {
  it("Retrieves managed artists for a user", async () => {
    const user = new User(DEFAULT_TEST_USER_DATA);
    await user.save();
    const artist1 = new Artist({
      name: "The Crescendolls",
      genre: "Electronic",
      biography: "An extraterrestrial band known for their catchy tunes.",
      managingUserId: user.id.toString(),
    });
    const artist2 = new Artist({
      name: "The Electros",
      genre: "Rock",
      biography: "A rock band with an electrifying stage presence.",
      managingUserId: user.id.toString(),
    });
    await artist1.save();
    await artist2.save();

    const artists = await getManagedArtists(user.id.toString());
    expect(artists.length).toBe(2);
    const artistNames = artists.map((a) => a.name);
    expect(artistNames).toContain("The Crescendolls");
    expect(artistNames).toContain("The Electros");
  });

  it("Returns empty array if user manages no artists", async () => {
    const user = new User(DEFAULT_TEST_USER_DATA);
    await user.save();
    const artists = await getManagedArtists(user.id.toString());
    expect(artists.length).toBe(0);
  });
});
describe("Add favorite artist", () => {
  it("Adds a favorite artist to user", async () => {
    const user = new User(DEFAULT_TEST_USER_DATA);
    await user.save();
    const artist = new Artist({
      name: "The Crescendolls",
      genre: "Electronic",
      biography: "An extraterrestrial band known for their catchy tunes.",
      managingUserId: user.id.toString(),
    });
    await artist.save();
    await addFavoriteArtist(user.id.toString(), artist.id.toString());
    const updatedUser = await User.findById(user.id);
    expect(updatedUser).toBeDefined();
    expect(updatedUser?.favoriteArtists.length).toBe(1);
    expect(updatedUser?.favoriteArtists[0]?.toString()).toBe(
      artist._id.toString(),
    );
  });

  it("Throws an error if the user already has the artist as favorite", async () => {
    const user = new User(DEFAULT_TEST_USER_DATA);
    await user.save();
    const artist = new Artist({
      name: "The Crescendolls",
      genre: "Electronic",
      biography: "An extraterrestrial band known for their catchy tunes.",
      managingUserId: user.id.toString(),
    });
    await artist.save();
    await addFavoriteArtist(user.id.toString(), artist.id.toString());
    await expect(
      addFavoriteArtist(user.id.toString(), artist.id.toString()),
    ).rejects.toThrow();
  });

  it("Throws an error if the user does not exist", async () => {
    const fakeUserId = new mongoose.Types.ObjectId().toString();
    const artist = new Artist({
      name: "The Crescendolls",
      genre: "Electronic",
      biography: "An extraterrestrial band known for their catchy tunes.",
      managingUserId: fakeUserId,
    });
    await artist.save();
    await expect(
      addFavoriteArtist(fakeUserId, artist._id.toString()),
    ).rejects.toThrow();
  });

  it("Throws an error if the artist does not exist", async () => {
    const user = new User(DEFAULT_TEST_USER_DATA);
    await user.save();
    const fakeArtistId = new mongoose.Types.ObjectId().toString();
    await expect(
      addFavoriteArtist(user.id.toString(), fakeArtistId),
    ).rejects.toThrow();
  });
});

describe("Remove favorite artist", () => {
  it("Removes a favorite artist from user", async () => {
    const user = new User(DEFAULT_TEST_USER_DATA);
    await user.save();
    const artist = new Artist({
      name: "The Crescendolls",
      genre: "Electronic",
      biography: "An extraterrestrial band known for their catchy tunes.",
      managingUserId: user.id.toString(),
    });
    await artist.save();

    await User.updateOne(
      { _id: user.id },
      { $push: { favoriteArtists: artist._id.toString() } },
    );
    await user.save();
    const updatedUser = await User.findById(user._id);
    expect(updatedUser).toBeDefined();
    expect(updatedUser?.favoriteArtists.length).toBe(1);
    expect(updatedUser?.favoriteArtists[0]?.toString()).toBe(
      artist._id.toString(),
    );

    // Now remove the artist
    await removeFavoriteArtist(user.id.toString(), artist._id.toString());
    const userAfterRemoval = await User.findById(user._id);
    expect(userAfterRemoval).toBeDefined();
    expect(userAfterRemoval?.favoriteArtists.length).toBe(0);
  });

  it("Throws an error if the user does not have the artist as favorite", async () => {
    const user = new User(DEFAULT_TEST_USER_DATA);
    await user.save();
    const artist = new Artist({
      name: "The Crescendolls",
      genre: "Electronic",
      biography: "An extraterrestrial band known for their catchy tunes.",
      managingUserId: user.id.toString(),
    });
    await artist.save();
    await expect(
      removeFavoriteArtist(user.id.toString(), artist._id.toString()),
    ).rejects.toThrow();
  });

  it("Throws an error if the user does not exist", async () => {
    const fakeUserId = new mongoose.Types.ObjectId().toString();
    const artist = new Artist({
      name: "The Crescendolls",
      genre: "Electronic",
      biography: "An extraterrestrial band known for their catchy tunes.",
      managingUserId: fakeUserId,
    });
    await artist.save();
    await expect(
      removeFavoriteArtist(fakeUserId, artist._id.toString()),
    ).rejects.toThrow();
  });

  it("Throws an error if the artist does not exist", async () => {
    const user = new User(DEFAULT_TEST_USER_DATA);
    await user.save();
    const fakeArtistId = new mongoose.Types.ObjectId().toString();
    await expect(
      removeFavoriteArtist(user.id.toString(), fakeArtistId),
    ).rejects.toThrow();
  });
});

describe("Add favorite Album", () => {
  it("Adds a favorite album to user", async () => {
    const user = new User(DEFAULT_TEST_USER_DATA);
    await user.save();
    const artist = new Artist({
      ...DEFAULT_TEST_ARTIST_DATA,
      managingUserId: user.id.toString(),
    });
    const album = new Album({
      ...DEFAULT_TEST_ALBUM_DATA,
      artistId: artist.id.toString(),
      managingUserId: user.id.toString(),
    });
    await artist.save();
    await album.save();
    await addFavoriteAlbum(user.id.toString(), album.id.toString());
    const updatedUser = await User.findById(user.id);
    expect(updatedUser).toBeDefined();
    expect(updatedUser?.favoriteAlbums.length).toBe(1);
    expect(updatedUser?.favoriteAlbums[0]?.toString()).toBe(
      album.id.toString(),
    );
  });
  it("Throws an error if the user already has the album as favorite", async () => {
    const user = new User(DEFAULT_TEST_USER_DATA);
    await user.save();
    const artist = new Artist({
      ...DEFAULT_TEST_ARTIST_DATA,
      managingUserId: user.id.toString(),
    });
    const album = new Album({
      ...DEFAULT_TEST_ALBUM_DATA,
      artistId: artist.id.toString(),
      managingUserId: user.id.toString(),
    });
    await artist.save();
    await album.save();
    await addFavoriteAlbum(user.id.toString(), album.id.toString());
    await expect(
      addFavoriteAlbum(user.id.toString(), album.id.toString()),
    ).rejects.toThrow();
  });

  it("Throws an error if the user does not exist", async () => {
    const fakeUserId = new mongoose.Types.ObjectId().toString();
    const artist = new Artist({
      ...DEFAULT_TEST_ARTIST_DATA,
      managingUserId: fakeUserId,
    });
    const album = new Album({
      ...DEFAULT_TEST_ALBUM_DATA,
      artistId: artist.id.toString(),
      managingUserId: fakeUserId,
    });
    await artist.save();
    await album.save();
    await expect(
      addFavoriteAlbum(fakeUserId, album.id.toString()),
    ).rejects.toThrow();
  });

  it("Throws an error if the album does not exist", async () => {
    const user = new User(DEFAULT_TEST_USER_DATA);
    await user.save();
    const fakeAlbumId = new mongoose.Types.ObjectId().toString();
    await expect(
      addFavoriteAlbum(user.id.toString(), fakeAlbumId),
    ).rejects.toThrow();
  });
});

describe("Remove favorite Album", () => {
  it("Removes a favorite album from user", async () => {
    const user = new User(DEFAULT_TEST_USER_DATA);
    await user.save();
    const artist = new Artist({
      ...DEFAULT_TEST_ARTIST_DATA,
      managingUserId: user.id.toString(),
    });
    const album = new Album({
      ...DEFAULT_TEST_ALBUM_DATA,
      artistId: artist.id.toString(),
      managingUserId: user.id.toString(),
    });
    await artist.save();
    await album.save();
    await user.favoriteAlbums.push(album.id.toString());
    await user.save();
    await removeFavoriteAlbum(user.id.toString(), album.id.toString());
    const updatedUser = await User.findById(user.id);
    expect(updatedUser).toBeDefined();
    expect(updatedUser?.favoriteAlbums.length).toBe(0);
  });

  it("Throws an error if the user does not have the album as favorite", async () => {
    const user = new User(DEFAULT_TEST_USER_DATA);
    await user.save();
    const artist = new Artist({
      ...DEFAULT_TEST_ARTIST_DATA,
      managingUserId: user.id.toString(),
    });
    const album = new Album({
      ...DEFAULT_TEST_ALBUM_DATA,
      artistId: artist.id.toString(),
      managingUserId: user.id.toString(),
    });
    await artist.save();
    await album.save();
    await expect(
      removeFavoriteAlbum(user.id.toString(), album.id.toString()),
    ).rejects.toThrow();
  });

  it("Throws an error if the user does not exist", async () => {
    const fakeUserId = new mongoose.Types.ObjectId().toString();
    const artist = new Artist({
      ...DEFAULT_TEST_ARTIST_DATA,
      managingUserId: fakeUserId,
    });
    const album = new Album({
      ...DEFAULT_TEST_ALBUM_DATA,
      artistId: artist.id.toString(),
      managingUserId: fakeUserId,
    });
    await artist.save();
    await album.save();
    await expect(
      removeFavoriteAlbum(fakeUserId, album.id.toString()),
    ).rejects.toThrow();
  });

  it("Throws an error if the album does not exist", async () => {
    const user = new User(DEFAULT_TEST_USER_DATA);
    await user.save();
    const fakeAlbumId = new mongoose.Types.ObjectId().toString();
    await expect(
      removeFavoriteAlbum(user.id.toString(), fakeAlbumId),
    ).rejects.toThrow();
  });
});

describe("Add favorite Track", () => {
  it("Adds a favorite track to user", async () => {
    const user = new User(DEFAULT_TEST_USER_DATA);
    await user.save();
    const artist = new Artist({
      ...DEFAULT_TEST_ARTIST_DATA,
      managingUserId: user.id.toString(),
    });
    const album = new Album({
      ...DEFAULT_TEST_ALBUM_DATA,
      artistId: artist.id.toString(),
      managingUserId: user.id.toString(),
    });
    const track = new Track({
      ...DEFAULT_TEST_TRACK_DATA,
      artistId: artist.id.toString(),
      albumId: album.id.toString(),
      managingUserId: user.id.toString(),
    });
    await artist.save();
    await album.save();
    await track.save();
    await addFavoriteTrack(user.id.toString(), track.id.toString());
    const updatedUser = await User.findById(user.id);
    expect(updatedUser).toBeDefined();
    expect(updatedUser?.favoriteTracks.length).toBe(1);
    expect(updatedUser?.favoriteTracks[0]?.toString()).toBe(
      track._id.toString(),
    );
  });
  it("Throws an error if the user already has the track as favorite", async () => {
    const user = new User(DEFAULT_TEST_USER_DATA);
    await user.save();
    const artist = new Artist({
      ...DEFAULT_TEST_ARTIST_DATA,
      managingUserId: user.id.toString(),
    });
    const album = new Album({
      ...DEFAULT_TEST_ALBUM_DATA,
      artistId: artist.id.toString(),
      managingUserId: user.id.toString(),
    });
    const track = new Track({
      ...DEFAULT_TEST_TRACK_DATA,
      artistId: artist.id.toString(),
      albumId: album.id.toString(),
      managingUserId: user.id.toString(),
    });
    await artist.save();
    await album.save();
    await track.save();
    const first = await addFavoriteTrack(
      user.id.toString(),
      track.id.toString(),
    );
    expect(first).toHaveLength(1);
    const updated = await addFavoriteTrack(
      user.id.toString(),
      track.id.toString(),
    );
    expect(updated).toHaveLength(1);
  });

  it("Throws an error if the user does not exist", async () => {
    const fakeUserId = new mongoose.Types.ObjectId().toString();
    const artist = new Artist({
      ...DEFAULT_TEST_ARTIST_DATA,
      managingUserId: fakeUserId,
    });
    const album = new Album({
      ...DEFAULT_TEST_ALBUM_DATA,
      artistId: artist._id.toString(),
      managingUserId: fakeUserId,
    });
    const track = new Track({
      ...DEFAULT_TEST_TRACK_DATA,
      artistId: artist._id.toString(),
      albumId: album._id.toString(),
      managingUserId: fakeUserId,
    });
    await artist.save();
    await album.save();
    await track.save();
    await expect(
      addFavoriteTrack(fakeUserId, track._id.toString()),
    ).rejects.toThrow();
  });

  it("Throws an error if the track does not exist", async () => {
    const user = new User(DEFAULT_TEST_USER_DATA);
    await user.save();
    const fakeTrackId = new mongoose.Types.ObjectId().toString();
    await expect(
      addFavoriteTrack(user.id.toString(), fakeTrackId),
    ).rejects.toThrow();
  });
});

describe("Remove favorite Track", () => {
  it("Removes a favorite track from user", async () => {
    const user = new User(DEFAULT_TEST_USER_DATA);
    await user.save();
    const artist = new Artist({
      ...DEFAULT_TEST_ARTIST_DATA,
      managingUserId: user.id.toString(),
    });
    const album = new Album({
      ...DEFAULT_TEST_ALBUM_DATA,
      artistId: artist.id.toString(),
      managingUserId: user.id.toString(),
    });
    const track = new Track({
      ...DEFAULT_TEST_TRACK_DATA,
      artistId: artist.id.toString(),
      albumId: album.id.toString(),
      managingUserId: user.id.toString(),
    });
    await artist.save();
    await album.save();
    await track.save();
    await user.favoriteTracks.push(track.id.toString());
    await user.save();
    await removeFavoriteTrack(user.id.toString(), track.id.toString());
    const updatedUser = await User.findById(user.id);
    expect(updatedUser).toBeDefined();
    expect(updatedUser?.favoriteTracks.length).toBe(0);
  });

  it("Throws an error if the user does not have the track as favorite", async () => {
    const user = new User(DEFAULT_TEST_USER_DATA);
    await user.save();
    const artist = new Artist({
      ...DEFAULT_TEST_ARTIST_DATA,
      managingUserId: user.id.toString(),
    });
    const album = new Album({
      ...DEFAULT_TEST_ALBUM_DATA,
      artistId: artist.id.toString(),
      managingUserId: user.id.toString(),
    });
    const track = new Track({
      ...DEFAULT_TEST_TRACK_DATA,
      artistId: artist.id.toString(),
      albumId: album.id.toString(),
      managingUserId: user.id.toString(),
    });
    await artist.save();
    await album.save();
    await track.save();
    const updated = await removeFavoriteTrack(
      user.id.toString(),
      track.id.toString(),
    );
    await expect(updated).toHaveLength(0);
  });

  it("Throws an error if the user does not exist", async () => {
    const fakeUserId = new mongoose.Types.ObjectId().toString();
    const artist = new Artist({
      ...DEFAULT_TEST_ARTIST_DATA,
      managingUserId: fakeUserId,
    });
    const album = new Album({
      ...DEFAULT_TEST_ALBUM_DATA,
      artistId: artist.id.toString(),
      managingUserId: fakeUserId,
    });
    const track = new Track({
      ...DEFAULT_TEST_TRACK_DATA,
      artistId: artist.id.toString(),
      albumId: album.id.toString(),
      managingUserId: fakeUserId,
    });
    await artist.save();
    await album.save();
    await track.save();
    await expect(
      removeFavoriteTrack(fakeUserId, track._id.toString()),
    ).rejects.toThrow();
  });

  it("Throws an error if the track does not exist", async () => {
    const user = new User(DEFAULT_TEST_USER_DATA);
    await user.save();
    const fakeTrackId = new mongoose.Types.ObjectId().toString();
    const update = await removeFavoriteTrack(user.id.toString(), fakeTrackId);
    expect(update).toHaveLength(0);
  });
});

describe("Update User", () => {
  it("Updates user information", async () => {
    const user = new User(DEFAULT_TEST_USER_DATA);
    await user.save();
    const updatedData = { username: "newusername" };
    const update = await updateUser(user.id.toString(), updatedData);
    expect(update).toBeDefined();
    expect(update.username).toBe(updatedData.username);
    expect(update.email).toBe(DEFAULT_TEST_USER_DATA.email); // unchanged
  });

  it("Throws an error if the user does not exist", async () => {
    const fakeUserId = new mongoose.Types.ObjectId().toString();
    const updatedData = { username: "newusername" };
    await expect(updateUser(fakeUserId, updatedData)).rejects.toThrow(
      `User with ID ${fakeUserId} not found`,
    );
  });
});

describe("Delete User", () => {
  it("Deletes a user successfully", async () => {
    const user = new User(DEFAULT_TEST_USER_DATA);
    await user.save();
    const deletionResult = await deleteUser(user.id.toString());
    expect(deletionResult).toBe(true);
    const fetchedUser = await User.findById(user.id.toString());
    expect(fetchedUser).toBeNull();
  });

  it("Deletes a user and their managed artists along with associated albums and tracks", async () => {
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

    await Artist.updateOne(
      { _id: artist.id },
      { $push: { tracks: track.id.toString(), albums: album.id.toString() } },
    );

    const user2 = new User({
      ...DEFAULT_TEST_USER_DATA,
      username: "seconduser",
      email: "seconduser@example.com",
    });

    user2.favoriteArtists.push(artist._id.toString());
    user2.favoriteAlbums.push(album._id.toString());
    user2.favoriteTracks.push(track._id.toString());
    await user2.save();
    expect(user2.favoriteArtists).toHaveLength(1);
    expect(user2.favoriteAlbums).toHaveLength(1);
    expect(user2.favoriteTracks).toHaveLength(1);

    const deletionResult = await deleteUser(user.id.toString());
    expect(deletionResult).toBe(true);
    const fetchedUser = await User.findById(user.id.toString());
    expect(fetchedUser).toBeNull();

    const fetchedArtist = await Artist.findById(artist.id.toString());
    expect(fetchedArtist).toBeNull();

    const fetchedAlbum = await Album.findById(album.id.toString());
    expect(fetchedAlbum).toBeNull();

    const fetchedTrack = await Track.findById(track.id.toString());
    expect(fetchedTrack).toBeNull();
    const user2After = await User.findById(user2.id.toString());
    expect(user2After.favoriteArtists).toHaveLength(0);
    expect(user2After.favoriteAlbums).toHaveLength(0);
    expect(user2After.favoriteTracks).toHaveLength(0);
  });

  it("Throws an error when trying to delete a non-existent user", async () => {
    const nonExistentId = new mongoose.Types.ObjectId().toString();
    await expect(deleteUser(nonExistentId)).rejects.toThrow(
      `User with ID ${nonExistentId} not found`,
    );
  });
});
