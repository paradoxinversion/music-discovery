import { Request, Response } from "express";
import { createUser, setUserStatus } from "../db/actions/User";
import {
  createUserCreatedEvent,
  logServerEvent,
} from "../serverEvents/serverEvents";
import { userFormValidators } from "@common/validation";

export const signUp = async (req: Request, res: Response) => {
  try {
    const values = await userFormValidators.signUpSchema.validate(req.body);
    const user = await createUser(values);

    // Automatically activate the user upon signup
    // TODO: Switch to email verification flow later
    await setUserStatus(user.id, "active");
    logServerEvent(createUserCreatedEvent(user.username));
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
  res.set("Cache-Control", "no-cache, no-store, must-revalidate");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  if (req.isAuthenticated()) {
    const { password, __v, ...returnUser } = req.user.toObject();
    if (returnUser.accountStatus !== "active") {
      return res.status(401).json({ message: "User account is not active." });
    }
    return res.status(200).json({ authenticated: true, user: returnUser });
  } else {
    return res.status(401).json({ authenticated: false });
  }
};

export const logout = (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      console.error("Error during logout:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session during logout:", err);
        return res.status(500).json({ message: "Internal server error" });
      }
      res.clearCookie("connect.sid");
      return res.status(200).json({ message: "Logout successful" });
    });
  });
};
