import { ITrack } from "@common/types/src/types";
import Track from "../models/Track";

/**
 * Creates a new track in the database.
 * @param trackData Data for the track to create
 * @returns The created track
 */
export const createTrack = async (trackData: ITrack) => {
    if (await Track.findOne({ title: trackData.title, albumId: trackData.albumId })) {
        throw new Error(`Track with title ${trackData.title} in album ${trackData.albumId} already exists`);
    }
    const track = new Track(trackData);
    await track.save();
    return track;
}

export const getTrackById = async (trackId: string) => {
    const track = await Track.findById(trackId);
    return track;
};

export const updateTrack = async (trackId: string, updateData: Partial<ITrack>) => {
    const updatedTrack = await Track.findByIdAndUpdate(trackId, updateData, { new: true });
    if (!updatedTrack) {
        throw new Error(`Track with ID ${trackId} not found`);
    }
    return updatedTrack;
}

export const deleteTrack = async (trackId: string) => {
    const deletedTrack = await Track.findByIdAndDelete(trackId);
    if (!deletedTrack) {
        throw new Error(`Track with ID ${trackId} not found`);
    }
    return true;
}