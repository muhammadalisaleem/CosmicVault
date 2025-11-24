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
    const { userId, objectId, observationDate, notes, equipment, seeingCondition } = req.body;

    if (!userId || !objectId || !observationDate) {
      return res.status(400).json({
        success: false,
        message: "UserID, ObjectID, and ObservationDate are required",
      });
    }

    const logId = await observationLogModel.createObservationLog(
      userId,
      objectId,
      observationDate,
      notes || "",
      equipment || "",
      seeingCondition || ""
    );

    res.status(201).json({
      success: true,
      data: { LogID: logId, userId, objectId, observationDate },
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
    const { userId, objectId, observationDate, notes, equipment, seeingCondition } = req.body;

    if (!userId || !objectId || !observationDate) {
      return res.status(400).json({
        success: false,
        message: "UserID, ObjectID, and ObservationDate are required",
      });
    }

    const rowsAffected = await observationLogModel.updateObservationLog(
      id,
      userId,
      objectId,
      observationDate,
      notes || "",
      equipment || "",
      seeingCondition || ""
    );

    if (rowsAffected === 0) {
      return res.status(404).json({
        success: false,
        message: "Observation log not found",
      });
    }

    res.json({
      success: true,
      data: { LogID: id, userId, objectId, observationDate },
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
  getObservationLogById,
  createObservationLog,
  updateObservationLog,
  deleteObservationLog,
};
