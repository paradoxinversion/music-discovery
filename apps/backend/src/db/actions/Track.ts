import { ITrack } from "@common/types/src/types";
import Track from "../models/Track";
import User from "../models/User";

/**
 * Creates a new track in the database.
 * @param trackData Data for the track to create
 * @returns The created track
 */
export const createTrack = async (trackData: ITrack) => {
  if (
    await Track.findOne({
      title: trackData.title,
      albumId: trackData.albumId,
    })
  ) {
    throw new Error(
      `Track with title ${trackData.title} in album ${trackData.albumId} already exists`,
    );
  }
  const track = new Track(trackData);
  await track.save();
  return track;
};
export const getAllTracks = async (): Promise<ITrack[]> => {
  const tracks = await Track.find();
  return tracks.map((track) => track.toJSON({ flattenMaps: true })) as ITrack[];
};

export const getTrackById = async (trackId: string) => {
  const track = await Track.findById(trackId).populate("artistId", "name");
  return track;
};

export const getRandomTracks = async (count: number) => {
  try {
    const tracks = await Track.aggregate([
      { $sample: { size: count } },
      { $addFields: { artistObjId: { $toObjectId: "$artistId" } } }, // convert artistId to ObjectId
      {
        $lookup: {
          from: "artists",
          localField: "artistObjId",
          foreignField: "_id",
          as: "artist",
        },
      },
      { $unwind: "$artist" }, // flatten the artist array
      {
        $project: {
          title: 1,
          albumId: 1,
          artistId: 1,
          duration: 1,
          isrc: 1,
          genre: 1,
          links: 1,
          managingUserId: 1,
          artistName: "$artist.name", // include artist name
        },
      },
    ]).exec();
    return tracks;
  } catch (error) {
    throw new Error(`Error retrieving random tracks: ${error}`);
  }
};

export const getTracksByGenre = async (genre: string, limit: number) => {
  // const tracks = await Track.find({ genre }).limit(limit);
  const tracks = await Track.aggregate([
    { $match: { genre } },
    { $sample: { size: limit } },
    { $addFields: { artistObjId: { $toObjectId: "$artistId" } } }, // convert artistId to ObjectId
    {
      $lookup: {
        from: "artists",
        localField: "artistObjId",
        foreignField: "_id",
        as: "artist",
      },
    },
    { $unwind: "$artist" }, // flatten the artist array
    {
      $project: {
        title: 1,
        artistName: "$artist.name", // include artist name
      },
    },
  ]).exec();
  return tracks;
};

export const updateTrack = async (
  userId: string,
  trackId: string,
  updateData: Partial<ITrack>,
) => {
  const user = await User.findById(userId);
  const track = await Track.findById(trackId);
  if (!user) {
    throw new Error(`User with ID ${userId} not found`);
  }
  if (track?.managingUserId !== userId) {
    throw new Error(
      `User with ID ${userId} is not authorized to update this track`,
    );
  }
  const updatedTrack = await Track.findByIdAndUpdate(trackId, updateData, {
    new: true,
  });
  if (!updatedTrack) {
    throw new Error(`Track with ID ${trackId} not found`);
  }
  return updatedTrack;
};

export const deleteTrack = async (userId: string, trackId: string) => {
  const user = await User.findById(userId);
  const track = await Track.findById(trackId);
  if (!user) {
    throw new Error(`User with ID ${userId} not found`);
  }
  if (track?.managingUserId !== userId) {
    throw new Error(
      `User with ID ${userId} is not authorized to delete this track`,
    );
  }
  const deletedTrack = await Track.findByIdAndDelete(trackId);
  if (!deletedTrack) {
    throw new Error(`Track with ID ${trackId} not found`);
  }
  return true;
};
