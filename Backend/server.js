const mongoose = require("mongoose");
const app = require("./app");
require("dotenv").config();

const MONGO_URL = process.env.MONGO_URL || process.env.MONGODB_URL || "mongodb://localhost:27017/chatapp";

mongoose.connect(MONGO_URL)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => {
    console.error("❌ MongoDB connection failed!");
    console.error(err.message);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));