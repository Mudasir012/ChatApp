const express = require("express");
const router = express.Router();
const Group = require("../Models/Group");
const Board = require("../Models/Board");
const requireAuth = require("../middleware/auth");

// Get all groups for the user (with their boards)
router.get("/", requireAuth, async (req, res) => {
  try {
    const groups = await Group.find({ members: req.user._id }).populate("admin", "name username avatar");
    const groupsWithBoards = await Promise.all(groups.map(async (g) => {
      const boards = await Board.find({ groupId: g._id });
      return { ...g.toObject(), boards };
    }));
    res.json(groupsWithBoards);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new group
router.post("/", requireAuth, async (req, res) => {
  try {
    const { name, description, icon, members } = req.body; // members should be array of user IDs
    if (!name) return res.status(400).json({ error: "Group name is required." });

    const memberIds = members || [];
    if (!memberIds.includes(req.user._id.toString())) {
      memberIds.push(req.user._id);
    }

    const group = new Group({
      name,
      description,
      icon: icon || "🌐",
      admin: req.user._id,
      members: memberIds
    });
    await group.save();

    // Create default board
    const defaultBoard = new Board({
      groupId: group._id,
      name: "general",
      topic: "General discussion",
      icon: "#"
    });
    await defaultBoard.save();

    const populatedGroup = await Group.findById(group._id).populate("admin", "name username avatar");
    res.json({ ...populatedGroup.toObject(), boards: [defaultBoard] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a board in a group
router.post("/:groupId/boards", requireAuth, async (req, res) => {
  try {
    const { name, topic, icon } = req.body;
    if (!name) return res.status(400).json({ error: "Board name is required." });

    const group = await Group.findById(req.params.groupId);
    if (!group) return res.status(404).json({ error: "Group not found." });

    // Only admin can create boards? We can allow members too or just admin.
    // Let's restrict to admin for now, or maybe any member. The prompt says "Inside each group, users can create one or more Boards". Let's allow members to create boards.
    if (!group.members.includes(req.user._id)) {
      return res.status(403).json({ error: "Not a member of this group." });
    }

    const board = new Board({
      groupId: group._id,
      name,
      topic,
      icon: icon || "#"
    });
    await board.save();

    res.json(board);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
