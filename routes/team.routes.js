import express from "express";
import {
  index,
  show,
  store,
  update,
  destroy,
} from "../controllers/team.controller.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", index);
router.get("/:teamId", show);
router.post("/", auth, store);
router.put("/:teamId", auth, update);
router.delete("/:teamId", auth, destroy);

export default router;
