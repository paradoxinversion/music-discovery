import "dotenv/config";
import express from "express";
import passport from "passport";
import morgan from "morgan";
import { connectToDatabase } from "./db";
import { Strategy as LocalStrategy } from "passport-local";
import User, { IUserDoc } from "./db/models/User";
import api from "./api/v1";
const appName = "Music Discovery App";

const app = express();
app.use(morgan("dev"));
app.use(express.json());
connectToDatabase();

passport.use(
  new LocalStrategy(async function (username, password, done) {
    const user = await User.findOne({ username: username });

    if (!user) {
      return done(null, false, { message: "Incorrect username." });
    }
    if (!user.checkPassword(password)) {
      return done(null, false, { message: "Incorrect password." });
    }
    return done(null, user);
  }),
);

passport.serializeUser(function (user: IUserDoc, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  const user = await User.findById(id);
  done(null, user);
});

app.use(passport.initialize());
app.use("/api/v1", api);

app.listen(process.env.PORT, () => {
  console.log(`${appName} is running on port ${process.env.PORT}`);
});
