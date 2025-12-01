const express = require("express");
const router = express.Router();
const observationStreaksController = require("../controllers/observationStreaksController");

// GET all observation streaks
router.get("/", observationStreaksController.getAllObservationStreaks);

// GET observation streaks by user
router.get("/user/:userId", observationStreaksController.getObservationStreaksByUser);

module.exports = router;
