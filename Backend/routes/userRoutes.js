const express = require("express");
const router = express.Router();
const User = require("../Models/User");
const requireAuth = require("../middleware/auth");

router.get("/search", requireAuth, async (req, res) => {
  try {
    const q = req.query.q;
    if (!q) return res.json([]);
    const regex = new RegExp(q, "i");
    const users = await User.find({
      $or: [{ username: regex }, { name: regex }],
      _id: { $ne: req.user._id }
    })
      .select("username name avatar status")
      .limit(20);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
