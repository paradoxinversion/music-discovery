import { IUser } from "@common/types/src/types";
import { Request, Response, NextFunction } from "express";

export default async function isUserActive(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const user: IUser = req.user;
  if (!user) {
    return res.status(401).json({
      message: "No credentials included with request or user not found.",
    });
  }

  if (user.accountStatus === "banned") {
    return res.status(403).json({ message: "User account is banned." });
  }

  if (user.accountStatus !== "active") {
    return res.status(401).json({ message: "User account is not active." });
  }

  return next();
}
