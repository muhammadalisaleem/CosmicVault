const sql = require("mssql");
require("dotenv").config();

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    trustServerCertificate: true,
    encrypt: false,
  },
  connectionTimeout: 15000,
  requestTimeout: 15000,
};

let pool = null;

const connectPool = async () => {
  try {
    pool = new sql.ConnectionPool(dbConfig);
    await pool.connect();
    console.log("✅ MSSQL Connection Pool established");
    return pool;
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
};

const getPool = () => {
  if (!pool) {
    throw new Error("Database pool not initialized");
  }
  return pool;
};

const closePool = async () => {
  if (pool) {
    await pool.close();
    console.log("Database pool closed");
  }
};

module.exports = {
  sql,
  connectPool,
  getPool,
  closePool,
};
