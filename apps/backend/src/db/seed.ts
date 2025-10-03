// This file is responsible for creating initial seed data in the database for the purpose of development.
// It should not be used in production environments.
import Chance from "chance";
import User from "./models/User";
import Artist from "./models/Artist";
import Track from "./models/Track";
const chance = new Chance();
const userCount = 10;

export const seedDatabase = async () => {
  const usersData = [];
  for (let i = 0; i < userCount; i++) {
    const user = new User({
      username: chance.word(),
      email: chance.email(),
      password: "testpassword",
    });
    usersData.push(user);
  }
  const users = await User.insertMany(usersData);

  const artistsData = [];
  for (const user of users) {
    const artist = new Artist({
      name: chance.name(),
      genre: chance.word(),
      managingUserId: user._id,
      biography: chance.paragraph(),
      links: {
        facebook: "https://facebook.com/" + chance.string({ length: 10 }),
        twitter: "https://twitter.com/" + chance.string({ length: 10 }),
        instagram: "https://instagram.com/" + chance.string({ length: 10 }),
      },
    });
    artistsData.push(artist);
  }
  const artists = await Artist.insertMany(artistsData);

  const tracksData = [];
  for (const artist of artists) {
    const track = new Track({
      title: chance.sentence({ words: 3 }),
      duration: chance.integer({ min: 60, max: 300 }),
      artistId: artist._id,
      managingUserId: artist.managingUserId,
      genre: "Pop",
      links: {
        spotify:
          "https://open.spotify.com/track/" + chance.string({ length: 10 }),
        appleMusic:
          "https://music.apple.com/us/album/" + chance.string({ length: 10 }),
        soundcloud: "https://soundcloud.com/" + chance.string({ length: 10 }),
      },
    });
    tracksData.push(track);
  }
  await Track.insertMany(tracksData);

  console.log("Database seeded with initial data");
};
