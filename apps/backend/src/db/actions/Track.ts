import { ITrack, TrackSubmissionData } from "@common/types/src/types";
import Track from "../models/Track";
import User from "../models/User";

/**
 * Creates a new track in the database.
 * @param trackData Data for the track to create
 * @returns The created track
 */
export const createTrack = async (trackData: TrackSubmissionData) => {
  if (
    await Track.findOne({
      title: trackData.title,
      artistId: trackData.artistId,
    })
  ) {
    throw new Error(
      `Track with title ${trackData.title} by artist ${trackData.artistId} already exists`,
    );
  }
  const track = new Track(trackData);
  await track.save();
  return track;
};
/**
 * Retrieve all tracks in the database.
 * @returns All tracks in the database
 */
export const getAllTracks = async (): Promise<ITrack[]> => {
  const tracks = await Track.find();
  return tracks.map((track) => track.toJSON({ flattenMaps: true })) as ITrack[];
};

export const getTrackById = async (trackId: string) => {
  const track = await Track.findById(trackId).populate("artistId", "name");
  if (!track) {
    return null;
  }

  return track?.toJSON({ flattenMaps: true }) as ITrack | null;
};

/**
 * Retrieve a random set of tracks from the database.
 * @param count The number of random tracks to retrieve
 * @returns An array of random tracks
 */
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
          artistId: 1,
          duration: 1,
          isrc: 1,
          genre: 1,
          artistName: "$artist.name", // include artist name
        },
      },
    ]).exec();
    return tracks;
  } catch (error) {
    throw new Error(`Error retrieving random tracks: ${error}`);
  }
};

/**
 * Retrieve a list of tracks by genre.
 * @param genre The genre to search for
 * @param limit The maximum number of tracks to return
 * @returns An array of tracks matching the genre
 */
export const getTracksByGenre = async (genre: string, limit: number) => {
  const tracks = await Track.aggregate([
    { $match: { genre } },
    { $sample: { size: limit } },
    { $addFields: { artistObjId: { $toObjectId: "$artistId" } } },
    {
      $lookup: {
        from: "artists",
        localField: "artistObjId",
        foreignField: "_id",
        as: "artist",
      },
    },
    { $unwind: "$artist" },
    {
      $project: {
        title: 1,
        artistName: "$artist.name",
      },
    },
  ]).exec();
  return tracks;
};

/**
 * Retrieve a list of tracks by artist ID.
 * @param artistId The artist ID to search for
 * @returns An array of tracks by the specified artist
 */
export const getTracksByArtistId = async (artistId: string) => {
  const tracks = await Track.find({ artistId });
  return tracks;
};

/**
 * Update a track in the database.
 * @param userId The requesting user's ID
 * @param trackId The ID of the track to update
 * @param updateData Data to update the track with
 * @returns The updated track
 * @throws Error if the user is not authorized to update the track or if the track does not exist
 */
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
  if (track?.managingUserId !== userId.toString()) {
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

/**
 * Delete a track from the database.
 * @param userId The requesting user's ID
 * @param trackId The ID of the track to delete
 * @returns True if the track was deleted, false otherwise
 * @throws Error if the user is not authorized to delete the track or if the track does not exist
 */
export const deleteTrack = async (userId: string, trackId: string) => {
  const user = await User.findById(userId);
  const track = await Track.findById(trackId);
  if (!user) {
    throw new Error(`User with ID ${userId} not found`);
  }
  if (track?.managingUserId.toString() !== userId.toString()) {
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
