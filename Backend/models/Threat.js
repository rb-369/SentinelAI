const mongoose = require("mongoose");

const indicatorSchema = new mongoose.Schema({
  indicator: String,
  reason: String,
});

const threatSchema = new mongoose.Schema(
  {
    input: { type: String, required: true },
    inputType: {
      type: String,
      enum: ["url", "email", "message", "prompt"],
      required: true,
    },
    riskLevel: {
      type: String,
      enum: ["HIGH", "MEDIUM", "LOW", "SAFE"],
      required: true,
    },
    riskScore: { type: Number, min: 0, max: 100 },
    threatType: String,
    confidence: Number,
    suspiciousIndicators: [indicatorSchema],
    explanation: String,
    recommendedAction: String,
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
