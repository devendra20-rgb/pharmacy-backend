import express from "express";
import {
  createCondition,
  getAllConditions,
  getConditionBySlug,
  updateCondition,
  deleteCondition,
} from "../controllers/conditionController.js";

const router = express.Router();

router.post("/", createCondition);
router.get("/", getAllConditions);
router.get("/:slug", getConditionBySlug);
router.put("/:id", updateCondition);
router.delete("/:id", deleteCondition);

export default router;
