const User = require("../Models/User");

module.exports = async (req, res, next) => {
  try {
    const userId = req.session?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Authorization required." });
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(401).json({ error: "Invalid session." });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ error: "Invalid session." });
  }
};
