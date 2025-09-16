import { Request, Response } from "express";

const healthCheck = (req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
};

export { healthCheck };
