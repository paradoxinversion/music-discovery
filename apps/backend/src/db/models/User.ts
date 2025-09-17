import { IUser } from "@common/types/src/types";
import { Document, Model, Schema, model } from "mongoose";
import bcrypt from "bcrypt";
export interface IUserDoc extends IUser, Document {
  checkPassword(password: string): Promise<boolean>;
}

const UserSchema: Schema<IUserDoc, Model<IUserDoc>> = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      set: (ptPassword: string) => bcrypt.hashSync(ptPassword, 10),
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    favoriteArtists: [
      {
        type: Schema.Types.ObjectId,
        ref: "Artist",
      },
    ],
    favoriteAlbums: [
      {
        type: Schema.Types.ObjectId,
        ref: "Album",
      },
    ],
    favoriteTracks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Track",
      },
    ],
  },
  {
    methods: {
      async checkPassword(password: string) {
        return bcrypt.compare(password, this.password);
      },
    },
  },
);

const User = model<IUserDoc, Model<IUserDoc>>("User", UserSchema);
export default User;
