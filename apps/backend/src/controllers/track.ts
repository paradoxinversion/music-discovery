import { Request, Response } from "express";
import {
  getRandomTracks,
  getTrackById,
  getTracksByGenre,
  getTracksByArtistId as getTracksByArtistIdAction,
  createTrack,
  updateTrack as updateTrackAction,
} from "../db/actions/Track";
import Joi from "joi";
import { addFavoriteTrack, removeFavoriteTrack } from "../db/actions/User";
import { TrackSubmissionData } from "@common/types/src/types";

const submitTrack = async (req: Request, res: Response) => {
  const trackSchema = Joi.object<TrackSubmissionData>({
    title: Joi.string().required(),
    artistId: Joi.string().required(),
    genre: Joi.string().required(),
    isrc: Joi.string().optional(),
  });
  const managingUserId = req.user._id;
  try {
    const { error, value } = trackSchema.validate(req.body);
    if (error) {
      throw new Error(error.message);
    }
    const trackData: TrackSubmissionData & { managingUserId: string } = {
      ...value,
      managingUserId,
    };
    // Save the track to the database
    const track = await createTrack(trackData);
    return res.status(201).json({ status: "OK", data: track });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ status: "ERROR", message: error.message });
    }
  }
};

const getTrack = async (req: Request, res: Response) => {
  const { trackId } = req.params;
  if (!trackId) {
    return res
      .status(400)
      .json({ status: "ERROR", message: "trackId is required" });
  }
  const track = await getTrackById(trackId);
  if (!track) {
    return res
      .status(404)
      .json({ status: "ERROR", message: "Track not found" });
  }
  return res.status(200).json({ status: "OK", data: track });
};

const getTracks = async (req: Request, res: Response) => {
  const { genre } = req.params;
  if (!genre) {
    return res
      .status(400)
      .json({ status: "ERROR", message: "genre is required" });
  }
  const tracks = await getTracksByGenre(genre, 10);
  if (!tracks || tracks.length === 0) {
    return res
      .status(404)
      .json({ status: "ERROR", message: "No tracks found for this genre" });
  }
  return res.status(200).json({ status: "OK", data: tracks });
};

const getSimilarTracks = async (req: Request, res: Response) => {
  const { trackId } = req.params;
  if (!trackId) {
    return res
      .status(400)
      .json({ status: "ERROR", message: "trackId is required" });
  }
  const track = await getTrackById(trackId);
  if (!track) {
    return res
      .status(404)
      .json({ status: "ERROR", message: "Track not found" });
  }
  const genre = track.genre;
  const similarTracks = await getTracksByGenre(genre, 10);
  if (!similarTracks || similarTracks.length === 0) {
    return res
      .status(404)
      .json({ status: "ERROR", message: "No similar tracks found" });
  }
  return res.status(200).json({ status: "OK", data: similarTracks });
};

const getTracksByArtistId = async (req: Request, res: Response) => {
  const { artistId } = req.params;
  if (!artistId) {
    return res
      .status(400)
      .json({ status: "ERROR", message: "artistId is required" });
  }
  const tracks = await getTracksByArtistIdAction(artistId);
  if (!tracks || tracks.length === 0) {
    return res
      .status(404)
      .json({ status: "ERROR", message: "No tracks found for this artist" });
  }
  return res.status(200).json({ status: "OK", data: tracks });
};

const getRandom = async (req: Request, res: Response) => {
  const count = 8;

  const tracks = await getRandomTracks(count);
  res.status(200).json({ status: "OK", data: tracks });
};

const deleteTrack = (req: Request, res: Response) => {
  res.status(200).json({ status: "NOT IMPLEMENTED" });
};

const updateTrack = async (req: Request, res: Response) => {
  const updateSchema = Joi.object({
    title: Joi.string().optional(),
    genre: Joi.string().optional(),
    links: Joi.object()
      .pattern(
        Joi.string().valid("spotify", "appleMusic", "youtube", "soundcloud"),
        Joi.string().uri(),
      )
      .optional(),
  });
  try {
    const { trackId } = req.params;
    const userId = req.user._id;
    if (!trackId) {
      return res
        .status(400)
        .json({ status: "ERROR", message: "trackId is required" });
    }
    const { error, value } = updateSchema.validate(req.body);
    if (error) {
      throw new Error(error.message);
    }
    const updatedTrack = await updateTrackAction(userId, trackId, value);
    return res.status(200).json({ status: "OK", data: updatedTrack });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ status: "ERROR", message: error.message });
    }
  }
};
const setFavorite = async (req: Request, res: Response) => {
  const favoriteSchema = Joi.object({
    trackId: Joi.string().required(),
    remove: Joi.boolean().default(false),
  });
  const userId = req.user._id;
  try {
    const { trackId, remove } = req.body;
    const { error } = favoriteSchema.validate({ trackId, remove });
    if (error) {
      throw new Error(error.message);
    }
    if (remove) {
      const favoriteTracks = await removeFavoriteTrack(userId, trackId);
      return res.status(200).json({ status: "OK", data: favoriteTracks });
    }
    const favoriteTracks = await addFavoriteTrack(userId, trackId);
    return res.status(200).json({ status: "OK", data: favoriteTracks });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ status: "ERROR", message: error.message });
    }
  }
};

export {
  submitTrack,
  getTrack,
  deleteTrack,
  updateTrack,
  getRandom,
  getTracks,
  getSimilarTracks,
  setFavorite,
  getTracksByArtistId,
};
