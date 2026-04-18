const express = require('express');
const mongoose = require('mongoose');
const cors  = require('cors');
const session = require('express-session');
require("dotenv").config();

const app = express();
app.set('trust proxy', 1);

const allowedOrigins = [
  process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:4173',
  'http://127.0.0.1:4173',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS origin not allowed: ${origin}`));
    }
  },
  credentials: true,
}));

app.use(express.json({ limit: "10mb" }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'change_this_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  },
}));

const authRoutes = require("./routes/authRoutes");
const messageRoutes = require("./routes/messageRoutes");
const userRoutes = require("./routes/userRoutes");
const groupRoutes = require("./routes/groupRoutes");
const dmRoutes = require("./routes/dmRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/dms", dmRoutes);

const MONGO_URL = process.env.MONGO_URL || process.env.MONGODB_URL || "mongodb://localhost:27017/chatapp";

mongoose.connect(MONGO_URL)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch(err => {
    console.error("❌ MongoDB connection failed!");
    console.error("Please check your MONGODB_URL in the Backend/.env file. Ensure you replaced <db_password> with your actual password.");
    console.error(err.message);
  });

app.listen(5000, () => console.log("Server running on port 5000"));