import { Request, Response } from "express";

const submitTrack = (req: Request, res: Response) => {
  res.status(200).json({ status: "NOT IMPLEMENTED" });
};

const getTrack = (req: Request, res: Response) => {
  res.status(200).json({ status: "NOT IMPLEMENTED" });
};

const deleteTrack = (req: Request, res: Response) => {
  res.status(200).json({ status: "NOT IMPLEMENTED" });
};

const updateTrack = (req: Request, res: Response) => {
  res.status(200).json({ status: "NOT IMPLEMENTED" });
};

export { submitTrack, getTrack, deleteTrack, updateTrack };