const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const messageRoutes = require("./routes/messageRoutes");

const MONGO_URL = process.env.MONGO_URL || process.env.MONGODB_URL || "mongodb://localhost:27017/chatapp";
const CLIENT_ORIGINS = [
  process.env.CLIENT_ORIGIN || "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:4173",
  "http://127.0.0.1:4173",
];

const app = express();
app.set("trust proxy", 1);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || CLIENT_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS origin not allowed: ${origin}`));
    }
  },
  credentials: true,
}));

// Health check endpoint (moved to top to avoid being blocked by DB-dependent middleware)
app.get("/api/health", (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  res.json({ 
    status: dbStatus === "connected" ? "ok" : "degraded", 
    database: dbStatus,
    timestamp: new Date().toISOString() 
  });
});

app.use(express.json({ limit: "10mb" }));
app.use(session({
  secret: process.env.SESSION_SECRET || "change_this_secret",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: MONGO_URL,
    ttl: 14 * 24 * 60 * 60,
  }),
  cookie: {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  },
}));
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

module.exports = app;
