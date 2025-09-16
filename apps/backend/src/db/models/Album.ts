import { IAlbum } from "@common/types/src/types";
import { Schema, model } from "mongoose";

const AlbumSchema: Schema<IAlbum> = new Schema({
  title: {
    type: String,
    required: true,
  },
  artistId: {
    type: String,
    required: true,
    ref: "Artist",
  },
  releaseDate: {
    type: Date,
    required: true,
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

const Album = model<IAlbum>("Album", AlbumSchema);
export default Album;
