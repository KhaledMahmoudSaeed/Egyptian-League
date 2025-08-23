import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { FAIL } from "./utilities/successWords.js";
import teamRouter from "./routes/team.routes.js";
import matchRouter from "./routes/match.routes.js";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/teams", teamRouter);
app.use("/api/matches", matchRouter);
// Catch all invalid routes
app.use((req, res) => {
  return res.status(404).json({
    success: FAIL,
    status: 404,
    msg: "Invalid Route",
  });
});
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    status: err.statusCode || 500,
    success: FAIL,
    msg: err.message || "Internal Server Error",
  });
});

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server is running on port ${process.env.PORT || 3000}`);
    });
    console.log("Connected!");
  })
  .catch((err) => console.log(err));
