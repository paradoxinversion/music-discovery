import { EditableAlbum, IAlbum } from "@common/types/src/types";
import Album from "../models/Album";
import Track from "../models/Track";
import User from "../models/User";

/**
 * Creates a new album if it doesn't already exist for the given user and artist.
 * @param userId - ID of the user managing the album
 * @param albumData - Album information
 * @returns The created album document
 * @throws Error if album with same title by the same artist already exists for the user
 */
export const createAlbum = async (
  userId: string,
  albumData: Omit<IAlbum, "managingUserId">,
) => {
  if (
    await Album.findOne({
      title: albumData.title,
      artistId: albumData.artistId,
      managingUserId: userId,
    })
  ) {
    throw new Error(
      `Album with title ${albumData.title} by artist ${albumData.artistId} already exists`,
    );
  }
  const album = new Album({ ...albumData, managingUserId: userId });
  await album.save();
  return album;
};

/**
 * Retrieve an album by its ID.
 * @param albumId The ID to search for
 * @returns The found album or null if not found
 */
export const getAlbumById = async (albumId: string) => {
  const album = await Album.findById(albumId);
  return album;
};

/**
 * Update an album in the database.
 * @param userId The requesting user's ID
 * @param albumId The ID of the album to update
 * @param updateData Data to update the album with
 * @returns The updated album
 * @throws Error if the user is not authorized to update the album or if the album does not exist
 */
export const updateAlbum = async (
  userId: string,
  albumId: string,
  updateData: EditableAlbum,
) => {
  const album = await Album.findById(albumId);
  if (!album) {
    throw new Error(`Album with ID ${albumId} not found`);
  }
  if (album.managingUserId.toString() !== userId.toString()) {
    throw new Error(
      `User with ID ${userId} is not authorized to update this album`,
    );
  }
  const updatedAlbum = await Album.findOneAndUpdate(
    { _id: albumId },
    { ...updateData },
    { new: true },
  );

  return updatedAlbum;
};

/**
 * Delete an album from the database. This operation also deletes all tracks associated with the album
 * and removes the album and its tracks from users' favorite lists.
 * @param userId The requesting user's ID
 * @param albumId The ID of the album to delete
 * @returns True if the album was deleted, false otherwise
 * @throws Error if the user is not authorized to delete the album or if the album does not exist
 */
export const deleteAlbum = async (userId: string, albumId: string) => {
  const album = await Album.findById(albumId);

  if (album?.managingUserId.toString() !== userId.toString()) {
    throw new Error(
      `User with ID ${userId} is not authorized to delete this album`,
    );
  }

  const deletedAlbum = await Album.findByIdAndDelete(albumId);
  if (!deletedAlbum) {
    throw new Error(`Album with ID ${albumId} not found`);
  }

  await User.updateMany(
    {
      favoriteTracks: {
        $in: await Track.find({ albumId }).distinct("_id"),
      },
    },
    {
      $pull: {
        favoriteTracks: {
          $in: await Track.find({ albumId }).distinct("_id"),
        },
      },
    },
  );
  await User.updateMany(
    { favoriteAlbums: albumId },
    { $pull: { favoriteAlbums: albumId } },
  );
  await Track.deleteMany({ albumId });
  return true;
};
