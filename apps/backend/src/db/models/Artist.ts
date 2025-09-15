import { IArtist } from "@common/types/src/types";
import { Types, Schema, model } from "mongoose";

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
});

const Artist = model<IArtist>("Artist", ArtistSchema);
export default Artist;
