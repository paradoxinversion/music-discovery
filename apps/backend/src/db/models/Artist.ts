import { IArtist } from "@common/types/src/types";
import { Types, Schema, model } from "mongoose";

const ArtistSchema: Schema<IArtist> = new Schema({
  name: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  biography: {
    type: String,
    required: true,
  },
});

const Artist = model<IArtist>("Artist", ArtistSchema);
export default Artist;
