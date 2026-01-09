import mongoose from "mongoose";
import slugify from "slugify";

/* 🔹 INNER CONTENT (Heading + Content) */
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

/* 🔹 SECTION (Overview, Symptoms, Treatment...) */
const SectionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // Overview, Symptoms, etc.
    slug: { type: String, index: true },

    blocks: [ContentBlockSchema], // 🔥 multiple heading+content
  },
  { _id: false }
);

/* 🔹 MAIN CONDITION SCHEMA */
const ConditionSchema = new mongoose.Schema(
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

    // 🔥 WebMD style structure
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

/* 🔹 Hooks */
ConditionSchema.pre("save", function (next) {
  if (!this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }

  if (!this.seo?.metaTitle) {
    this.seo.metaTitle = this.name;
  }

  if (!this.seo?.metaDescription && this.sections?.length > 0) {
    const firstBlock =
      this.sections[0]?.blocks?.[0]?.content || "";
    this.seo.metaDescription = firstBlock
      .replace(/<[^>]+>/g, "")
      .substring(0, 160);
  }

  if (this.image?.url && !this.image.alt) {
    this.image.alt = this.name;
  }

  // auto slugs
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

export default mongoose.model("Condition", ConditionSchema);
