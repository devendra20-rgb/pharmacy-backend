import express from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryBySlug,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

import cache from "../middlewares/cacheMiddleware.js";

const router = express.Router();

router.post("/", createCategory);

router.get(
  "/",
  cache("categories:all", 3600),
  getAllCategories
);

// 🔥 SEO route
router.get(
  "/slug/:slug",
  cache((req) => `categories:slug:${req.params.slug}`, 7200),
  getCategoryBySlug
);

// 🔒 Admin/internal
router.get("/id/:id", getCategoryById);

router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;
