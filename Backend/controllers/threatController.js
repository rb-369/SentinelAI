const Threat = require("../models/Threat");
const axios = require("axios");

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://127.0.0.1:8000";

exports.analyzeThreat = async (req, res) => {
  try {
    const { input, inputType } = req.body;
    if (!input || !inputType) {
      return res.status(400).json({ error: "input and inputType are required" });
    }

    const aiResponse = await axios.post(`${AI_SERVICE_URL}/analyze`, {
      input,
      inputType,
    });

    const analysisData = aiResponse.data.data;

    const threat = await Threat.create({
      input,
      inputType,
      ...analysisData,
    });

    return res.status(201).json({ success: true, data: threat });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: err.message });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const { page = 1, limit = 20, riskLevel, inputType } = req.query;
    const filter = {};
    if (riskLevel) filter.riskLevel = riskLevel;
    if (inputType) filter.inputType = inputType;

    const threats = await Threat.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Threat.countDocuments(filter);

    return res.json({
      success: true,
      data: threats,
      pagination: { page: Number(page), limit: Number(limit), total },
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const stats = await Threat.aggregate([
      {
        $group: {
          _id: "$riskLevel",
          count: { $sum: 1 },
          avgScore: { $avg: "$riskScore" },
        },
      },
    ]);

    const total = await Threat.countDocuments();
    const recent = await Threat.find().sort({ createdAt: -1 }).limit(5);

    return res.json({ success: true, data: { breakdown: stats, total, recent } });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.deleteHistory = async (req, res) => {
  try {
    await Threat.deleteMany({});
    return res.json({ success: true, message: "History cleared" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
