import WellBeing from "../models/WellBeing.js";

// CREATE
export const createWellBeing = async (req, res) => {
  try {
    const item = await WellBeing.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// GET ALL
export const getAllWellBeing = async (req, res) => {
  try {
    const items = await WellBeing.find({ isPublished: true })
      .select("title slug image seo")
      .sort({ createdAt: -1 });

    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET BY SLUG
export const getWellBeingBySlug = async (req, res) => {
  try {
    const item = await WellBeing.findOne({
      slug: req.params.slug,
      isPublished: true,
    }).populate("category");

    if (!item) {
      return res.status(404).json({ message: "Well-being topic not found" });
    }

    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE (hooks safe)
export const updateWellBeing = async (req, res) => {
  try {
    const item = await WellBeing.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Well-being topic not found" });
    }

    Object.assign(item, req.body);
    await item.save();

    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE
export const deleteWellBeing = async (req, res) => {
  try {
    const item = await WellBeing.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Well-being topic not found" });
    }

    res.json({ message: "Well-being deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
