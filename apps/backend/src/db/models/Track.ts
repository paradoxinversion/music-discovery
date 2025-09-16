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
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  isrc: {
    type: String,
    unique: true,
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
});

const Track = model<ITrack>("Track", TrackSchema);
export default Track;
