// backend/routes/ledgerRoutes.js
import express from "express";
import AcademicLedger from "../models/AcademicLedger.js";

const router = express.Router();

// Get all ledger entries
router.get("/", async (req, res) => {
  try {
    const data = await AcademicLedger.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Get specific student's ledger by PRN
router.get("/student/:prn", async (req, res) => {
  try {
    const entries = await AcademicLedger.find({ prn: req.params.prn }).sort({ createdAt: -1 });
    const totalCredits = entries.reduce((sum, e) => sum + e.credits, 0);
    res.json({ totalCredits, entries });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
