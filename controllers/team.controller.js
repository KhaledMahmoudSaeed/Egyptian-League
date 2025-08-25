import Joi from "joi";
import TEAM from "../models/team.model.js";
import { SUCCESS, FAIL } from "../utilities/successWords.js";
import { errorHandler } from "../utilities/errorHandler.js";
import { asyncWarper } from "../middleware/asyncWrapper.js";
import { now } from "mongoose";

const teamSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  city: Joi.string().min(2).max(50).required(),
  stadium: Joi.string().min(3).max(100).required(),
  foundedYear: Joi.date().required(),
});
export const index = asyncWarper(async (req, res, next) => {
  const limit = 3;
  const page = req.query.page || 1;
  const skip = (page - 1) * limit;
  const teams = await TEAM.find({}, { __v: 0, createdAt: 0, updatedAt: 0 })
    .skip(skip)
    .limit(limit);

  if (teams.length === 0) {
    const error = errorHandler.create("No teams found", FAIL, 404);
    return next(error);
  }
  res.status(200).json({
    success: SUCCESS,
    status: 200,
    msg: "Teams retrieved successfully",
    data: teams,
  });
});
export const show = asyncWarper(async (req, res, next) => {
  const teamId = req.params.teamId;
  const team = await TEAM.findById(teamId, {
    __v: 0,
    createdAt: 0,
    updatedAt: 0,
  });
  if (!team) {
    const error = errorHandler.create("Team not found", FAIL, 404);
    return next(error);
  }
  res.status(200).json({
    success: SUCCESS,
    status: 200,
    msg: "Team retrieved successfully",
    data: team,
  });
});
export const store = asyncWarper(async (req, res, next) => {
  const { error, value } = teamSchema.validate(req.body);
  if (error) {
    return next(errorHandler.create(error.details[0].message, FAIL, 400));
  }
  const { name, city, stadium, foundedYear } = value;
  const invaildFoundedYear = new Date(foundedYear) > now();
  if (invaildFoundedYear) {
    return next(errorHandler.create("Invalid founded date", FAIL, 400));
  }
  const existingTeam = await TEAM.findOne({ name });
  if (existingTeam) {
    return next(errorHandler.create("Team already exists", FAIL, 400));
  }
  const newTeam = new TEAM({ name, city, stadium, foundedYear });
  await newTeam.save();
  res.status(201).json({
    success: SUCCESS,
    status: 201,
    msg: "Team created successfully",
    data: newTeam,
  });
});

export const update = asyncWarper(async (req, res, next) => {
  const { error, value } = teamSchema.validate(req.body);
  if (error) {
    return next(errorHandler.create(error.details[0].message, FAIL, 400));
  }
  const teamId = req.params.teamId;
  const updatedTeam = await TEAM.findByIdAndUpdate(teamId, value, {
    new: true,
    runValidators: true,
  });
  if (!updatedTeam) {
    return next(errorHandler.create("Team not found", FAIL, 404));
  }
  res.status(200).json({
    success: SUCCESS,
    status: 200,
    msg: "Team updated successfully",
    data: updatedTeam,
  });
});
export const destroy = asyncWarper(async (req, res, next) => {
  const teamId = req.params.teamId;
  const team = await TEAM.findByIdAndDelete(teamId);
  if (!team) {
    const error = new errorHandler.create("Team not found", FAIL, 404);
    return next(error);
  }
  res.status(200).json({
    success: SUCCESS,
    status: 200,
    msg: "Team deleted successfully",
  });
});
