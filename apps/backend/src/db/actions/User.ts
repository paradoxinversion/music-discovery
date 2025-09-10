import { IUserSignup } from "@common/types/src/types";
import User from "../models/User";
import Artist from "../models/Artist";

/**
 * Create a new user in the database. Duplicate usernames or emails will throw an error.
 * @param user - User signup information
 * @returns The created user document
 * @throws Error if username or email is already in use
 */
export const createUser = async (user: IUserSignup) => {
  const newUser = new User({
    username: user.username,
    email: user.email,
    password: user.password,
  });
  await newUser.save();
  return newUser;
};

/**
 * Add a favorite artist to a user's profile.
 * @param userId - The ID of the user
 * @param artistId - The ID of the artist
 * @returns The updated user document
 * @throws Error if user or artist is not found, or if the artist is already in the user's favorites
 */
export const addFavoriteArtist = async (userId: string, artistId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error(`User with ID ${userId} not found`);
  }

  const artist = await Artist.findById(artistId);
  if (!artist) {
    throw new Error(`Artist with ID ${artistId} not found`);
  }

  if (user.favoriteArtists.includes(artistId)) {
    throw new Error(`Artist with ID ${artistId} is already in user's favorite list`);
  }
  user.favoriteArtists.push(artistId);
  await user.save();
  return user;
};

/**
 * Remove a favorite artist from a user's profile.
 * @param userId - The ID of the user
 * @param artistId - The ID of the artist
 * @returns The updated user document
 * @throws Error if user or artist is not found, or if the artist is not in the user's favorites
 */
export const removeFavoriteArtist = async (userId: string, artistId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error(`User with ID ${userId} not found`);
  }
  const artist = await Artist.findById(artistId);
  if (!artist) {
    throw new Error(`Artist with ID ${artistId} not found`);
  }

  if (!user.favoriteArtists.includes(artistId)) {
    throw new Error(`Artist with ID ${artistId} is not in user's favorite list`);
  }

  user.favoriteArtists = user.favoriteArtists.filter(fav => fav.toString() !== artist._id.toString());

  await user.save();
  return user;
};