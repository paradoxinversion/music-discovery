import { ITrack } from "@common/types/src/types";

import { Schema, model } from "mongoose";

const TrackSchema: Schema<ITrack> = new Schema({
  title: {
    type: String,
    required: true,
  },
  artistId: {
    type: String,
    required: true,
  },
  albumId: {
    type: String,
    required: false,
  },
  duration: {
    type: Number,
    required: true,
  },
  isrc: {
    type: String,
    unique: true,
    sparse: true,
  },
  genre: {
    type: String,
    required: true,
  },
  links: {
    type: Map,
    of: String,
    required: false,
  },
  managingUserId: {
    type: String,
    required: true,
    ref: "User",
  },
});

const Track = model<ITrack>("Track", TrackSchema);
export default Track;
