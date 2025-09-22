import { Request, Response } from "express";
import { createUser } from "../db/actions/User";

export const signUp = async (req: Request, res: Response) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: "Request body is missing" });
    }
    const { username, password, email } = req.body;
    if (!username || !password || !email) {
      return res
        .status(400)
        .json({ message: "Username, password, and email are required" });
    }

    await createUser({ username, password, email });
    res.status(200).json({ message: "Sign up successful" });
  } catch (error) {
    console.error("Error during sign up:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = (req: Request, res: Response) => {
  res.status(200).json({ message: "Login successful" });
};
