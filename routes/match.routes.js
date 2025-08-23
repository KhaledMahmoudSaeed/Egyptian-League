import express from "express";
import {
  index,
  show,
  store,
  update,
  destroy,
} from "../controllers/match.controller.js";
const router = express.Router();

router.get("/", index);
router.get("/:matchId", show);
router.post("/", store);
router.put("/:matchId", update);
router.delete("/:matchId", destroy);

export default router;
