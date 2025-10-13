import { beforeEach, describe, expect, it } from "vitest";
import {
  createArtist,
  deleteArtist,
  getAllArtists,
  getArtistById,
  getArtistsByIds,
  getRandomArtists,
  getSimilarArtists,
  updateArtist,
} from "./Artist";
import {
  DEFAULT_TEST_USER_DATA,
  DEFAULT_TEST_ARTIST_DATA,
  DEFAULT_TEST_ALBUM_DATA,
  DEFAULT_TEST_TRACK_DATA,
  usersDocumentData,
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

  it("should create an artist with links successfully", async () => {
    const user = new User(DEFAULT_TEST_USER_DATA);
    await user.save();
    const artistData = {
      ...DEFAULT_TEST_ARTIST_DATA,
      managingUserId: user.id.toString(),
      links: {
        soundcloud: "https://soundcloud.com/testartist",
      },
    } as IArtist;

    const createdArtist = await createArtist(user.id.toString(), artistData);
    expect(createdArtist).toHaveProperty("_id");
    expect(createdArtist.name).toBe(artistData.name);
    expect(createdArtist.links).toEqual(artistData.links);
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

describe("Get All Artists", () => {
  it("Fetches all artists", async () => {
    const users = await User.insertMany(usersDocumentData);
    for (const user in users) {
      await new Artist({
        name: `${users[user]?.username}-artist`,
        biography: "A user bio",
        genre: "foo bar",
        managingUserId: users[user]?.id,
      }).save();
    }
    const artists = await getAllArtists();
    expect(artists.length).toBe(users.length);
  });

  it("Returns an empty array if no artists exist", async () => {
    const artists = await getAllArtists();
    expect(artists).toEqual([]);
  });
});

describe("Get Artist by ID", () => {
  it("Fetches an artist by ID", async () => {
    const user = new User(DEFAULT_TEST_USER_DATA);
    await user.save();
    const data = {
      ...DEFAULT_TEST_ARTIST_DATA,
      managingUserId: user.id.toString(),
      links: { soundcloud: "https://soundcloud.com/testartist" },
    };
    const artist = new Artist(data);
    await artist.save();

    const fetchedArtist = await getArtistById(artist.id.toString());
    expect(fetchedArtist).toBeDefined();
    expect(fetchedArtist?._id).toEqual(artist._id);
    expect(fetchedArtist?.links).toEqual(data.links);
  });

  it("Returns null if artist does not exist", async () => {
    const fakeArtistId = new mongoose.Types.ObjectId().toString();
    const fetchedArtist = await getArtistById(fakeArtistId);
    expect(fetchedArtist).toBeNull();
  });
});

describe("Get Artists by IDs", () => {
  it("Fetches multiple artists by their IDs", async () => {
    const users = await User.insertMany(usersDocumentData.slice(0, 3));
    const artistIds = [];
    for (const user in users) {
      const artist = new Artist({
        name: `${users[user]?.username}-artist`,
        biography: "A user bio",
        genre: "foo bar",
        managingUserId: users[user]?.id,
      });
      await artist.save();
      artistIds.push(artist.id.toString());
    }
    const artists = await getArtistsByIds(artistIds);
    expect(artists.length).toBe(users.length);
  });

  it("Returns an empty array if no matching artists are found", async () => {
    const fakeArtistIds = [
      new mongoose.Types.ObjectId().toString(),
      new mongoose.Types.ObjectId().toString(),
    ];
    const fetchedArtists = await Artist.find({ _id: { $in: fakeArtistIds } });
    expect(fetchedArtists).toEqual([]);
  });
});

describe("Get random artists", () => {
  it("Returns a random sampling of artists", async () => {
    const users = await User.insertMany(usersDocumentData);
    for (const user in users) {
      await new Artist({
        name: `${users[user]?.username}-artist`,
        biography: "A user bio",
        genre: "foo bar",
        managingUserId: users[user]?._id,
      }).save();
    }
    const result = await getRandomArtists(5);
    expect(result).toHaveLength(5);
    expect(result[0]).toHaveProperty("name");
    expect(result[1]).toHaveProperty("name");
    expect(result[2]).toHaveProperty("name");
    expect(result[3]).toHaveProperty("name");
    expect(result[4]).toHaveProperty("name");
  });

  it("Returns an empty array if no artists exist", async () => {
    const result = await getRandomArtists(5);
    expect(result).toEqual([]);
  });
});

describe("getRandomArtists", () => {
  it("Returns a random sampling of artists", async () => {
    const users = await User.insertMany(usersDocumentData);
    for (const user in users) {
      await new Artist({
        name: `${users[user]?.username}-artist`,
        biography: "A user bio",
        genre: "foo bar",
        managingUserId: users[user]?._id,
      }).save();
    }
    const result = await getRandomArtists(3);
    expect(result).toHaveLength(3);
  });

  it("Returns a random sampling of artists, except for those excluded", async () => {
    const users = await User.insertMany(usersDocumentData.slice(0, 2));
    const artists = [];
    for (const user in users) {
      const artist = await new Artist({
        name: `${users[user]?.username}-artist`,
        biography: "A user bio",
        genre: "foo bar",
        managingUserId: users[user]?._id,
      }).save();
      artists.push(artist);
    }
    const result = await getRandomArtists(3, [artists[0]?.id?.toString()]);
    expect(result).toHaveLength(2);
  });
});

describe("Get similar artists", () => {
  it("Returns artists with the same genre", async () => {
    const user = new User(DEFAULT_TEST_USER_DATA);
    await user.save();
    const artistData1 = {
      ...DEFAULT_TEST_ARTIST_DATA,
      name: "Artist One",
      genre: "Rock",
      managingUserId: user.id.toString(),
    } as IArtist;
    const artistData2 = {
      ...DEFAULT_TEST_ARTIST_DATA,
      name: "Artist Two",
      genre: "Rock",
      managingUserId: user.id.toString(),
    } as IArtist;
    const artistData3 = {
      ...DEFAULT_TEST_ARTIST_DATA,
      name: "Artist Three",
      genre: "Jazz",
      managingUserId: user.id.toString(),
    } as IArtist;

    const artist1 = new Artist(artistData1);
    const artist2 = new Artist(artistData2);
    const artist3 = new Artist(artistData3);
    await artist1.save();
    await artist2.save();
    await artist3.save();

    const fetchedArtist = await getArtistById(artist1.id.toString());
    expect(fetchedArtist).toBeDefined();
    expect(fetchedArtist?._id).toEqual(artist1._id);

    const similarArtists = await getSimilarArtists(artist1.id.toString(), 2);
    expect(similarArtists).toHaveLength(1);
    expect(similarArtists[0].name).toBe(artist2.name);
  });

  it("Throws an error if artist does not exist", async () => {
    const fakeArtistId = new mongoose.Types.ObjectId().toString();
    await expect(getSimilarArtists(fakeArtistId, 2)).rejects.toThrow();
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
    const updatedArtist = await updateArtist(
      user.id.toString(),
      artist.id.toString(),
      updateData,
    );
    expect(updatedArtist).toHaveProperty("_id", artist._id);
    expect(updatedArtist?.name).toBe(updateData.name);
    expect(updatedArtist?.links).toEqual(updateData.links);
    const updateData2: EditableArtist = {
      name: "Test Artist Update",
      links: {},
    };
    const updatedArtist2 = await updateArtist(
      user.id.toString(),
      artist.id.toString(),
      updateData2,
    );
    expect(updatedArtist2?.links).toEqual({});
  });
  it("Throws an error if the user is not authorized to update the artist", async () => {
    const user1 = new User(DEFAULT_TEST_USER_DATA);
    await user1.save();
    const user2 = new User({
      ...DEFAULT_TEST_USER_DATA,
      username: "differentuser",
      email: "differentuser@example.com",
    });
    await user2.save();
    const artistData = {
      ...DEFAULT_TEST_ARTIST_DATA,
      managingUserId: user1.id.toString(),
    };
    const artist = new Artist(artistData);
    await artist.save();
    const updateData: EditableArtist = {
      name: "Unauthorized Update Attempt",
    };
    await expect(
      updateArtist(user2.id.toString(), artist.id.toString(), updateData),
    ).rejects.toThrow();
  });

  it("Throws an error if artist does not exist", async () => {
    const user = new User(DEFAULT_TEST_USER_DATA);
    await user.save();
    const fakeArtistId = new mongoose.Types.ObjectId().toString();
    const updateData: EditableArtist = {
      name: "Non-existent Artist",
    };
    await expect(
      updateArtist(user.id.toString(), fakeArtistId, updateData),
    ).rejects.toThrow();
  });

  it("Throws an error if user is not authorized to update the artist", async () => {
    const user1 = new User(DEFAULT_TEST_USER_DATA);
    await user1.save();
    const user2 = new User({
      ...DEFAULT_TEST_USER_DATA,
      username: "differentuser",
      email: "differentuser@example.com",
    });
    await user2.save();
    const artistData = {
      ...DEFAULT_TEST_ARTIST_DATA,
      managingUserId: user1.id.toString(),
    };
    const artist = new Artist(artistData);
    await artist.save();
    const updateData: EditableArtist = {
      name: "Unauthorized Update Attempt",
    };
    await expect(
      updateArtist(user2.id.toString(), artist.id.toString(), updateData),
    ).rejects.toThrow();
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
