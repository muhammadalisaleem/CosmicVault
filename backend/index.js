const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Import database
const { connectPool, closePool } = require("./src/config/database");

// Import routes
const userRoutes = require("./src/routes/userRoutes");
const objectTypeRoutes = require("./src/routes/objectTypeRoutes");
const constellationRoutes = require("./src/routes/constellationRoutes");
const celestialObjectRoutes = require("./src/routes/celestialObjectRoutes");
const observationLogRoutes = require("./src/routes/observationLogRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/users", userRoutes);
app.use("/types", objectTypeRoutes);
app.use("/constellations", constellationRoutes);
app.use("/objects", celestialObjectRoutes);
app.use("/logs", observationLogRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "🚀 Cosmic Vault Backend is running!",
    timestamp: new Date().toISOString(),
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "🌌 Welcome to Cosmic Vault Backend API",
    version: "1.0.0",
    endpoints: {
      users: "/users",
      objectTypes: "/types",
      constellations: "/constellations",
      celestialObjects: "/objects",
      observationLogs: "/logs",
      health: "/health",
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: err.message,
  });
});

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await connectPool();

    // Start Express server
    app.listen(PORT, () => {
      console.log(`\n✨ Cosmic Vault Backend running on http://localhost:${PORT}`);
      console.log(`📚 Database: CosmicVault (MSSQL)`);
      console.log(`\n📖 API Endpoints:`);
      console.log(`   GET  /health`);
      console.log(`   GET  /users`);
      console.log(`   POST /users`);
      console.log(`   GET  /types`);
      console.log(`   POST /types`);
      console.log(`   GET  /constellations`);
      console.log(`   POST /constellations`);
      console.log(`   GET  /objects`);
      console.log(`   POST /objects`);
      console.log(`   GET  /logs`);
      console.log(`   POST /logs\n`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 Shutting down gracefully...");
  await closePool();
  process.exit(0);
});

// Start the application
startServer();
