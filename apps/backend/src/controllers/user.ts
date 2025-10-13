import { Request, Response } from "express";
import {
  getFavoriteArtists as getFavoriteArtistsAction,
  getFavoriteTracks as getFavoriteTracksAction,
  getFavorites as getFavoritesAction,
  getManagedArtists as getManagedArtistsAction,
} from "../db/actions/User";

export const getManagedArtists = async (req: Request, res: Response) => {
  if (!req.user) {
    res
      .status(401)
      .json({ status: "ERROR", message: "User not authenticated" });
    return;
  }
  try {
    const userId = req.user._id;
    const artists = await getManagedArtistsAction(userId);
    res.status(200).json({ status: "OK", data: artists });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ status: "ERROR", message: error.message });
    }
  }
};

export const getFavoriteArtists = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    const favoriteArtists = await getFavoriteArtistsAction(userId);
    res.status(200).json({ status: "OK", data: favoriteArtists });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ status: "ERROR", message: error.message });
    }
  }
};

export const getFavoriteTracks = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    const favoriteTracks = await getFavoriteTracksAction(userId);
    res.status(200).json({ status: "OK", data: favoriteTracks });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ status: "ERROR", message: error.message });
    }
  }
};

export const getFavorites = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    const favorites = await getFavoritesAction(userId);
    res.status(200).json({ status: "OK", favorites });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ status: "ERROR", message: error.message });
    }
  }
};
