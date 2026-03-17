const mongoose = require("mongoose");

const indicatorSchema = new mongoose.Schema({
  indicator: String,
  reason: String,
});

const threatSchema = new mongoose.Schema(
  {
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reporterName: String,
    reporterSegment: { type: String, default: "other" },
    reporterLocation: { type: String, default: "" },
    reporterLocationNormalized: { type: String, default: "", index: true },
    input: { type: String, required: true },
    inputFingerprint: { type: String, default: "", index: true },
    contextText: String,
    inputType: {
      type: String,
      enum: ["url", "email", "message", "prompt", "screenshot"],
      required: true,
    },
    screenshotMeta: {
      mimeType: String,
      size: Number,
    },
    riskLevel: {
      type: String,
      enum: ["HIGH", "MEDIUM", "LOW", "SAFE"],
      required: true,
    },
    riskScore: { type: Number, min: 0, max: 100 },
    threatType: String,
    targetedService: { type: String, default: "Unknown Service" },
    confidence: Number,
    suspiciousIndicators: [indicatorSchema],
    explanation: String,
    recommendedAction: String,
    isReported: { type: Boolean, default: false, index: true },
    reportedAt: Date,
    reportNotes: String,
    technicalDetails: {
      attackVector: String,
      targetedVulnerability: String,
      mitreTechnique: String,
    },
    severityJustification: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Threat", threatSchema);
