import User from "../models/users.models.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { asyncWarper } from "../middleware/asyncWrapper.js";

export const register = asyncWarper(async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });
  res.status(201).json({ message: "User registered successfully", user });
});

export const login = asyncWarper(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  res.json({ token, user });
});

export const getCurrentUser = asyncWarper(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
});
