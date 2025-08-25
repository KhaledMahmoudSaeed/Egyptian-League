import Joi from "joi";

const matchSchema = Joi.object({
  homeTeam: Joi.string().required(),
  awayTeam: Joi.string().required(),
  matchDate: Joi.date().required(),
  score: Joi.string().required(),
});

const idSchema = Joi.string()
  .regex(/^[0-9a-fA-F]{24}$/)
  .required();
import MATCH from "../models/match.model.js";
import { SUCCESS, FAIL } from "../utilities/successWords.js";
import { errorHandler } from "../utilities/errorHandler.js";
import { asyncWarper } from "../middleware/asyncWrapper.js";

export const index = asyncWarper(async (req, res, next) => {
  const limit = 3;
  const page = req.query.page || 1;
  const skip = (page - 1) * limit;
  const matches = await MATCH.find(
    {},
    {
      __v: 0,
      createdAt: 0,
      updatedAt: 0,
    }
  )
    .populate("homeTeam awayTeam", { __v: 0, createdAt: 0, updatedAt: 0 })
    .skip(skip)
    .limit(limit);
  if (matches.length === 0) {
    const error = errorHandler.create("No matches found", FAIL, 404);
    return next(error);
  }
  res.status(200).json({
    success: SUCCESS,
    status: 200,
    msg: "Matches retrieved successfully",
    data: matches,
  });
});

export const show = asyncWarper(async (req, res, next) => {
  const { matchId } = req.params;
  const { error: idError } = idSchema.validate(matchId);
  if (idError) {
    return next(errorHandler.create("Invalid match ID format", FAIL, 400));
  }
  const match = await MATCH.findById(matchId, {
    __v: 0,
    createdAt: 0,
    updatedAt: 0,
  }).populate("homeTeam awayTeam", {
    __v: 0,
    createdAt: 0,
    updatedAt: 0,
  });
  if (!match) {
    const error = errorHandler.create("Match not found", FAIL, 404);
    return next(error);
  }
  res.status(200).json({
    success: SUCCESS,
    status: 200,
    msg: "Match retrieved successfully",
    data: match,
  });
});

export const store = asyncWarper(async (req, res, next) => {
  const { error, value } = matchSchema.validate(req.body);
  if (error) {
    return next(errorHandler.create(error.details[0].message, FAIL, 400));
  }
  const { homeTeam, awayTeam, matchDate, score } = value;
  const invaildmatchdate = new Date(matchDate) > new Date();
  if (invaildmatchdate) {
    return next(errorHandler.create("Invalid match date", FAIL, 400));
  }
  const newMatch = new MATCH({ homeTeam, awayTeam, matchDate, score });
  await newMatch.save();
  res.status(201).json({
    success: SUCCESS,
    status: 201,
    msg: "Match created successfully",
    data: newMatch,
  });
});

export const update = asyncWarper(async (req, res, next) => {
  const { matchId } = req.params;
  const { error: idError } = idSchema.validate(matchId);
  if (idError) {
    return next(errorHandler.create("Invalid match ID format", FAIL, 400));
  }
  const { error, value } = matchSchema.validate(req.body);
  if (error) {
    return next(errorHandler.create(error.details[0].message, FAIL, 400));
  }
  const { homeTeam, awayTeam, matchDate, score } = value;
  const invaildmatchdate = new Date(matchDate) > new Date();
  if (invaildmatchdate) {
    return next(errorHandler.create("Invalid match date", FAIL, 400));
  }
  const updatedMatch = await MATCH.findByIdAndUpdate(
    matchId,
    { homeTeam, awayTeam, matchDate, score },
    { new: true }
  );
  if (!updatedMatch) {
    return next(errorHandler.create("Match not found", FAIL, 404));
  }
  res.status(200).json({
    success: SUCCESS,
    status: 200,
    msg: "Match updated successfully",
    data: updatedMatch,
  });
});

export const destroy = asyncWarper(async (req, res, next) => {
  const { matchId } = req.params;
  const { error: idError } = idSchema.validate(matchId);
  if (idError) {
    return next(errorHandler.create("Invalid match ID format", FAIL, 400));
  }
  const deletedMatch = await MATCH.findByIdAndDelete(matchId);
  if (!deletedMatch) {
    return next(errorHandler.create("Match not found", FAIL, 404));
  }
  res.status(200).json({
    success: SUCCESS,
    status: 200,
    msg: "Match deleted successfully",
    data: deletedMatch,
  });
});
