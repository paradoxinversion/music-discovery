import { ITrack } from "@common/types/src/types";

import { Schema, model } from "mongoose";
import Artist from "./Artist";

const TrackSchema: Schema<ITrack> = new Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  artistId: {
    type: String,
    ref: "Artist",
    required: true,
  },
  albumId: {
    type: String,
    required: false,
  },
  duration: {
    type: Number,
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
  trackArt: {
    type: String,
    required: false,
  },
});

TrackSchema.pre("validate", function (next) {
  if (!this.slug || this.isModified("title")) {
    this.slug = this.title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  }
  next();
});

TrackSchema.post("save", async function (doc, next) {
  try {
    const trackId = String(doc._id);
    await Artist.findByIdAndUpdate(String(doc.artistId), {
      $addToSet: { tracks: trackId },
    });
    next();
  } catch (err) {
    console.error("Failed to add track id to artist.tracks:", err);
    next(err);
  }
});

// Handle bulk inserts, primarily for seeding purposes
TrackSchema.post("insertMany", async function (docs: any[]) {
  if (!Array.isArray(docs) || docs.length === 0) return;
  const map = new Map<string, string[]>();
  for (const doc of docs) {
    const artistId = String(doc.artistId);
    const trackId = String(doc._id);
    if (!artistId || !trackId) continue;
    const arr = map.get(artistId) ?? [];
    arr.push(trackId);
    map.set(artistId, arr);
  }

  const ops: any[] = [];
  for (const [artistId, trackIds] of map) {
    ops.push({
      updateOne: {
        filter: { _id: artistId },
        update: { $addToSet: { tracks: { $each: trackIds } } },
      },
    });
  }

  if (ops.length) {
    await Artist.bulkWrite(ops);
  }
});

TrackSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate() as ITrack;
  if (update && update.title) {
    update.slug = String(update.title)
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    this.setUpdate(update);
  }
  next();
});

const Track = model<ITrack>("Track", TrackSchema);
export default Track;
