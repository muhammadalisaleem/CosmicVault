const observationStreaksModel = require("../models/observationStreaksModel");

// GET all observation streaks
const getAllObservationStreaks = async (req, res) => {
  try {
    const streaks = await observationStreaksModel.getAllObservationStreaks();
    res.json({
      success: true,
      data: streaks,
      message: "Observation streaks retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving observation streaks",
      error: error.message,
    });
  }
};

// GET observation streaks by user
const getObservationStreaksByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const streaks = await observationStreaksModel.getObservationStreaksByUser(userId);
    res.json({
      success: true,
      data: streaks,
      message: "Observation streaks retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving observation streaks",
      error: error.message,
    });
  }
};

module.exports = {
  getAllObservationStreaks,
  getObservationStreaksByUser,
};
