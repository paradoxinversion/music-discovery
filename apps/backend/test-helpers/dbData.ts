import {
  IAlbum,
  IArtist,
  ITrack,
  IUser,
  IUserSignup,
} from "@common/types/src/types";

export const DEFAULT_TEST_USER_SIGNUP: IUserSignup = {
  username: "testuser",
  email: "testuser@example.com",
  password: "password123", // eslint-disable-line sonarjs/no-hardcoded-passwords
};

export const usersSignupData: IUserSignup[] = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
].map((value) => ({
  username: `testUser${value}`,
  email: `testuser${value}@example.com`,
  password: "password1234", // eslint-disable-line sonarjs/no-hardcoded-passwords
}));

export const usersDocumentData: IUser[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(
  (value) => ({
    username: `testuser${value}`,
    email: `testuse${value}r@example.com`,
    password: "password123", // eslint-disable-line sonarjs/no-hardcoded-passwords
    favoriteArtists: [],
    favoriteAlbums: [],
    favoriteTracks: [],
  }),
);

export const DEFAULT_TEST_USER_DATA: IUser = {
  username: "testuser",
  email: "testuser@example.com",
  password: "password123", // eslint-disable-line sonarjs/no-hardcoded-passwords
  favoriteArtists: [],
  favoriteAlbums: [],
  favoriteTracks: [],
};

export const DEFAULT_TEST_ARTIST_DATA: Partial<IArtist> = {
  name: "The Neptunes",
  genre: "Ska",
  biography: "This is a test artist.",
};

export const DEFAULT_TEST_ALBUM_DATA: Partial<IAlbum> = {
  title: "Test Album",
  releaseDate: new Date("2023-01-01"),
  genre: "Ska",
};

export const DEFAULT_TEST_TRACK_DATA: Partial<ITrack> = {
  title: "Test Track",
  duration: 240, // in seconds
  genre: "Ska",
  links: {
    spotify: "https://open.spotify.com/track/testtrackid",
    youtube: "https://www.youtube.com/watch?v=testtrackid",
  },
};
