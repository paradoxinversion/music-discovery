import { Request, Response } from "express";
import {
  getRandomTracks,
  getTrackById,
  getTracksByGenre,
} from "../db/actions/Track";
import Joi from "joi";
import { addFavoriteTrack, removeFavoriteTrack } from "../db/actions/User";

const submitTrack = (req: Request, res: Response) => {
  res.status(200).json({ status: "NOT IMPLEMENTED" });
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

const getRandom = async (req: Request, res: Response) => {
  const count = 8;

  const tracks = await getRandomTracks(count);
  res.status(200).json({ status: "OK", data: tracks });
};

const deleteTrack = (req: Request, res: Response) => {
  res.status(200).json({ status: "NOT IMPLEMENTED" });
};

const updateTrack = (req: Request, res: Response) => {
  res.status(200).json({ status: "NOT IMPLEMENTED" });
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
    return res.status(400).json({ status: "ERROR", message: error.message });
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
};
