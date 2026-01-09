import mongoose from "mongoose";
import slugify from "slugify";

const DoctorSchema = new mongoose.Schema(
  {
    // 🔹 BASIC INFO
    name: { type: String, required: true, trim: true },

    slug: { type: String, unique: true, index: true },
    
    specialization: {
      type: String,
      required: true,
      index: true,
    },

    qualification: { type: String }, // MBBS, MD, DM
    experience: { type: Number }, // years

    // 🔹 WORK INFO
    hospital: { type: String },
    city: { type: String, index: true },

    // 🔹 LOCATION (OPTIONAL BUT IMPORTANT)
    location: {
      address: { type: String },
      area: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String },
      pincode: { type: String },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },

    // 🔹 CONTACT INFO (OPTIONAL)
    contact: {
      phone: { type: String },
      email: { type: String },
    },

    // 🔹 CONSULTATION / MEETING TIME
    availability: {
      days: [{ type: String }], // ["Mon", "Tue", "Wed"]
      timeFrom: { type: String }, // "10:00 AM"
      timeTo: { type: String },   // "05:00 PM"
    },

    // 🔹 AREAS OF EXPERTISE
    expertise: [{ type: String, index: true }], // heart failure, angioplasty

    // 🔹 CERTIFICATIONS & LICENSE
    certifications: [{ type: String }],
    licenseNumber: { type: String },

    // 🔹 LANGUAGES SPOKEN
    languages: [{ type: String }], // Hindi, English

    // 🔹 ABOUT DOCTOR
    bio: { type: String },

    // 🔹 PROFILE IMAGE (CDN URL)
    image: {
      url: { type: String },
      alt: { type: String },
    },

    // 🔹 SEO BLOCK
    seo: {
      metaTitle: { type: String },
      metaDescription: { type: String },
      keywords: [{ type: String }],
    },

    // 🔹 TAGS (SEARCH / FILTER)
    tags: [{ type: String, index: true }],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// 🔹 SLUG + SEO + IMAGE FALLBACKS
DoctorSchema.pre("save", function (next) {
  if (!this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }

  if (!this.seo?.metaTitle) {
    this.seo.metaTitle = `${this.name} | ${this.specialization}`;
  }

  if (!this.seo?.metaDescription && this.bio) {
    this.seo.metaDescription = this.bio.substring(0, 160);
  }

  if (this.image?.url && !this.image.alt) {
    this.image.alt = this.name;
  }

  next();
});

export default mongoose.model("Doctor", DoctorSchema);
