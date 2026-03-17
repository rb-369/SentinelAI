const mongoose = require("mongoose");
const Threat = require("../models/Threat");
const axios = require("axios");

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://127.0.0.1:8000";
const SUPPORTED_INPUT_TYPES = ["url", "email", "message", "prompt"];
const AREA_RECENT_LIMIT = 8;

const SERVICE_HINTS = [
  { pattern: /amazon|amzn|aws/, label: "Amazon Accounts" },
  { pattern: /google|gmail|gpay/, label: "Google Accounts" },
  { pattern: /microsoft|outlook|office365|azure/, label: "Microsoft Accounts" },
  { pattern: /apple|icloud|itunes/, label: "Apple Accounts" },
  { pattern: /facebook|instagram|meta|whatsapp/, label: "Meta Accounts" },
  { pattern: /paypal/, label: "PayPal" },
  { pattern: /netflix/, label: "Netflix" },
  { pattern: /statebank|sbi/, label: "SBI Accounts" },
  { pattern: /hdfc/, label: "HDFC Accounts" },
  { pattern: /icici/, label: "ICICI Accounts" },
  { pattern: /axisbank|axis/, label: "Axis Bank Accounts" },
  { pattern: /phonepe/, label: "PhonePe" },
  { pattern: /paytm/, label: "Paytm" },
  { pattern: /upi/, label: "UPI Payment Accounts" },
];

const getUserFilter = (req) => {
  if (req.user?._id) {
    return { createdBy: req.user._id };
  }
  return {};
};

const normalizeWhitespace = (value) => String(value || "").toLowerCase().replace(/\s+/g, " ").trim();

const normalizeLocation = (value) => normalizeWhitespace(value).replace(/[^a-z0-9\s]/g, "");

const escapeRegExp = (value) => String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const titleCase = (value) =>
  String(value || "")
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1).toLowerCase())
    .join(" ");

const extractDomain = (rawInput) => {
  const safeInput = String(rawInput || "").trim();
  if (!safeInput) return "";

  const withProtocol = /^https?:\/\//i.test(safeInput) ? safeInput : `https://${safeInput}`;
  try {
    const parsed = new URL(withProtocol);
    return parsed.hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    const match = safeInput.match(/([a-z0-9-]+\.)+[a-z]{2,}/i);
    return match ? match[0].toLowerCase().replace(/^www\./, "") : "";
  }
};

const normalizeInputForFingerprint = (input, inputType) => {
  const safeInput = String(input || "").trim();
  if (!safeInput) return "";

  if (inputType === "url") {
    const domain = extractDomain(safeInput);
    if (domain) {
      const withProtocol = /^https?:\/\//i.test(safeInput) ? safeInput : `https://${safeInput}`;
      try {
        const parsed = new URL(withProtocol);
        const path = parsed.pathname.replace(/\/+$/, "").toLowerCase();
        const query = parsed.search.toLowerCase();
        return `${domain}${path}${query}`.slice(0, 400);
      } catch {
        return domain.slice(0, 400);
      }
    }
  }

  return normalizeWhitespace(safeInput).replace(/[^a-z0-9\s:@./_-]/g, "").slice(0, 400);
};

const extractTargetedService = (input, inputType) => {
  const safeInput = normalizeWhitespace(input);
  if (!safeInput) return "Unknown Service";

  for (const hint of SERVICE_HINTS) {
    if (hint.pattern.test(safeInput)) {
      return hint.label;
    }
  }

  if (inputType === "url" || inputType === "email" || inputType === "message") {
    const domain = extractDomain(input);
    if (domain) {
      const domainBase = domain.split(".")[0] || domain;
      const serviceName = titleCase(domainBase);
      return serviceName ? `${serviceName} Accounts` : "Unknown Service";
    }
  }

  return "Unknown Service";
};

const buildCommunityIntelligence = async ({ inputFingerprint, requesterId }) => {
  const safeFingerprint = String(inputFingerprint || "").trim();
  if (!safeFingerprint) {
    return {
      hasCommunityMatch: false,
      reportCount: 0,
      otherUsersCount: 0,
      firstReported: null,
      mostTargetedService: "N/A",
      threatTypeBreakdown: [],
      reportedBy: [],
    };
  }

  const matchFilter = { inputFingerprint: safeFingerprint, isReported: true };
  const [
    reportCount,
    firstReportedDoc,
    targetedServiceRows,
    threatTypeRows,
    reportedByRows,
    otherUsersCount,
  ] = await Promise.all([
    Threat.countDocuments(matchFilter),
    Threat.findOne(matchFilter).sort({ reportedAt: 1, createdAt: 1 }).select("reportedAt createdAt"),
    Threat.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: { $ifNull: ["$targetedService", "Unknown Service"] },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]),
    Threat.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: { $ifNull: ["$threatType", "Unknown"] },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]),
    Threat.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: { $ifNull: ["$reporterSegment", "other"] },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ]),
    requesterId ? Threat.countDocuments({ ...matchFilter, createdBy: { $ne: requesterId } }) : 0,
  ]);

  return {
    hasCommunityMatch: reportCount > 0,
    reportCount,
    otherUsersCount,
    firstReported: firstReportedDoc ? firstReportedDoc.reportedAt || firstReportedDoc.createdAt : null,
    mostTargetedService: targetedServiceRows[0]?._id || "N/A",
    threatTypeBreakdown: threatTypeRows.map((row) => ({ threatType: row._id, count: row.count })),
    reportedBy: reportedByRows.map((row) => ({ segment: row._id, count: row.count })),
  };
};

const buildAreaFilter = (location) => {
  const safeLocation = String(location || "").trim();
  const normalized = normalizeLocation(safeLocation);
  if (!safeLocation || !normalized) return null;

  return {
    location: safeLocation,
    normalized,
    match: {
      isReported: true,
      $or: [
        { reporterLocationNormalized: normalized },
        { reporterLocation: new RegExp(`^${escapeRegExp(safeLocation)}$`, "i") },
      ],
    },
  };
};

const getAreaIntelligenceData = async (location) => {
  const locationConfig = buildAreaFilter(location);
  if (!locationConfig) {
    return {
      location: "",
      totalReports: 0,
      recentReportCount: 0,
      topScams: [],
      targetedServices: [],
      recentIncidents: [],
    };
  }

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const { location: safeLocation, normalized, match } = locationConfig;

  const [totalReports, recentCountRows, topScamRows, targetedServiceRows, recentIncidents] = await Promise.all([
    Threat.countDocuments(match),
    Threat.aggregate([
      { $match: match },
      { $addFields: { reportMoment: { $ifNull: ["$reportedAt", "$createdAt"] } } },
      { $match: { reportMoment: { $gte: sevenDaysAgo } } },
      { $count: "count" },
    ]),
    Threat.aggregate([
      { $match: match },
      {
        $group: {
          _id: { $ifNull: ["$threatType", "Unknown"] },
          count: { $sum: 1 },
          highRiskCount: {
            $sum: {
              $cond: [{ $eq: ["$riskLevel", "HIGH"] }, 1, 0],
            },
          },
          avgRiskScore: { $avg: "$riskScore" },
        },
      },
      { $sort: { count: -1, highRiskCount: -1 } },
      { $limit: 6 },
    ]),
    Threat.aggregate([
      { $match: match },
      {
        $group: {
          _id: { $ifNull: ["$targetedService", "Unknown Service"] },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]),
    Threat.aggregate([
      { $match: match },
      { $addFields: { reportMoment: { $ifNull: ["$reportedAt", "$createdAt"] } } },
      { $sort: { reportMoment: -1 } },
      { $limit: AREA_RECENT_LIMIT },
      {
        $project: {
          _id: 1,
          threatType: { $ifNull: ["$threatType", "Unknown"] },
          riskLevel: 1,
          targetedService: { $ifNull: ["$targetedService", "Unknown Service"] },
          reporterSegment: { $ifNull: ["$reporterSegment", "other"] },
          reportTime: "$reportMoment",
          inputPreview: { $substrCP: ["$input", 0, 130] },
        },
      },
    ]),
  ]);

  return {
    location: safeLocation,
    normalizedLocation: normalized,
    totalReports,
    recentReportCount: recentCountRows[0]?.count || 0,
    topScams: topScamRows.map((row) => ({
      threatType: row._id,
      count: row.count,
      highRiskCount: row.highRiskCount,
      avgRiskScore: Math.round(Number(row.avgRiskScore) || 0),
    })),
    targetedServices: targetedServiceRows.map((row) => ({ service: row._id, count: row.count })),
    recentIncidents,
  };
};

exports.analyzeThreat = async (req, res) => {
  try {
    const { input, inputType } = req.body;
    if (!input || !inputType) {
      return res.status(400).json({ error: "input and inputType are required" });
    }

    if (!SUPPORTED_INPUT_TYPES.includes(inputType)) {
      return res.status(400).json({ error: "inputType must be url, email, message, or prompt" });
    }

    const aiResponse = await axios.post(`${AI_SERVICE_URL}/analyze`, {
      input,
      inputType,
    });

    const analysisData = aiResponse.data?.data;
    if (!analysisData || typeof analysisData !== "object") {
      return res.status(502).json({ error: "Invalid response from AI service" });
    }

    const inputFingerprint = normalizeInputForFingerprint(input, inputType);
    const threat = await Threat.create({
      createdBy: req.user?._id,
      reporterName: req.user?.name,
      reporterSegment: req.user?.userType || "other",
      reporterLocation: String(req.user?.location || "").trim(),
      reporterLocationNormalized: normalizeLocation(req.user?.location),
      input,
      inputFingerprint,
      inputType,
      targetedService: extractTargetedService(input, inputType),
      ...analysisData,
      isReported: false,
    });

    const communityIntelligence = await buildCommunityIntelligence({
      inputFingerprint,
      requesterId: req.user?._id,
    });

    const responseThreat = threat.toObject();
    responseThreat.communityIntelligence = communityIntelligence;

    return res.status(201).json({ success: true, data: responseThreat });
  } catch (err) {
    const message = err.response?.data?.detail || err.response?.data?.error || err.message;
    return res.status(500).json({ error: message });
  }
};

exports.analyzeScreenshot = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "screenshot file is required" });
    }

    const formData = new FormData();
    const blob = new Blob([req.file.buffer], {
      type: req.file.mimetype || "image/png",
    });

    formData.append("screenshot", blob, req.file.originalname || "screenshot.png");
    if (req.body?.contextText) {
      formData.append("contextText", String(req.body.contextText));
    }

    const aiResponse = await fetch(`${AI_SERVICE_URL}/analyze-screenshot`, {
      method: "POST",
      body: formData,
    });

    const aiPayload = await aiResponse.json().catch(() => ({}));
    if (!aiResponse.ok) {
      return res
        .status(aiResponse.status)
        .json({ error: aiPayload.detail || aiPayload.error || "Screenshot analysis failed" });
    }

    const analysisData = aiPayload?.data;
    if (!analysisData || typeof analysisData !== "object") {
      return res.status(502).json({ error: "Invalid response from AI screenshot service" });
    }

    const fingerprintSource = req.body?.contextText || req.file.originalname || "uploaded-screenshot";
    const inputFingerprint = normalizeInputForFingerprint(fingerprintSource, "message");

    const threat = await Threat.create({
      createdBy: req.user?._id,
      reporterName: req.user?.name,
      reporterSegment: req.user?.userType || "other",
      reporterLocation: String(req.user?.location || "").trim(),
      reporterLocationNormalized: normalizeLocation(req.user?.location),
      input: req.file.originalname || "uploaded-screenshot",
      inputFingerprint,
      contextText: req.body?.contextText || "",
      inputType: "screenshot",
      screenshotMeta: {
        mimeType: req.file.mimetype,
        size: req.file.size,
      },
      targetedService: extractTargetedService(fingerprintSource, "message"),
      ...analysisData,
      isReported: false,
    });

    const communityIntelligence = await buildCommunityIntelligence({
      inputFingerprint,
      requesterId: req.user?._id,
    });

    const responseThreat = threat.toObject();
    responseThreat.communityIntelligence = communityIntelligence;

    return res.status(201).json({ success: true, data: responseThreat });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.reportThreat = async (req, res) => {
  try {
    const { threatId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(threatId)) {
      return res.status(400).json({ error: "Invalid threatId" });
    }

    const threat = await Threat.findOne({ _id: threatId, ...getUserFilter(req) });
    if (!threat) {
      return res.status(404).json({ error: "Threat record not found" });
    }

    const alreadyReported = Boolean(threat.isReported);

    if (!alreadyReported) {
      threat.isReported = true;
      threat.reportedAt = new Date();
      threat.reportNotes = typeof req.body?.notes === "string" ? req.body.notes.trim().slice(0, 400) : "";
      threat.reporterSegment = req.user?.userType || threat.reporterSegment || "other";

      const safeLocation = String(req.user?.location || threat.reporterLocation || "").trim();
      threat.reporterLocation = safeLocation;
      threat.reporterLocationNormalized = normalizeLocation(safeLocation);

      if (!threat.targetedService || threat.targetedService === "Unknown Service") {
        threat.targetedService = extractTargetedService(threat.input, threat.inputType);
      }

      if (!threat.inputFingerprint) {
        threat.inputFingerprint = normalizeInputForFingerprint(threat.input, threat.inputType);
      }

      await threat.save();
    }

    const communityIntelligence = await buildCommunityIntelligence({
      inputFingerprint: threat.inputFingerprint,
      requesterId: req.user?._id,
    });
    const areaIntelligence = await getAreaIntelligenceData(req.user?.location || threat.reporterLocation);

    return res.json({
      success: true,
      data: {
        threat,
        communityIntelligence,
        areaIntelligence,
      },
      message: alreadyReported
        ? "Threat was already reported to community intelligence."
        : "Threat reported to community intelligence.",
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.getAreaThreatIntelligence = async (req, res) => {
  try {
    const location = req.query.location || req.user?.location;
    if (!String(location || "").trim()) {
      return res.status(400).json({ error: "location is required" });
    }

    const data = await getAreaIntelligenceData(location);
    return res.json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const { page = 1, limit = 20, riskLevel, inputType } = req.query;
    const filter = getUserFilter(req);

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
    const userFilter = getUserFilter(req);

    const stats = await Threat.aggregate([
      { $match: userFilter },
      {
        $group: {
          _id: "$riskLevel",
          count: { $sum: 1 },
          avgScore: { $avg: "$riskScore" },
        },
      },
    ]);

    const total = await Threat.countDocuments(userFilter);
    const recent = await Threat.find(userFilter).sort({ createdAt: -1 }).limit(5);

    return res.json({ success: true, data: { breakdown: stats, total, recent } });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.deleteHistory = async (req, res) => {
  try {
    const userFilter = getUserFilter(req);
    await Threat.deleteMany(userFilter);
    return res.json({ success: true, message: "History cleared" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
