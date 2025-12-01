const userStatisticsModel = require("../models/userStatisticsModel");

// GET all user statistics
const getAllUserStatistics = async (req, res) => {
  try {
    const statistics = await userStatisticsModel.getAllUserStatistics();
    res.json({
      success: true,
      data: statistics,
      message: "User statistics retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving user statistics",
      error: error.message,
    });
  }
};

// GET user statistics by UserID
const getUserStatisticsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const statistics = await userStatisticsModel.getUserStatisticsByUserId(userId);

    if (!statistics) {
      return res.status(404).json({
        success: false,
        message: "User statistics not found",
      });
    }

    res.json({
      success: true,
      data: statistics,
      message: "User statistics retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving user statistics",
      error: error.message,
    });
  }
};

module.exports = {
  getAllUserStatistics,
  getUserStatisticsByUserId,
};
