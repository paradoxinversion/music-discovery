import express from "express";
import passport from "passport";
import { ensureLoggedIn } from "connect-ensure-login";
import { healthCheck } from "../controllers/health";
import { login, signUp } from "../controllers/auth";
import {
  createNewArtist,
  deleteArtist,
  getArtists,
  getById,
  updateArtist,
} from "../controllers/artist";
const router = express.Router();

router.route("/health").get(healthCheck);

router.route("/auth/sign-up").post(signUp);

router
  .route("/auth/log-in")
  .post(passport.authenticate("local", { session: true }), login);

router
  .route("/artists")
  .get(getArtists)
  .post(ensureLoggedIn(), createNewArtist);

router
  .route("/artists/:id")
  .get(getById)
  .put(ensureLoggedIn(), updateArtist)
  .delete(ensureLoggedIn(), deleteArtist);

export default router;
