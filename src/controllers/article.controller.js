import Article from "../models/Article.js";
import redis from "../config/redis.js";

// POST /api/articles (unchanged)
// export const createArticle = async (req, res) => {
//   try {
//     const article = await Article.create(req.body);
//     if (redis) {
//       await redis.del("articles:all");
//     }
//     res.status(201).json(article);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

export const createArticle = async (req, res) => {
  try {
    let articleData = { ...req.body };
    console.log("Backend: Creating article with title:", articleData.title); // Debug log

    // Generate slug if not provided
    if (!articleData.slug) {
      articleData.slug = slugify(articleData.title, {
        lower: true,
        strict: true,
      });
    }
    console.log("Backend: Generated slug:", articleData.slug); // Log slug

    // Try create, regenerate on unique error
    let article;
    let attempts = 0;
    const maxAttempts = 10; // Increased for safety
    while (attempts < maxAttempts) {
      try {
        article = await Article.create(articleData);
        console.log(
          `Backend: Article created successfully with slug: ${article.slug}, ID: ${article._id}`
        ); // Success log
        break;
      } catch (error) {
        console.error(
          `Backend: Create attempt ${attempts + 1} failed:`,
          error.message
        ); // Error log
        if (error.code === 11000 && error.keyPattern.slug) {
          // Unique slug error
          attempts++;
          const baseSlug = articleData.slug;
          articleData.slug = `${baseSlug}-${attempts}`;
          console.log(
            `Backend: Duplicate slug detected, regenerating: ${baseSlug} → ${articleData.slug}`
          );
        } else {
          throw error; // Other errors
        }
      }
    }

    if (!article) {
      console.error("Backend: Failed to create after all attempts");
      return res
        .status(400)
        .json({
          message: "Failed to create unique article after multiple attempts",
        });
    }

    // Clear cache
    if (redis) {
      await redis.del("articles:all");
      console.log("Backend: Cache cleared for articles:all");
    }

    // Return populated article
    const populatedArticle = await Article.findById(article._id).populate(
      "category",
      "name"
    );
    console.log(
      "Backend: Returning populated article:",
      populatedArticle.title
    );
    res.status(201).json(populatedArticle);
  } catch (error) {
    console.error("💥 Backend: Full Create Error:", error); // Full error log
    res.status(400).json({ message: error.message });
  }
};

// GET /api/articles – Populate add kiya category ke liye
export const getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find({ isPublished: true })
      .populate("category", "name") // Yeh add kar do – sirf name fetch karega, fast rahega
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
    }).populate("category", "name"); // Yeh add kar do

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
    const article = await Article.findById(req.params.id).populate(
      "category",
      "name"
    ); // Yeh add kar do

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
    const updatedArticle = await Article.findById(article._id).populate(
      "category",
      "name"
    );

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
