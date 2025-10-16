import cors from "cors";
import express from "express";
import passport from "passport";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import expressSession, { MemoryStore } from "express-session";
import { connectToDatabase } from "./db";
import { Strategy as LocalStrategy } from "passport-local";
import User, { IUserDoc } from "./db/models/User";
import api from "./api/v1";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import { RedisStore } from "connect-redis";
import { createClient } from "redis";
import { readFileSync } from "fs";
let redisClient;
let redisStore;

if (process.env.NODE_ENV === "production") {
  redisClient = createClient({
    url: "redis://redis:6379",
  });
  redisClient.connect().catch(console.error);
  redisStore = new RedisStore({
    client: redisClient,
    prefix: "mda:",
  });
}

const appName = "Music Discovery App";
const limiter = rateLimit({
  windowMs: 10000, // 10 seconds
  limit: 30, // each IP can make up to 30 requests per `windowsMs` (10 seconds)
  standardHeaders: true, // add the `RateLimit-*` headers to the response
  legacyHeaders: false, // remove the `X-RateLimit-*` headers from the response
});
const app = express();

app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

app.use(morgan("dev"));
app.use(limiter);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  expressSession({
    store:
      process.env.NODE_ENV === "production" ? redisStore : new MemoryStore({}),
    secret: readFileSync("/run/secrets/SESSION_SECRET"),
    resave: false,
    saveUninitialized: false,
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
