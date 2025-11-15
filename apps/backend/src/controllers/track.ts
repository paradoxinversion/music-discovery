import { Request, Response } from "express";
import {
  getRandomTracks,
  getTrackById,
  getTracksByGenre,
  getTracksByArtistId as getTracksByArtistIdAction,
  createTrack,
  updateTrack as updateTrackAction,
  deleteTrack as deleteTrackAction,
  getTrackBySlugAndArtist,
} from "../db/actions/Track";
import Joi from "joi";
import { addFavoriteTrack, removeFavoriteTrack } from "../db/actions/User";
import { ITrack, TrackSubmissionData } from "@common/types/src/types";
import { getImageAtPath } from "../db/actions/Storage";
import { musicPlatformLinks } from "@common/json-data";
const submitTrack = async (req: Request, res: Response) => {
  const trackSchema = Joi.object<TrackSubmissionData>({
    title: Joi.string().required(),
    artistId: Joi.string().required(),
    genre: Joi.string().required(),
    isrc: Joi.string().allow("").optional(),
    trackArt: Joi.any().optional(),
    links: Joi.object()
      // .pattern(
      //   Joi.string().valid("spotify", "appleMusic", "youtube", "soundcloud"),
      //   Joi.string().uri(),
      // )
      .optional(),
  });
  const managingUserId = req.user._id;
  try {
    const { error, value } = trackSchema.validate(req.body);
    if (error) {
      throw new Error("Invalid track data: " + error.message);
    }
    const trackData: TrackSubmissionData & { managingUserId: string } = {
      ...value,
      managingUserId,
    };
    // Save the track to the database
    const track = await createTrack(req.user, trackData, req.file);
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
  let trackArt = null;
  if (track && track.trackArt) {
    const art = await getImageAtPath(track?.trackArt);
    if (art) {
      trackArt = Buffer.from(art).toString("base64");
    }
  }
  return res.status(200).json({ status: "OK", data: { ...track, trackArt } });
};

const getBySlugAndArtist = async (req: Request, res: Response) => {
  const { trackSlug, artistSlug } = req.params;
  if (!trackSlug || !artistSlug) {
    return res
      .status(400)
      .json({ status: "ERROR", message: "slug and artistId are required" });
  }

  const track = await getTrackBySlugAndArtist(trackSlug, artistSlug);
  if (!track) {
    return res
      .status(404)
      .json({ status: "ERROR", message: "Track not found" });
  }
  let trackArt = null;
  if (track && track.trackArt) {
    const art = await getImageAtPath(track?.trackArt);
    if (art) {
      trackArt = Buffer.from(art).toString("base64");
    }
  }
  return res.status(200).json({ status: "OK", data: { ...track, trackArt } });
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
  const trackReturn = await tracks.reduce(
    async (acc, track: ITrack) => {
      const resolvedAcc = await acc;
      if (track.trackArt) {
        await getImageAtPath(track.trackArt).then((art) => {
          if (art) {
            track.trackArt = Buffer.from(art).toString("base64");
          }
        });
      }
      resolvedAcc.push(track);
      return resolvedAcc;
    },
    [] as typeof tracks,
  );
  res.status(200).json({ status: "OK", data: trackReturn });
};

const deleteTrack = async (req: Request, res: Response) => {
  if (!req.params.trackId) {
    return res
      .status(400)
      .json({ status: "ERROR", message: "trackId is required" });
  }
  const result = await deleteTrackAction(req.user._id, req.params.trackId);
  res.status(200).json({ status: "OK", data: result });
};

const updateTrack = async (req: Request, res: Response) => {
  const updateSchema = Joi.object({
    artistId: Joi.string().optional(),
    title: Joi.string().optional(),
    genre: Joi.string().optional(),
    // trackArt: Joi.any().optional(),
    isrc: Joi.string().optional(),
    links: Joi.object()
      .pattern(
        Joi.string().valid(...Object.keys(musicPlatformLinks)),
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

    const updatedTrack = await updateTrackAction(
      userId,
      trackId,
      value,
      req.file,
    );
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
  getBySlugAndArtist,
};
