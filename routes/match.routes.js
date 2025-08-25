import express from "express";
import {
  index,
  show,
  store,
  update,
  destroy,
} from "../controllers/match.controller.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", index);
router.get("/:matchId", show);
router.post("/", auth, store);
router.put("/:matchId", auth, update);
router.delete("/:matchId", auth, destroy);

export default router;
