const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "sentinel-dev-secret";
const TOKEN_EXPIRY = "7d";

const isDatabaseIssue = (err) => {
  const message = String(err?.message || "");
  return (
    err?.name === "MongooseServerSelectionError" ||
    /could not connect to any servers/i.test(message) ||
    /whitelist/i.test(message) ||
    /ssl routines/i.test(message) ||
    /tlsv1 alert internal error/i.test(message)
  );
};

const ensureDatabaseConnection = (res) => {
  if (mongoose.connection.readyState !== 1) {
    res.status(503).json({
      error:
        "Database unavailable. Check MongoDB Atlas Network Access (IP whitelist) and MONGO_URI, then restart backend.",
    });
    return false;
  }
  return true;
};

const safeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  userType: user.userType,
  location: user.location,
  createdAt: user.createdAt,
});

const signToken = (user) =>
  jwt.sign(
    {
      id: user._id,
      email: user.email,
      userType: user.userType,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );

exports.register = async (req, res) => {
  try {
    const { name, email, password, userType, location } = req.body;
    if (!ensureDatabaseConnection(res)) {
      return;
    }

    const safeEmail = typeof email === "string" ? email.toLowerCase().trim() : "";
    const safePassword = typeof password === "string" ? password : "";

    if (!name || !safeEmail || !safePassword) {
      return res.status(400).json({ error: "name, email and password are required" });
    }

    const existing = await User.findOne({ email: safeEmail });
    if (existing) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(safePassword, 10);
    const user = await User.create({
      name: name.trim(),
      email: safeEmail,
      password: hashedPassword,
      userType: userType || "other",
      location: location || "",
      lastLoginAt: new Date(),
    });

    const token = signToken(user);
    return res.status(201).json({ success: true, data: { token, user: safeUser(user) } });
  } catch (err) {
    if (isDatabaseIssue(err)) {
      return res.status(503).json({
        error:
          "Database unavailable. Check MongoDB Atlas Network Access (IP whitelist) and MONGO_URI, then restart backend.",
      });
    }
    return res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!ensureDatabaseConnection(res)) {
      return;
    }

    const safeEmail = typeof email === "string" ? email.toLowerCase().trim() : "";
    const safePassword = typeof password === "string" ? password : "";

    if (!safeEmail || !safePassword) {
      return res.status(400).json({ error: "email and password are required" });
    }

    const user = await User.findOne({ email: safeEmail }).select("+password");
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (!user.password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(safePassword, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    await User.updateOne({ _id: user._id }, { $set: { lastLoginAt: new Date() } });

    const token = signToken(user);
    return res.json({ success: true, data: { token, user: safeUser(user) } });
  } catch (err) {
    if (isDatabaseIssue(err)) {
      return res.status(503).json({
        error:
          "Database unavailable. Check MongoDB Atlas Network Access (IP whitelist) and MONGO_URI, then restart backend.",
      });
    }
    return res.status(500).json({ error: err.message });
  }
};

exports.logout = async (req, res) => {
  return res.json({ success: true, message: "Logout successful" });
};

exports.getProfile = async (req, res) => {
  return res.json({ success: true, data: safeUser(req.user) });
};
