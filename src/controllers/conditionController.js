import Condition from "../models/Condition.js";

// POST /api/conditions
export const createCondition = async (req, res) => {
  try {
    const condition = await Condition.create(req.body);
    res.status(201).json(condition);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// GET /api/conditions
export const getAllConditions = async (req, res) => {
  try {
    const conditions = await Condition.find({ isPublished: true })
      .select("name slug image seo")
      .sort({ createdAt: -1 });

    res.json(conditions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/conditions/:slug
export const getConditionBySlug = async (req, res) => {
  try {
    const condition = await Condition.findOne({
      slug: req.params.slug,
      isPublished: true,
    }).populate("category");

    if (!condition) {
      return res.status(404).json({ message: "Condition not found" });
    }

    res.json(condition);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/conditions/:id
export const updateCondition = async (req, res) => {
  try {
    const condition = await Condition.findById(req.params.id);

    if (!condition) {
      return res.status(404).json({ message: "Condition not found" });
    }

    Object.assign(condition, req.body);
    await condition.save(); // 🔥 hooks run

    res.json(condition);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


// DELETE /api/conditions/:id
export const deleteCondition = async (req, res) => {
  try {
    const condition = await Condition.findByIdAndDelete(req.params.id);

    if (!condition) {
      return res.status(404).json({ message: "Condition not found" });
    }

    res.json({ message: "Condition deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
