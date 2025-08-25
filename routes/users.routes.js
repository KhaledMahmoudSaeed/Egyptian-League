import express from "express";
const router = express.Router();
import {
  register,
  getCurrentUser,
  login,
} from "../controllers/user.controllers.js";
import { auth } from "../middleware/auth.js";

router.post("/register", register);
router.post("/login", login);
router.get("/me", auth, getCurrentUser);

export default router;
