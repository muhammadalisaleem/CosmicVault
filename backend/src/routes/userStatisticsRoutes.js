const express = require("express");
const router = express.Router();
const userStatisticsController = require("../controllers/userStatisticsController");

// GET all user statistics
router.get("/", userStatisticsController.getAllUserStatistics);

// GET user statistics by UserID
router.get("/:userId", userStatisticsController.getUserStatisticsByUserId);

module.exports = router;
