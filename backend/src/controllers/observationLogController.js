const observationLogModel = require("../models/observationLogModel");

// GET all observation logs
const getAllObservationLogs = async (req, res) => {
  try {
    const logs = await observationLogModel.getAllObservationLogs();
    res.json({
      success: true,
      data: logs,
      message: "Observation logs retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving observation logs",
      error: error.message,
    });
  }
};

// GET observation logs by user
const getObservationLogsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const logs = await observationLogModel.getObservationLogsByUser(userId);
    res.json({
      success: true,
      data: logs,
      message: "User observation logs retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving user observation logs",
      error: error.message,
    });
  }
};

// GET observation log by ID
const getObservationLogById = async (req, res) => {
  try {
    const { id } = req.params;
    const log = await observationLogModel.getObservationLogById(id);

    if (!log) {
      return res.status(404).json({
        success: false,
        message: "Observation log not found",
      });
    }

    res.json({
      success: true,
      data: log,
      message: "Observation log retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving observation log",
      error: error.message,
    });
  }
};

// CREATE observation log
const createObservationLog = async (req, res) => {
  try {
    const { UserID, ObjectID, ObservationDate, Notes, Equipment, SeeingCondition, Location } = req.body;

    if (!UserID || !ObjectID || !ObservationDate) {
      return res.status(400).json({
        success: false,
        message: "UserID, ObjectID, and ObservationDate are required",
      });
    }

    const logId = await observationLogModel.createObservationLog(
      UserID,
      ObjectID,
      ObservationDate,
      Notes || "",
      Equipment || "",
      SeeingCondition || ""
    );

    res.status(201).json({
      success: true,
      data: { LogID: logId, UserID, ObjectID, ObservationDate },
      message: "Observation log created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating observation log",
      error: error.message,
    });
  }
};

// UPDATE observation log
const updateObservationLog = async (req, res) => {
  try {
    const { id } = req.params;
    const { UserID, ObjectID, ObservationDate, Notes, Equipment, SeeingCondition } = req.body;

    if (!UserID || !ObjectID || !ObservationDate) {
      return res.status(400).json({
        success: false,
        message: "UserID, ObjectID, and ObservationDate are required",
      });
    }

    const rowsAffected = await observationLogModel.updateObservationLog(
      id,
      UserID,
      ObjectID,
      ObservationDate,
      Notes || "",
      Equipment || "",
      SeeingCondition || ""
    );

    if (rowsAffected === 0) {
      return res.status(404).json({
        success: false,
        message: "Observation log not found",
      });
    }

    res.json({
      success: true,
      data: { LogID: id, UserID, ObjectID, ObservationDate },
      message: "Observation log updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating observation log",
      error: error.message,
    });
  }
};

// DELETE observation log
const deleteObservationLog = async (req, res) => {
  try {
    const { id } = req.params;
    const rowsAffected = await observationLogModel.deleteObservationLog(id);

    if (rowsAffected === 0) {
      return res.status(404).json({
        success: false,
        message: "Observation log not found",
      });
    }

    res.json({
      success: true,
      message: "Observation log deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting observation log",
      error: error.message,
    });
  }
};

module.exports = {
  getAllObservationLogs,
  getObservationLogsByUser,
  getObservationLogById,
  createObservationLog,
  updateObservationLog,
  deleteObservationLog,
};
