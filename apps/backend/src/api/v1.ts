import express from "express";
import passport from "passport";
import { ensureLoggedIn } from "connect-ensure-login";
import { healthCheck } from "../controllers/health";
import { checkAuth, login, signUp } from "../controllers/auth";
import {
  createNewArtist,
  deleteArtist,
  getArtists,
  getById,
  getRandom,
  getSimilarArtists,
  updateArtist,
} from "../controllers/artist";
import {
  createAlbum,
  deleteAlbum,
  getAlbumById,
  getAlbums,
  updateAlbum,
} from "../controllers/album";

import {
  getRandom as getRandomTracks,
  getSimilarTracks,
  getTrack,
  getTracks,
  setFavorite,
} from "../controllers/track";
const router = express.Router();

router.route("/health").get(healthCheck);

router.route("/auth/sign-up").post(signUp);

router
  .route("/auth/log-in")
  .post(passport.authenticate("local", { session: true }), login);

router.route("/auth/check-auth").get(ensureLoggedIn(), checkAuth);

router
  .route("/artists")
  .get(getArtists)
  .post(ensureLoggedIn(), createNewArtist);

router.route("/artists/random").get(getRandom);

router
  .route("/artists/:id")
  .get(getById)
  .put(ensureLoggedIn(), updateArtist)
  .delete(ensureLoggedIn(), deleteArtist);

router.route("/artist/:id/similar").get(getSimilarArtists);

router
  .route("/albums/:id")
  .get(getAlbumById)
  .put(ensureLoggedIn(), updateAlbum)
  .delete(ensureLoggedIn(), deleteAlbum);

router.route("/albums").get(getAlbums).post(ensureLoggedIn(), createAlbum);

router.route("/tracks/random").get(getRandomTracks);
router.route("/tracks/:trackId").get(getTrack);
router.route("/tracks/:trackId/favorite").post(ensureLoggedIn(), setFavorite);
router.route("/tracks/:trackId/similar").get(getSimilarTracks);
router.route("/tracks/genre/:genre").get(getTracks);
export default router;
