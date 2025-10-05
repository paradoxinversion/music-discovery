import cors from "cors";
import express from "express";
import passport from "passport";
import morgan from "morgan";
import coookieParser from "cookie-parser";
import bodyParser from "body-parser";
import expressSession from "express-session";
import { connectToDatabase } from "./db";
import { Strategy as LocalStrategy } from "passport-local";
import User, { IUserDoc } from "./db/models/User";
import api from "./api/v1";
const appName = "Music Discovery App";
console.log(`Starting ${appName}...`);
const app = express();
app.use(cors());

app.use(morgan("dev"));
app.use(express.json());
app.use(coookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  expressSession({
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false },
  }),
);
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
app.use(passport.session());
app.use("/api/v1", api);

app.listen(process.env.PORT, () => {
  console.log(`${appName} is running on port ${process.env.PORT}`);
});
