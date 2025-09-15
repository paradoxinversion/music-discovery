import { EditableAlbum, IAlbum } from "@common/types/src/types";
import Album from "../models/Album";
import Track from "../models/Track";
import User from "../models/User";

export const createAlbum = async (albumData: IAlbum) => {
    if (await Album.findOne({ title: albumData.title, artistId: albumData.artistId })) {
        throw new Error(`Album with title ${albumData.title} by artist ${albumData.artistId} already exists`);
    }
    const album = new Album(albumData);
    await album.save();
    return album;
};

export const getAlbumById = async (albumId: string) => {
    const album = await Album.findById(albumId);
    return album;
};

export const updateAlbum = async (albumId: string, updateData: EditableAlbum) => {
    const updatedAlbum = await Album.findByIdAndUpdate(albumId, updateData, { new: true });
    if (!updatedAlbum) {
        throw new Error(`Album with ID ${albumId} not found`);
    }
    return updatedAlbum;
}

export const deleteAlbum = async (albumId: string) => {
    const deletedAlbum = await Album.findByIdAndDelete(albumId);
    if (!deletedAlbum) {
        throw new Error(`Album with ID ${albumId} not found`);
    }
    
    await User.updateMany(
        { favoriteTracks: { $in: await Track.find({ albumId }).distinct('_id') } },
        { $pull: { favoriteTracks: { $in: await Track.find({ albumId }).distinct('_id') } } }
    );
    await User.updateMany(
        { favoriteAlbums: albumId },
        { $pull: { favoriteAlbums: albumId } }
    );
    await Track.deleteMany({ albumId });
    return true;
}