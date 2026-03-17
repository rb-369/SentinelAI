const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "sentinel-dev-secret";

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Authorization token missing" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    req.user = user;
    return next();
  } catch (err) {
    const message = String(err?.message || "");
    const isDatabaseIssue =
      err?.name === "MongooseServerSelectionError" ||
      /could not connect to any servers/i.test(message) ||
      /whitelist/i.test(message) ||
      /ssl routines/i.test(message) ||
      /tlsv1 alert internal error/i.test(message);

    if (isDatabaseIssue) {
      return res.status(503).json({
        error:
          "Database unavailable. Check MongoDB Atlas Network Access (IP whitelist) and MONGO_URI, then restart backend.",
      });
    }

    return res.status(401).json({ error: "Unauthorized access" });
  }
};
