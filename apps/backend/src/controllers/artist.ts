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
  getArtistBySlug,
} from "../db/actions/Artist";
import { IArtist } from "@common/types/src/types";
import Joi from "joi";
import { addFavoriteArtist, removeFavoriteArtist } from "../db/actions/User";
import { getImageAtPath } from "../db/actions/Storage";
import {
  createArtistProfileCreatedEvent,
  createArtistProfileDeletedEvent,
  createArtistProfileUpdatedEvent,
  logServerEvent,
} from "../serverEvents/serverEvents";
import { socialPlatformLinks } from "@common/json-data";

export const createNewArtist = async (req: Request, res: Response) => {
  const MAX_BIO = 1500;
  const MAX_NAME = 100;
  const MAX_GENRE = 50;
  const MAX_FILE_BYTES = 2 * 1024 * 1024; // 2MB

  function escapeRegex(s: string) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  /**
   * Build per-platform regex from urlPattern like "https://twitter.com/{url}"
   * result becomes ^https:\/\/twitter\.com\/(.+)$
   */
  const linkSchemas: Record<string, Joi.StringSchema> = Object.keys(
    socialPlatformLinks,
  ).reduce(
    (acc, key) => {
      const pattern = socialPlatformLinks[key].urlPattern || "{url}";
      const rxSource = escapeRegex(pattern).replace(
        escapeRegex("{url}"),
        "(.+)",
      );
      const rx = new RegExp(`^${rxSource}$`);
      acc[key] = Joi.string()
        .uri()
        .pattern(rx)
        .messages({
          "string.uri": `${key} link must be a valid URI`,
          "string.pattern.base": `${key} link must match platform pattern`,
        });
      return acc;
    },
    {} as Record<string, Joi.StringSchema>,
  );
  const artistSchema = Joi.object({
    name: Joi.string().min(2).max(MAX_NAME).required(),
    genre: Joi.string().max(MAX_GENRE).required(),
    biography: Joi.string().allow("", null).max(MAX_BIO),
    links: Joi.object().keys(linkSchemas).optional(),
    // artistArt is multipart file; validate separately in middleware
  }).required();
  const { value, error } = artistSchema.validate(req.body);
  if (error) {
    res.status(400).json({ status: "ERROR", message: error.message });
    return;
  }
  try {
    const user = req.user;
    const artistData: Omit<IArtist, "managingUserId" | "slug"> = {
      name: value.name,
      genre: value.genre,
      biography: value.biography,
      links: value.links,
    };
    const artist = await createArtist(user._id, artistData, req.file);
    logServerEvent(
      createArtistProfileCreatedEvent(
        artist._id.toString(),
        artist.name,
        user._id.toString(),
      ),
    );
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
  const returnArtistArt = req.query.includeArt === "true";
  if (!artistId) {
    res.status(400).json({ status: "ERROR", message: "Artist ID is required" });
    return;
  }
  const artist = await getArtistById(artistId);
  let artistArt = null;
  if (artist && returnArtistArt && artist.artistArt) {
    const art = await getImageAtPath(artist?.artistArt);
    if (art) {
      artistArt = Buffer.from(art).toString("base64");
    }
  }
  if (artist) {
    res.status(200).json({ status: "OK", data: { ...artist, artistArt } });
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

export const getBySlug = async (req: Request, res: Response) => {
  const slug = req.params.slug;
  if (!slug) {
    res
      .status(400)
      .json({ status: "ERROR", message: "Artist slug is required" });
    return;
  }

  const returnArtistArt = req.query.includeArt === "true";
  const artist = await getArtistBySlug(slug);
  let artistArt = null;
  if (artist && returnArtistArt && artist.artistArt) {
    const art = await getImageAtPath(artist?.artistArt);
    if (art) {
      artistArt = Buffer.from(art).toString("base64");
    }
  }
  if (artist) {
    res.status(200).json({ status: "OK", data: { ...artist, artistArt } });
  } else {
    res.status(404).json({ status: "ERROR", message: "Artist not found" });
  }
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
  if (!req.body || Object.keys(req.body).length === 0) {
    res
      .status(400)
      .json({ status: "ERROR", message: "Update data is required" });
    return;
  }

  await updateArtistAction(req.user._id, req.params.id, req.body, req.file);
  logServerEvent(
    createArtistProfileUpdatedEvent(req.params.id, req.user._id.toString),
  );
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
  const result = await deleteArtistAction(req.user._id, req.params.id);
  logServerEvent(
    createArtistProfileDeletedEvent(req.params.id, req.user._id.toString()),
  );
  res
    .status(200)
    .json({ status: "OK", message: "Artist deleted successfully" });
};
