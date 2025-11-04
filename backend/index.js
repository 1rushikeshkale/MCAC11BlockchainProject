// backend/index.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/authRoutes.js";
import creditsRoutes from "./routes/credits.js"; // ✅ Credits routes
import ledgerRoutes from "./routes/ledgerRoutes.js"; // ✅ NEW - Academic Ledger routes

dotenv.config();
const app = express();

// ================= Middleware =================
app.use(cors());
app.use(express.json());

// ✅ Serve uploaded certificates (PDF/Image)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ================= MongoDB Connection =================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ Mongo Error:", err));

// ================= Routes =================
app.use("/api/auth", authRoutes);
app.use("/api/credits", creditsRoutes); // ✅ Credit routes
app.use("/api/ledger", ledgerRoutes);   // ✅ NEW Academic Ledger routes

// ================= Default Route =================
app.get("/", (req, res) => {
  res.send("🎓 Blockchain Academic Credit & Certificate Verification API is running...");
});

// ================= Start Server =================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
