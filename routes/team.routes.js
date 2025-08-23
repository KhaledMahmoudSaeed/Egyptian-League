import express from "express";
import {
  index,
  show,
  store,
  update,
  destroy,
} from "../controllers/team.controller.js";
const router = express.Router();

router.get("/", index);
router.get("/:teamId", show);
router.post("/", store);
router.put("/:teamId", update);
router.delete("/:teamId", destroy);

export default router;
