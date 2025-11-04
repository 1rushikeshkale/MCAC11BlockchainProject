// backend/routes/credits.js
import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import Credit from "../models/Credit.js";
import User from "../models/User.js";
import AcademicLedger from "../models/AcademicLedger.js";
import { getBlockchain } from "../utils/blockchain.js"; // ✅ blockchain helper import

const router = express.Router();

// __dirname setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const safeName = Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
    cb(null, safeName);
  },
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// credit calculation helper
function calcCreditsFromWeeks(weeks) {
  // Accept "4", "8", "12" or "4 weeks", "8 Weeks", etc.
  const w = String(weeks || "").trim().toLowerCase();
  if (w.startsWith("12")) return 3;
  if (w.startsWith("8")) return 2;
  if (w.startsWith("4")) return 1;
  return 0;
}

// normalize type helper
function normalizeType(rawType, doc = {}) {
  const t = String(rawType || "").trim().toLowerCase();
  if (t === "internal" || t === "external") return t;

  // Fallback heuristic: if subject-like platform present that's not a MOOC, treat as internal
  const platform = String(doc.platform || "").toLowerCase();
  const knownMoocs = ["nptel", "swayam", "coursera", "edx", "ed x", "nptel (swayam)"];
  const isMooc = knownMoocs.some((k) => platform.includes(k));
  return isMooc ? "external" : "internal";
}

function labelTypeLowerToTitle(t) {
  // "internal" -> "Internal", "external" -> "External"
  if (!t) return "External";
  return t.charAt(0).toUpperCase() + t.slice(1);
}

/* ======================== ROUTES ======================== */

// ✅ Upload Certificate (Student uploads PDF/Image)
router.post("/upload", upload.single("certificate"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: "No certificate uploaded" });

    const { studentId, platform, courseName } = req.body;
    // duration expected as "4" | "8" | "12"
    let { duration, creditType } = req.body;

    const user = await User.findById(studentId).lean();
    if (!user) return res.status(404).json({ msg: "User not found" });

    // Normalize duration to numeric string only
    if (typeof duration === "string") {
      const match = duration.match(/\d+/);
      duration = match ? match[0] : ""; // "4" | "8" | "12"
    } else if (typeof duration === "number") {
      duration = String(duration);
    } else {
      duration = "";
    }

    const credits = calcCreditsFromWeeks(duration);
    if (!credits) {
      return res.status(400).json({ msg: "Invalid duration for credits" });
    }

    // Normalize creditType
    const normalizedType = normalizeType(creditType, { platform });

    const credit = new Credit({
      studentId,
      studentName: user.name,
      studentEmail: user.email,
      prn: user.prn,
      platform, // For internal you are storing subject here (as per current UI)
      courseName,
      duration, // store numeric value only -> frontend displays "weeks"
      credits,
      certificateUrl: `uploads/${req.file.filename}`,
      status: "Pending",
      creditType: normalizedType, // ✅ store normalized internal/external
    });

    await credit.save();
    res.json(credit);
  } catch (err) {
    console.error("❌ Upload error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// ✅ Get All Requests (Admin)
router.get("/requests", async (req, res) => {
  try {
    const docs = await Credit.find().sort({ createdAt: -1 });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// ✅ Approve Credit Request (Admin Approval + Blockchain + Ledger)
router.post("/:id/approve", async (req, res) => {
  try {
    console.log("📥 Approve request received for ID:", req.params.id);

    const credit = await Credit.findById(req.params.id);
    if (!credit) return res.status(404).json({ msg: "Request not found" });

    // Update credit status
    credit.status = "Approved";
    await credit.save();
    console.log("✅ Credit marked as Approved in MongoDB");

    // ✅ Update student's totalCredits
    const user = await User.findById(credit.studentId);
    if (user) {
      user.totalCredits = (user.totalCredits || 0) + credit.credits;
      await user.save();
      console.log("✅ User total credits updated:", user.totalCredits);
    }

    // ✅ Blockchain Integration
    const { contract } = getBlockchain();
    const randomToken = Math.random().toString(36).substring(2, 12);
    const fileHash = credit.certificateUrl || "NoHash";

    console.log("⛓️ Sending transaction to blockchain...");
    const tx = await contract.issueCertificateFileOnly(randomToken, fileHash);
    const receipt = await tx.wait();
    console.log("✅ Blockchain TX done:", receipt.hash);

    // ✅ Save to Academic Ledger (use actual type)
    const sourceType = labelTypeLowerToTitle(credit.creditType); // "Internal" | "External"
    const ledgerEntry = new AcademicLedger({
      studentId: credit.studentId,
      prn: credit.prn,
      studentName: credit.studentName,
      studentEmail: credit.studentEmail,
      courseName: credit.courseName,
      platform: credit.platform,
      credits: credit.credits,
      sourceType, // ✅ reflects real type now
      blockchainHash: receipt.hash,
    });
    await ledgerEntry.save();
    console.log("✅ Ledger entry added successfully");

    res.json({
      msg: "✅ Credit approved and recorded on blockchain",
      txHash: receipt.hash,
      credit,
      ledgerEntry,
    });
  } catch (err) {
    console.error("❌ Approve error:", err);
    res.status(500).json({ msg: "Server/Blockchain error", error: err.message });
  }
});

// ✅ Reject Credit Request
router.post("/:id/reject", async (req, res) => {
  try {
    const { reason } = req.body || {};
    const c = await Credit.findById(req.params.id);
    if (!c) return res.status(404).json({ msg: "Request not found" });

    c.status = "Rejected";
    c.rejectReason = reason || "";
    await c.save();

    res.json(c);
  } catch (err) {
    console.error("❌ Reject error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// ✅ Get All Credits by Student (Student Dashboard)
router.get("/student/:studentId", async (req, res) => {
  try {
    const docs = await Credit.find({ studentId: req.params.studentId }).sort({ createdAt: -1 });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;