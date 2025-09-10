import { IUser } from "@common/types/src/types";
import { Types, Schema, model } from "mongoose";
import bcrypt from "bcrypt";

const UserSchema: Schema<IUser> = new Schema({
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
      ref: "Artist"
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
}, {
  methods: {
    checkPassword: async function (password: string) {
      return bcrypt.compare(password, this.password);
    }
  }
});


const User = model<IUser>("User", UserSchema);
export default User;