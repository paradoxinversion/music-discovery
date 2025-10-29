import { IArtist } from "@common/types/src/types";
import { Schema, model } from "mongoose";

const ArtistSchema: Schema<IArtist> = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  genre: {
    type: String,
    required: true,
  },
  biography: {
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
  albums: {
    type: [String],
    ref: "Album",
    default: [],
  },
  tracks: {
    type: [String],
    ref: "Track",
    default: [],
  },
  artistArt: {
    type: String,
    required: false,
  },
});

const Artist = model<IArtist>("Artist", ArtistSchema);
export default Artist;
