import mongoose from "mongoose";
import slugify from "slugify";

/* 🔹 INNER BLOCK */
const ContentBlockSchema = new mongoose.Schema(
  {
    heading: { type: String, required: true },
    slug: { type: String, index: true },

    content: { type: String, required: true }, // HTML / text

    bullets: [{ type: String }],

    image: {
      url: String,
      alt: String,
      caption: String,
    },
  },
  { _id: false }
);

/* 🔹 SECTION */
const SectionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // Overview, Tips, Benefits
    slug: { type: String, index: true },

    blocks: [ContentBlockSchema],
  },
  { _id: false }
);

/* 🔹 MAIN WELL-BEING SCHEMA */
const WellBeingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
      index: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      index: true,
    },

    image: {
      url: String,
      alt: String,
      caption: String,
    },

    sections: [SectionSchema],

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

/* 🔹 HOOKS */
WellBeingSchema.pre("save", function (next) {
  if (!this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }

  if (!this.seo?.metaTitle) {
    this.seo.metaTitle = this.title;
  }

  if (!this.seo?.metaDescription && this.sections?.length > 0) {
    const text =
      this.sections[0]?.blocks?.[0]?.content || "";
    this.seo.metaDescription = text
      .replace(/<[^>]+>/g, "")
      .substring(0, 160);
  }

  if (this.image?.url && !this.image.alt) {
    this.image.alt = this.title;
  }

  this.sections = this.sections.map((s) => ({
    ...s,
    slug: s.slug || slugify(s.title, { lower: true, strict: true }),
    blocks: s.blocks.map((b) => ({
      ...b,
      slug: b.slug || slugify(b.heading, { lower: true, strict: true }),
    })),
  }));

  next();
});

export default mongoose.model("WellBeing", WellBeingSchema);
