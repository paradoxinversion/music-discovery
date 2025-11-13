import { IArtist } from "@common/types/src/types";
import { Schema, model } from "mongoose";

const ArtistSchema: Schema<IArtist> = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  slug: {
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
    default: null,
  },
});

ArtistSchema.pre("validate", function (next) {
  if (!this.slug || this.isModified("name")) {
    this.slug = this.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  }
  next();
});

ArtistSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate() as IArtist;
  if (update && update.name) {
    update.slug = String(update.name)
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    this.setUpdate(update);
  }
  next();
});
const Artist = model<IArtist>("Artist", ArtistSchema);
export default Artist;
