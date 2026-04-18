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
  await ensureDatabaseConnection();
  return handler(req, res);
};
