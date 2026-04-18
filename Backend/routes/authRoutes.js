const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../Models/User");
const requireAuth = require("../middleware/auth");
const { uploadImage } = require("../utils/cloudinary");
const { sendWelcomeEmail } = require("../utils/mailer");

const router = express.Router();

const safeUser = (user) => ({
  id: user._id,
  username: user.username,
  email: user.email,
  name: user.name,
  description: user.description,
  avatar: user.avatar,
  status: user.status,
});

router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: "Username, email and password are required." });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({ error: "Email is already registered." });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(409).json({ error: "Username is already taken." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    req.session.userId = user._id;
    sendWelcomeEmail(user.email, user.username);

    res.json({ user: safeUser(user) });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Unable to create account." });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    req.session.userId = user._id;
    res.json({ user: safeUser(user) });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ error: "Unable to sign in." });
  }
});

router.post("/signout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Signout error:", err);
      return res.status(500).json({ error: "Unable to sign out." });
    }
    res.clearCookie("connect.sid");
    res.json({ success: true });
  });
});

router.get("/me", requireAuth, async (req, res) => {
  res.json({ user: safeUser(req.user) });
});

router.put("/profile", requireAuth, async (req, res) => {
  try {
    const { name, description, image } = req.body;
    if (name !== undefined) req.user.name = name;
    if (description !== undefined) req.user.description = description;

    if (image) {
      const uploadResult = await uploadImage(image);
      req.user.avatar = uploadResult.secure_url;
    }

    await req.user.save();
    res.json({ user: safeUser(req.user) });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ error: "Unable to update profile." });
  }
});

module.exports = router;
