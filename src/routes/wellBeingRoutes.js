import express from "express";
import {
  createWellBeing,
  getAllWellBeing,
  getWellBeingBySlug,
  updateWellBeing,
  deleteWellBeing,
} from "../controllers/wellBeingController.js";

const router = express.Router();

router.post("/", createWellBeing);
router.get("/", getAllWellBeing);
router.get("/:slug", getWellBeingBySlug);
router.put("/:id", updateWellBeing);
router.delete("/:id", deleteWellBeing);

export default router;
