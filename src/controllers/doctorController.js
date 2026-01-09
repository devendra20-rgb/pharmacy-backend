import Doctor from "../models/Doctor.js";
import redis from "../config/redis.js";

// POST /api/doctors
export const createDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.create(req.body);
    if (redis) {
      await redis.del("doctors:all");
    }
    res.status(201).json(doctor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET /api/doctors
export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({ isActive: true }).sort({
      createdAt: -1,
    });

    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET by SLUG (SEO)
export const getDoctorBySlug = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({
      slug: req.params.slug,
      isActive: true,
    });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET by ID (admin/internal)
export const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/doctors/:id
export const updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    if (redis) {
      await redis.del("doctors:all");
      await redis.del(`doctors:slug:${doctor.slug}`);
    }
    res.json(doctor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE /api/doctors/:id
export const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    if (redis) {
      await redis.del("doctors:all");
      await redis.del(`doctors:slug:${doctor.slug}`);
    }
    res.json({ message: "Doctor deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
