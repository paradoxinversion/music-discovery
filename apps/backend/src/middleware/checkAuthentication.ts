import { Request, Response, NextFunction } from "express";

const checkAuthentication = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.isAuthenticated()) {
    return res.status(200).json({ user: req.user });
  }
  res.status(401).json({
    result: 0,
    message: "Not logged in or credentials were not sent.",
  });
};

export default checkAuthentication;
