import { Request, Response } from "express";
import {
  createArtist,
  getAllArtists,
  getArtistById,
  deleteArtist as deleteArtistAction,
  updateArtist as updateArtistAction,
  getRandomArtists,
  getSimilarArtists as getSimilarArtistsAction,
  getArtistsByIds,
} from "../db/actions/Artist";
import { IArtist } from "@common/types/src/types";
import Joi from "joi";
import { addFavoriteArtist, removeFavoriteArtist } from "../db/actions/User";
import { createImagePath } from "../utils/imageUtilities";

export const createNewArtist = async (req: Request, res: Response) => {
  const artistSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    genre: Joi.string().min(2).max(100).required(),
    biography: Joi.string().min(10).max(1000).required(),
    links: Joi.object({
      website: Joi.string().uri().optional(),
      facebook: Joi.string().uri().optional(),
      twitter: Joi.string().uri().optional(),
      instagram: Joi.string().uri().optional(),
    }).optional(),
  });
  const { error } = artistSchema.validate(req.body);
  if (error) {
    res.status(400).json({ status: "ERROR", message: error.message });
    return;
  }
  try {
    const user = req.user;
    const artistData: Omit<IArtist, "managingUserId"> = {
      name: req.body.name,
      genre: req.body.genre,
      biography: req.body.biography,
      links: req.body.links,
    };
    const artist = await createArtist(user._id, artistData);
    if (req.file) {
      console.info(
        `createNewArtist created image path: ${createImagePath(req.user, req.file, req.file?.fieldname)}`,
      );
    }
    res.status(200).json({ status: "OK", data: artist });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ status: "ERROR", message: error.message });
    }
  }
};

export const getArtists = async (req: Request, res: Response) => {
  const allArtists = await getAllArtists();
  res.status(200).json({ status: "OK", data: allArtists });
};

export const getById = async (req: Request, res: Response) => {
  const artistId = req.params.id;
  if (!artistId) {
    res.status(400).json({ status: "ERROR", message: "Artist ID is required" });
    return;
  }
  const artist = await getArtistById(artistId);
  if (artist) {
    res.status(200).json({ status: "OK", data: artist });
  } else {
    res.status(404).json({ status: "ERROR", message: "Artist not found" });
  }
};

export const getByIds = async (req: Request, res: Response) => {
  const requestSchema = Joi.object({
    artistIds: Joi.array().items(Joi.string().required()).required(),
  });
  const { error } = requestSchema.validate(req.body);
  if (error) {
    res.status(400).json({ status: "ERROR", message: error.message });
    return;
  }
  const artistIds: string[] = req.body.artistIds;
  if (!artistIds || !Array.isArray(artistIds) || artistIds.length === 0) {
    res
      .status(400)
      .json({ status: "ERROR", message: "Artist IDs are required" });
    return;
  }
  const artists = await getArtistsByIds(artistIds);
  res.status(200).json({ status: "OK", data: artists });
};

export const getRandom = async (req: Request, res: Response) => {
  const excludeArtists: string[] = req.query.exclude
    ? ((Array.isArray(req.query.exclude)
        ? req.query.exclude
        : [req.query.exclude]) as string[])
    : [];
  const count = 5;
  const artists = await getRandomArtists(count, excludeArtists);
  res.status(200).json({ status: "OK", data: artists });
};

export const getSimilarArtists = async (req: Request, res: Response) => {
  const artistId = req.params.id;
  if (!artistId) {
    res.status(400).json({ status: "ERROR", message: "Artist ID is required" });
    return;
  }
  const count = 5;
  try {
    const similarArtists = await getSimilarArtistsAction(artistId, count);
    res.status(200).json({ status: "OK", data: similarArtists });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ status: "ERROR", message: error.message });
    }
  }
};

export const setFavorite = async (req: Request, res: Response) => {
  if (!req.user) {
    res
      .status(401)
      .json({ status: "ERROR", message: "User not authenticated" });
    return;
  }
  const artistId = req.params.id;
  if (!artistId) {
    res.status(400).json({ status: "ERROR", message: "Artist ID is required" });
    return;
  }
  const requestSchema = Joi.object({
    remove: Joi.boolean().required(),
  });
  const { error } = requestSchema.validate(req.body);
  if (error) {
    res.status(400).json({ status: "ERROR", message: error.message });
    return;
  }

  const { remove } = req.body;
  try {
    let data;
    if (remove) {
      data = await removeFavoriteArtist(req.user._id, artistId);
    } else {
      data = await addFavoriteArtist(req.user._id, artistId);
    }
    res
      .status(200)
      .json({ status: "OK", message: "Favorite updated successfully", data });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ status: "ERROR", message: error.message });
    }
  }
};

export const updateArtist = async (req: Request, res: Response) => {
  if (!req.params.id) {
    res.status(400).json({ status: "ERROR", message: "Artist ID is required" });
    return;
  }
  if (req.file) {
    console.info(
      `updateArtist created image path: ${createImagePath(req.user, req.file, req.body.name)}`,
    );
  }
  if (!req.body || Object.keys(req.body).length === 0) {
    res
      .status(400)
      .json({ status: "ERROR", message: "Update data is required" });
    return;
  }

  await updateArtistAction(req.user._id, req.params.id, req.body);
  res
    .status(200)
    .json({ status: "OK", message: "Artist updated successfully" });
};

export const deleteArtist = async (req: Request, res: Response) => {
  if (!req.user) {
    res
      .status(401)
      .json({ status: "ERROR", message: "User not authenticated" });
    return;
  }
  if (!req.params.id) {
    res.status(400).json({ status: "ERROR", message: "Artist ID is required" });
    return;
  }
  await deleteArtistAction(req.user._id, req.params.id);
  res
    .status(200)
    .json({ status: "OK", message: "Artist deleted successfully" });
};
