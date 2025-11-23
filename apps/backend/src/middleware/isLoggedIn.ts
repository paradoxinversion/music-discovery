import { Request, Response, NextFunction } from "express";

const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({
    result: 0,
    message: "Not logged in or credentials were not sent.",
  });
};

export default isLoggedIn;
