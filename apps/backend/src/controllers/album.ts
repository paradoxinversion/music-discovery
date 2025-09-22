import { Request, Response } from "express";
import {
  createAlbum as createAlbumAction,
  getAlbumById as getAlbumByIdAction,
  updateAlbum as updateAlbumAction,
  deleteAlbum as deleteAlbumAction,
} from "../db/actions/Album";
import { IAlbum } from "@common/types/src/types";
import Album from "../db/models/Album";

export const createAlbum = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const albumData: Omit<IAlbum, "managingUserId"> = {
      title: req.body.title,
      artistId: req.body.artistId,
      genre: req.body.genre,
      releaseDate: req.body.releaseDate,
      links: req.body.links,
    };
    const album = await createAlbumAction(user._id.toString(), albumData);
    res.status(201).json({ status: "OK", data: album });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ status: "ERROR", message: error.message });
    }
  }
};

export const getAlbums = async (req: Request, res: Response) => {
  try {
    const albums = await Album.find();
    res.status(200).json({ status: "OK", data: albums });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ status: "ERROR", message: error.message });
    }
  }
};

export const getAlbumById = async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      res
        .status(400)
        .json({ status: "ERROR", message: "Album ID is required" });
      return;
    }
    const album = await getAlbumByIdAction(req.params.id);
    if (album) {
      res.status(200).json({ status: "OK", data: album });
    } else {
      res.status(404).json({ status: "ERROR", message: "Album not found" });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ status: "ERROR", message: error.message });
    }
  }
};

export const updateAlbum = async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      res
        .status(400)
        .json({ status: "ERROR", message: "Album ID is required" });
      return;
    }
    const updatedAlbum = await updateAlbumAction(
      req.user._id,
      req.params.id,
      req.body,
    );
    if (updatedAlbum) {
      res.status(200).json({ status: "OK", data: updatedAlbum });
    } else {
      res.status(404).json({ status: "ERROR", message: "Album not found" });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ status: "ERROR", message: error.message });
    }
  }
};

export const deleteAlbum = async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      res
        .status(400)
        .json({ status: "ERROR", message: "Album ID is required" });
      return;
    }
    await deleteAlbumAction(req.user._id, req.params.id);
    res
      .status(204)
      .json({ status: "OK", message: "Album deleted successfully" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ status: "ERROR", message: error.message });
    }
  }
};
