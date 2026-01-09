import express from "express";
import {
  createDoctor,
  getAllDoctors,
  getDoctorBySlug,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
} from "../controllers/doctorController.js";

import cache from "../middlewares/cacheMiddleware.js";

const router = express.Router();

router.post("/", createDoctor);

router.get(
  "/",
  cache("doctors:all", 900),
  getAllDoctors
);

// 🔥 SEO route
router.get(
  "/slug/:slug",
  cache((req) => `doctors:slug:${req.params.slug}`, 7200),
  getDoctorBySlug
);

// 🔒 Admin/internal
router.get("/id/:id", getDoctorById);

router.put("/:id", updateDoctor);
router.delete("/:id", deleteDoctor);

export default router;
