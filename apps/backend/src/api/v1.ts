import express from "express";
import passport from "passport";
import { ensureLoggedIn } from "connect-ensure-login";
import { healthCheck } from "../controllers/health";
import { checkAuth, login, logout, signUp } from "../controllers/auth";
import {
  createNewArtist,
  deleteArtist,
  getArtists,
  getById,
  getRandom,
  getSimilarArtists,
  updateArtist,
  setFavorite as setFavoriteArtist,
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
  getTracksByArtistId,
  setFavorite,
  submitTrack,
  updateTrack,
} from "../controllers/track";
import { getFavorites, getManagedArtists } from "../controllers/user";
import isLoggedIn from "../middleware/isLoggedIn";
import { createTrack } from "../db/actions/Track";
const router = express.Router();

router.route("/health").get(healthCheck);

router.route("/auth/sign-up").post(signUp);

router
  .route("/auth/log-in")
  .post(passport.authenticate("local", { session: true }), login);

router.route("/auth/check-auth").get(isLoggedIn, checkAuth);

router.route("/auth/log-out").get(ensureLoggedIn(), logout);

router.route("/artists").get(getArtists).post(isLoggedIn, createNewArtist);

router.route("/artists/random").get(getRandom);

router
  .route("/artists/:id")
  .get(getById)
  .put(isLoggedIn, updateArtist)
  .delete(isLoggedIn, deleteArtist);

router.route("/artist/:id/favorite").post(isLoggedIn, setFavoriteArtist);

router.route("/artist/:id/similar").get(getSimilarArtists);

router
  .route("/albums/:id")
  .get(getAlbumById)
  .put(ensureLoggedIn(), updateAlbum)
  .delete(ensureLoggedIn(), deleteAlbum);

router.route("/albums").get(getAlbums).post(isLoggedIn, createAlbum);

router.route("/tracks").post(isLoggedIn, submitTrack);
router.route("/tracks/random").get(getRandomTracks);
router.route("/tracks/:trackId").get(getTrack).put(isLoggedIn, updateTrack);
router.route("/tracks/:trackId/favorite").post(isLoggedIn, setFavorite);
router.route("/tracks/:trackId/similar").get(getSimilarTracks);
router.route("/tracks/genre/:genre").get(getTracks);
router.route("/tracks/artist/:artistId").get(getTracksByArtistId); // Added route to get tracks by artistId

router.route("/user/favorites").get(isLoggedIn, getFavorites);
router
  .route("/users/:userId/managed-artists")
  .get(isLoggedIn, getManagedArtists);
export default router;
