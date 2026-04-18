const serverless = require("serverless-http");
const mongoose = require("mongoose");
const app = require("../Backend/app");

const MONGO_URL = process.env.MONGO_URL || process.env.MONGODB_URL || "mongodb://localhost:27017/chatapp";

let dbConnection;

async function ensureDatabaseConnection() {
  if (dbConnection) return dbConnection;
  dbConnection = mongoose.connect(MONGO_URL).catch((err) => {
    dbConnection = null;
    throw err;
  });
  return dbConnection;
}

const handler = serverless(app);

module.exports = async (req, res) => {
  // Bypass DB connection check for health route so it can always report status
  if (req.url === "/api/health" || req.url === "/health") {
    return handler(req, res);
  }
  
  try {
    await ensureDatabaseConnection();
  } catch (err) {
    console.error("Database connection error in handler:", err);
    // We still call handler so it can return the health check if it matched (though we handled that above)
    // or return a proper error through the app.
  }
  return handler(req, res);
};
