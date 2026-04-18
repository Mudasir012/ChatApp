const mongoose = require("mongoose");

const boardSchema = new mongoose.Schema({
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group", required: true },
  name: { type: String, required: true, trim: true },
  topic: { type: String, trim: true, default: "" },
  icon: { type: String, default: "#" },
}, { timestamps: true });

module.exports = mongoose.model("Board", boardSchema);
