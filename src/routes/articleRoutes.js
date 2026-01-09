import express from "express";
import {
  createArticle,
  getAllArticles,
  getArticleBySlug,
  getArticleById,
  updateArticle,
  deleteArticle,
} from "../controllers/article.controller.js";

import cache from "../middlewares/cacheMiddleware.js";

const router = express.Router();

router.post("/", createArticle);

router.get(
  "/",
  cache("articles:all", 600),
  getAllArticles
);

// 🔥 SEO route
router.get(
  "/slug/:slug",
  cache((req) => `articles:slug:${req.params.slug}`, 3600),
  getArticleBySlug
);

// 🔒 Admin/internal
router.get("/id/:id", getArticleById);

router.put("/:id", updateArticle);
router.delete("/:id", deleteArticle);

export default router;
