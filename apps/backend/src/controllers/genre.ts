import { Request, Response } from "express";
import genres from "../jsonData/genres.json";
export const getGenres = (req: Request, res: Response) => {
  res.status(200).json({ genres: genres.genres });
};
