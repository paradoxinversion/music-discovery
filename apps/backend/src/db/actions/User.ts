import { IUser, IUserSignup } from "@common/types/src/types";
import User from "../models/User";
import Artist from "../models/Artist";
import Track from "../models/Track";
import Album from "../models/Album";

/**
 * Create a new user in the database. Duplicate usernames or emails will throw an error.
 * @param user - User signup information
 * @returns The created user document
 * @throws Error if username or email is already in use
 */
export const createUser = async (user: IUserSignup) => {
  try {
    const newUser = new User({
      username: user.username,
      email: user.email,
      password: user.password,
    });
    await newUser.save();
    return newUser;
  } catch (error) {
    throw new Error(`Error creating user: ${error}`);
  }
};

/**
 * Retrieve a user by their ID.
 * @param userId - The ID of the user to retrieve
 * @returns The user document or null if not found
 */
export const getUserById = async (userId: string) => {
  try {
    const user = await User.findById(userId);
    return user;
  } catch (error) {
    throw new Error(`Error retrieving user: ${error}`);
  }
};

/**
 * Update a user's information.
 * @param userId - The ID of the user to update
 * @param updates - The updates to apply
 * @returns The updated user document
 * @throws Error if user is not found
 */
export const updateUser = async (userId: string, updates: Partial<IUser>) => {
  try {
    const user = await User.findByIdAndUpdate(userId, updates, {
      new: true,
    });
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }
    return user;
  } catch (error) {
    throw new Error(`Error updating user: ${error}`);
  }
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
    throw new Error(
      `Artist with ID ${artistId} is already in user's favorite list`,
    );
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
export const removeFavoriteArtist = async (
  userId: string,
  artistId: string,
) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error(`User with ID ${userId} not found`);
  }
  const artist = await Artist.findById(artistId);
  if (!artist) {
    throw new Error(`Artist with ID ${artistId} not found`);
  }

  if (!user.favoriteArtists.includes(artistId)) {
    throw new Error(
      `Artist with ID ${artistId} is not in user's favorite list`,
    );
  }

  user.favoriteArtists = user.favoriteArtists.filter(
    (fav) => fav.toString() !== artist._id.toString(),
  );

  await user.save();
  return user;
};

export const addFavoriteAlbum = async (userId: string, albumId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error(`User with ID ${userId} not found`);
  }

  const album = await Album.findById(albumId);
  if (!album) {
    throw new Error(`Album with ID ${albumId} not found`);
  }

  if (user.favoriteAlbums.includes(albumId)) {
    throw new Error(
      `Album with ID ${albumId} is already in user's favorite list`,
    );
  }
  user.favoriteAlbums.push(albumId);
  await user.save();
  return user;
};

export const removeFavoriteAlbum = async (userId: string, albumId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error(`User with ID ${userId} not found`);
  }
  const album = await Album.findById(albumId);
  if (!album) {
    throw new Error(`Album with ID ${albumId} not found`);
  }

  if (!user.favoriteAlbums.includes(albumId)) {
    throw new Error(`Album with ID ${albumId} is not in user's favorite list`);
  }

  user.favoriteAlbums = user.favoriteAlbums.filter(
    (fav) => fav.toString() !== album._id.toString(),
  );

  await user.save();
  return user;
};

export const addFavoriteTrack = async (userId: string, trackId: string) => {
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { $push: { favoriteTracks: trackId } },
      { new: true },
    );
    return user?.favoriteTracks;
  } catch (error) {
    throw new Error(`Error adding favorite track: ${error}`);
  }
};

export const removeFavoriteTrack = async (userId: string, trackId: string) => {
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { favoriteTracks: trackId } },
      { new: true },
    );
    return user?.favoriteTracks;
  } catch (error) {
    throw new Error(`Error removing favorite track: ${error}`);
  }
};

export const deleteUser = async (userId: string) => {
  const deletedUser = await User.findByIdAndDelete(userId);
  if (!deletedUser) {
    throw new Error(`User with ID ${userId} not found`);
  }

  const artistsManaged = await Artist.find({ managingUserId: userId });
  if (artistsManaged.length > 0) {
    for (const artist of artistsManaged) {
      const artistId = artist._id.toString();
      await Track.deleteMany({ artistId });
      await Album.deleteMany({ artistId });
      await artist.deleteOne();
    }
  }
  return true;
};
