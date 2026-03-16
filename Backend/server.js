require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./database/db");
const threatController = require("./controllers/threatController");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.post("/api/analyze", threatController.analyzeThreat);
app.get("/api/history", threatController.getHistory);
app.get("/api/stats", threatController.getStats);
app.delete("/api/history", threatController.deleteHistory);
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));