import express from "express";
import { connectToDatabase } from "./db";

const app = express();
connectToDatabase();
const appName = "Music Discovery App";

app.get("/", (req, res) => {
  res.send(`Hello from the ${appName}`);
});

app.listen(3000, () => {
  console.log(`${appName} is running on port 3000`);
});
