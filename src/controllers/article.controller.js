import Article from "../models/Article.js";
import redis from "../config/redis.js";

// POST /api/articles (unchanged)
export const createArticle = async (req, res) => {
  try {
    const article = await Article.create(req.body);
    if (redis) {
      await redis.del("articles:all");
    }
    res.status(201).json(article);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET /api/articles – Populate add kiya category ke liye
export const getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find({ isPublished: true })
      .populate('category', 'name')  // Yeh add kar do – sirf name fetch karega, fast rahega
      .sort({
        createdAt: -1,
      });

    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET by SLUG (populate add kiya)
export const getArticleBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const article = await Article.findOne({
      slug,
      isPublished: true,
    })
    .populate('category', 'name');  // Yeh add kar do

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    res.json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET by ID (populate add kiya)
export const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
      .populate('category', 'name');  // Yeh add kar do

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    res.json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/articles/:id – Save ke baad populate return karo
export const updateArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    Object.assign(article, req.body);

    await article.save(); // pre("save") hook chalega

    // Updated article with populate return karo
    const updatedArticle = await Article.findById(article._id).populate('category', 'name');

    // clear cache
    if (redis) {
      redis.del("articles:all").catch(() => {});
      redis.del(`articles:slug:${article.slug}`).catch(() => {});
    }

    res.json(updatedArticle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE /api/articles/:id (unchanged)
export const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    if (redis) {
      await redis.del("articles:all");
    }
    if (redis) {
      await redis.del(`articles:slug:${article.slug}`);
    }

    res.json({ message: "Article deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};