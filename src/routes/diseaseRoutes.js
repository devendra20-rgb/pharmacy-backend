import express from "express";
import {
  createDisease,
  getAllDiseases,
  getDiseaseBySlug,
  getDiseaseById,
  updateDisease,
  deleteDisease,
} from "../controllers/disease.controller.js";

import cache from "../middlewares/cacheMiddleware.js";

const router = express.Router();

router.post("/", createDisease);

router.get(
  "/",
  cache("diseases:all", 900),
  getAllDiseases
);

// 🔥 SEO route
router.get(
  "/slug/:slug",
  cache((req) => `diseases:slug:${req.params.slug}`, 7200),
  getDiseaseBySlug
);

// 🔒 Admin/internal
router.get("/id/:id", getDiseaseById);

router.put("/:id", updateDisease);
router.delete("/:id", deleteDisease);

export default router;
