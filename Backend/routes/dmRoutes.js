const express = require("express");
const router = express.Router();
const DirectMessage = require("../Models/DirectMessage");
const User = require("../Models/User");
const requireAuth = require("../middleware/auth");

// Get all active DMs for the user
router.get("/", requireAuth, async (req, res) => {
  try {
    const dms = await DirectMessage.find({ participants: req.user._id })
      .populate("participants", "name username avatar status")
      .sort({ updatedAt: -1 });
    res.json(dms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create or get DM with a user
router.post("/", requireAuth, async (req, res) => {
  try {
    const { targetUserId } = req.body;
    if (!targetUserId) return res.status(400).json({ error: "targetUserId required" });

    // Check if DM already exists
    let dm = await DirectMessage.findOne({
      participants: { $all: [req.user._id, targetUserId] }
    }).populate("participants", "name username avatar status");

    if (!dm) {
      dm = new DirectMessage({
        participants: [req.user._id, targetUserId]
      });
      await dm.save();
      dm = await dm.populate("participants", "name username avatar status");
    }

    res.json(dm);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
