import { Request, Response } from "express";
import { createUser } from "../db/actions/User";
import joi from "joi";
import { IUserSignup } from "@common/types/src/types";

const signUpSchema = joi.object<IUserSignup>({
  username: joi.string().min(3).max(30).required(),
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
});

export const signUp = async (
  req: Request<{ body: IUserSignup }>,
  res: Response,
) => {
  try {
    const { error, value } = signUpSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0]?.message });
    }
    const { username, password, email } = value;
    if (!username || !password || !email) {
      return res
        .status(400)
        .json({ message: "Username, password, and email are required" });
    }

    await createUser({ username, password, email });
    return res.status(200).json({ message: "Sign up successful" });
  } catch (error) {
    console.error("Error during sign up:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const login = (req: Request, res: Response) => {
  const { password, __v, ...returnUser } = req.user.toObject();
  return res
    .status(200)
    .json({ message: "Login successful", user: returnUser });
};

export const checkAuth = (req: Request, res: Response) => {
  if (req.isAuthenticated()) {
    const { password, __v, ...returnUser } = req.user.toObject();
    return res.status(200).json({ authenticated: true, user: returnUser });
  } else {
    return res.status(200).json({ authenticated: false });
  }
};
