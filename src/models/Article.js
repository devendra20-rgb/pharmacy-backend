import mongoose from "mongoose";
import slugify from "slugify";

const ArticleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },

    slug: { type: String, unique: true, index: true },

    sections: [
      {
        heading: { type: String, required: true },
        slug: { type: String, index: true },

        content: { type: String, required: true }, // HTML / Markdown

        bullets: [{ type: String }],

        image: {
          url: String,
          alt: String,
        },
      },
    ],

    // 🔹 FEATURE IMAGE (CDN URL)
    image: {
      url: { type: String }, // CDN URL
      alt: { type: String }, // SEO alt text
      caption: { type: String }, // Optional
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      index: true,
    },

    type: {
      type: String,
      enum: ["article", "news"],
      default: "article",
    },

    author: {
      name: String,
      specialization: String,
      qualification: String,
    },

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

// 🔹 Slug + SEO + Image ALT fallback
ArticleSchema.pre("save", function (next) {
  if (!this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }

  if (!this.seo?.metaTitle) {
    this.seo.metaTitle = this.title;
  }

  // 🔥 metaDescription from first section
  if (!this.seo?.metaDescription && this.sections?.length > 0) {
    const plainText = this.sections[0].content.replace(/<[^>]+>/g, "");
    this.seo.metaDescription = plainText.substring(0, 160);
  }

  if (this.image?.url && !this.image.alt) {
    this.image.alt = this.title;
  }

  // 🔥 auto section slug
  this.sections = this.sections.map((section) => ({
    ...section,
    slug: section.slug || slugify(section.heading, { lower: true, strict: true }),
  }));

  next();
});


export default mongoose.model("Article", ArticleSchema);
