// backend/models/AcademicLedger.js
import mongoose from "mongoose";

const AcademicLedgerSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    prn: { type: String, required: true },
    studentName: { type: String },
    studentEmail: { type: String },
    
    // credit details
    courseName: { type: String, required: true },
    platform: { type: String, default: "University" }, // NPTEL / Coursera / Internal
    credits: { type: Number, required: true },
    sourceType: { type: String, enum: ["External", "Internal"], default: "External" },
    
    // blockchain linkage
    blockchainHash: { type: String, default: "" },
    
    status: {
      type: String,
      enum: ["Approved", "Pending", "Rejected"],
      default: "Approved",
    },
  },
  { timestamps: true }
);

export default mongoose.model("AcademicLedger", AcademicLedgerSchema, "academic_ledger");
