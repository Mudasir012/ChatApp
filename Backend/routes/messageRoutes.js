const express = require("express");
const router = express.Router();
const Message = require("../Models/Message");
const requireAuth = require("../middleware/auth");

// get messages from a room
router.get("/:roomKey", requireAuth, async (req, res) => {
  try {
    const messages = await Message.find({ roomKey: req.params.roomKey })
      .populate("sender", "name username avatar")
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// post new message
router.post("/", requireAuth, async (req, res) => {
  try {
    const { roomKey, text } = req.body;

    const message = new Message({
      roomKey,
      sender: req.user._id,
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });

    await message.save();
    const populatedMessage = await message.populate("sender", "name username avatar");
    res.json(populatedMessage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;