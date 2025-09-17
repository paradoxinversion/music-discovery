import express from "express";
import passport from "passport";
import { healthCheck } from "../controllers/health";
import { login, signUp } from "../controllers/auth";
const router = express.Router();

router.route("/health").get(healthCheck);

router.route("/auth/sign-up").post(signUp);

router
  .route("/auth/log-in")
  .post(passport.authenticate("local", { session: false }), login);

export default router;
