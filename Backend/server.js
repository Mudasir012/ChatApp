const mongoose = require("mongoose");
const app = require("./app");
require("dotenv").config();

const MONGO_URL = process.env.MONGO_URL || process.env.MONGODB_URL || "mongodb://localhost:27017/chatapp";

mongoose.connect(MONGO_URL)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(5000, () => console.log("Server running on port 5000"));
  })
  .catch(err => {
    console.error("❌ MongoDB connection failed!");
    console.error("Please check your MONGODB_URL in the Backend/.env file. Ensure you replaced <db_password> with your actual password.");
    console.error(err.message);
  });