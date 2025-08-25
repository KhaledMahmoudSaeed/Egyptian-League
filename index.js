import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import teamRouter from "./routes/team.routes.js";
import matchRouter from "./routes/match.routes.js";
import userRouter from "./routes/users.routes.js";
import { invaildRouter, errorDisplay } from "./middleware/routesHanldler.js";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/teams", teamRouter);
app.use("/api/matches", matchRouter);
app.use("/api/users", userRouter);
// Catch all invalid routes
app.use(invaildRouter);
app.use(errorDisplay);

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server is running on port ${process.env.PORT || 3000}`);
    });
    console.log("Connected!");
  })
  .catch((err) => console.log(err));
