import Disease from "../models/Disease.js";
import redis from "../config/redis.js";

// POST /api/diseases
export const createDisease = async (req, res) => {
  try {
    const disease = await Disease.create(req.body);
    if (redis) {
      await redis.del("diseases:all");
    }
    res.status(201).json(disease);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET /api/diseases
export const getAllDiseases = async (req, res) => {
  try {
    const diseases = await Disease.find({ isPublished: true })
      .populate("category")
      .sort({ createdAt: -1 });

    res.json(diseases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET by SLUG (SEO)
export const getDiseaseBySlug = async (req, res) => {
  try {
    const disease = await Disease.findOne({
      slug: req.params.slug,
      isPublished: true,
    }).populate("category");

    if (!disease) {
      return res.status(404).json({ message: "Disease not found" });
    }

    res.json(disease);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET by ID (admin/internal)
export const getDiseaseById = async (req, res) => {
  try {
    const disease = await Disease.findById(req.params.id).populate("category");

    if (!disease) {
      return res.status(404).json({ message: "Disease not found" });
    }

    res.json(disease);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/diseases/:id
export const updateDisease = async (req, res) => {
  try {
    const disease = await Disease.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!disease) {
      return res.status(404).json({ message: "Disease not found" });
    }
    if (redis) {
      await redis.del("diseases:all");
      await redis.del(`diseases:slug:${disease.slug}`);
    }
    res.json(disease);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE /api/diseases/:id
export const deleteDisease = async (req, res) => {
  try {
    const disease = await Disease.findByIdAndDelete(req.params.id);

    if (!disease) {
      return res.status(404).json({ message: "Disease not found" });
    }
    if (redis) {
      await redis.del("diseases:all");
      await redis.del(`diseases:slug:${disease.slug}`);
    }
    res.json({ message: "Disease deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
