import mongoose from "mongoose";
import slugify from "slugify";

const DiseaseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
      index: true,
    },

    overview: {
      type: String,
      required: true,
    },

    symptoms: [{ type: String }],

    causes: String,
    diagnosis: String,
    treatment: String,
    prevention: String,

    // 🔹 Category (merge with Category API)
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      index: true,
    },

    // 🔹 SEO block (VERY IMPORTANT)
    seo: {
      metaTitle: String,
      metaDescription: String,
      keywords: [{ type: String }],
    },

    tags: [{ type: String, index: true }],

    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// 🔹 Auto slug + SEO fallback
DiseaseSchema.pre("save", function (next) {
  if (!this.slug) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
    });
  }

  if (!this.seo?.metaTitle) {
    this.seo = {
      ...this.seo,
      metaTitle: this.name,
    };
  }

  if (!this.seo?.metaDescription && this.overview) {
    this.seo = {
      ...this.seo,
      metaDescription: this.overview.substring(0, 160),
    };
  }

  next();
});

export default mongoose.model("Disease", DiseaseSchema);
