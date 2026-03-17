require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const connectDB = require("./database/db");
const threatController = require("./controllers/threatController");
const authController = require("./controllers/authController");
const authMiddleware = require("./middleware/authMiddleware");

const parseCorsOrigins = () => {
	const raw = process.env.CORS_ORIGINS || "http://localhost:5173,http://127.0.0.1:5173";
	return raw
		.split(",")
		.map((origin) => origin.trim())
		.filter(Boolean);
};

const app = express();
const corsOrigins = parseCorsOrigins();
const upload = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: 5 * 1024 * 1024 },
});

const screenshotUpload = (req, res, next) => {
	upload.single("screenshot")(req, res, (err) => {
		if (!err) {
			return next();
		}

		if (err instanceof multer.MulterError) {
			if (err.code === "LIMIT_FILE_SIZE") {
				return res.status(413).json({ error: "Screenshot must be 5MB or smaller" });
			}

			if (err.code === "LIMIT_UNEXPECTED_FILE") {
				return res.status(400).json({ error: "Upload field must be named screenshot" });
			}

			return res.status(400).json({ error: err.message || "Invalid screenshot upload" });
		}

		return res.status(400).json({ error: err.message || "Invalid screenshot upload" });
	});
};

connectDB();

app.use(
	cors({
		origin: corsOrigins.includes("*") ? true : corsOrigins,
		credentials: true,
	}),
);
app.use(express.json());

app.post("/api/auth/register", authController.register);
app.post("/api/auth/login", authController.login);
app.post("/api/auth/logout", authMiddleware, authController.logout);
app.get("/api/auth/me", authMiddleware, authController.getProfile);

app.post("/api/analyze", authMiddleware, threatController.analyzeThreat);
app.post(
	"/api/analyze-screenshot",
	authMiddleware,
	screenshotUpload,
	threatController.analyzeScreenshot,
);
app.post("/api/threats/:threatId/report", authMiddleware, threatController.reportThreat);
app.get("/api/area-threat-intelligence", authMiddleware, threatController.getAreaThreatIntelligence);
app.get("/api/history", authMiddleware, threatController.getHistory);
app.get("/api/stats", authMiddleware, threatController.getStats);
app.delete("/api/history", authMiddleware, threatController.deleteHistory);
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`sentinelAI backend API running on port ${PORT}`));