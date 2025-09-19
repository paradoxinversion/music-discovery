import { EditableAlbum, IAlbum } from "@common/types/src/types";
import Album from "../models/Album";
import Track from "../models/Track";
import User from "../models/User";

export const createAlbum = async (albumData: IAlbum) => {
  if (
    await Album.findOne({
      title: albumData.title,
      artistId: albumData.artistId,
    })
  ) {
    throw new Error(
      `Album with title ${albumData.title} by artist ${albumData.artistId} already exists`,
    );
  }
  const album = new Album(albumData);
  await album.save();
  return album;
};

export const getAlbumById = async (albumId: string) => {
  const album = await Album.findById(albumId);
  return album;
};

export const updateAlbum = async (
  userId: string,
  albumId: string,
  updateData: EditableAlbum,
) => {
  const album = await Album.findById(albumId);
  if (!album) {
    throw new Error(`Album with ID ${albumId} not found`);
  }
  if (album.managingUserId !== userId) {
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

export const deleteAlbum = async (userId: string, albumId: string) => {
  const album = await Album.findById(albumId);

  if (album?.managingUserId !== userId) {
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
