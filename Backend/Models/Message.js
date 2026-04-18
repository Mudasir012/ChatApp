const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  roomKey: { type: String, required: true }, // boardId or dmId
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  time: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Message", messageSchema);