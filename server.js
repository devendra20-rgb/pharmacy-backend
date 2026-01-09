import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";  // Yeh import add kar do

import articleRoutes from "./src/routes/articleRoutes.js";
import categoryRoutes from "./src/routes/categoryRoutes.js";
import diseaseRoutes from "./src/routes/diseaseRoutes.js";
import doctorRoutes from "./src/routes/doctorRoutes.js";
import conditionRoutes from "./src/routes/conditionRoutes.js";
import wellbeingRoutes from "./src/routes/wellBeingRoutes.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:3002',  
  credentials: true, 
}));

app.use(express.json());

app.use("/api/articles", articleRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/diseases", diseaseRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/conditions", conditionRoutes);
app.use("/api/well-being", wellbeingRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("🚀 Server running on port " + PORT);
});