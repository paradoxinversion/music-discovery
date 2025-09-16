import { IArtist } from "@common/types/src/types";
import Artist from "../models/Artist";
import User from "../models/User";
import Album from "../models/Album";
import Track from "../models/Track";

// NOTE: Return values from mongoose documents with Map fields need to be converted to JSON with
// flattenMaps:true option to avoid issues in tests and serialization

/**
 * Create a new artist in the database. The managing user must exist.
 * @param userId - ID of the user managing the artist
 * @param artistData - Artist information
 * @returns The created artist document
 * @throws Error if managing user does not exist or if artist name is not unique
 */
export const createArtist = async (
  userId: string,
  artistData: IArtist,
): Promise<IArtist> => {
  try {
    const managingUser = await User.findById(userId);
    if (!managingUser) {
      throw new Error(`User with ID ${userId} not found`);
    }
    const newArtist = new Artist({ ...artistData, managingUserId: userId });
    await newArtist.save();
    return newArtist.toJSON({ flattenMaps: true });
  } catch (error) {
    throw new Error(`Error creating artist: ${error}`);
  }
};

/**
 * Retrieve an artist by their ID.
 * @param artistId - The ID of the artist to retrieve
 * @returns The artist document or null if not found
 */
export const getArtistById = async (artistId: string) => {
  try {
    const artist = await Artist.findById(artistId);
    return artist?.toJSON({ flattenMaps: true }) || null;
  } catch (error) {
    throw new Error(`Error retrieving artist: ${error}`);
  }
};

/**
 * Update an artist's information.
 * @param artistId - The ID of the artist to update
 * @param updateData - The updates to apply (excluding managingUserId)
 * @returns The updated artist document
 * @throws Error if artist is not found
 */
export const updateArtist = async (
  artistId: string,
  updateData: Partial<Omit<IArtist, "managingUserId">>,
) => {
  try {
    const updatedArtist = await Artist.findByIdAndUpdate(artistId, updateData, {
      new: true,
    });
    if (!updatedArtist) {
      throw new Error(`Artist with ID ${artistId} not found`);
    }
    return updatedArtist?.toJSON({ flattenMaps: true });
  } catch (error) {
    throw new Error(`Error updating artist: ${error}`);
  }
};

/**
 * Delete an artist by their ID. Also deletes associated albums and tracks, and removes the artist from users' favorites.
 * @param artistId - The ID of the artist to delete
 * @returns True if deletion was successful
 * @throws Error if artist is not found
 */
export const deleteArtist = async (artistId: string) => {
  try {
    const deletedArtist = await Artist.findByIdAndDelete(artistId);
    if (!deletedArtist) {
      throw new Error(`Artist with ID ${artistId} not found`);
    }
    await Album.deleteMany({ artistId: artistId });
    await Track.deleteMany({ artistId: artistId });
    await User.updateMany(
      { favoriteArtists: artistId },
      { $pull: { favoriteArtists: artistId } },
    );
    return true;
  } catch (error) {
    throw new Error(`Error deleting artist: ${error}`);
  }
};
