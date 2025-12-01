const auditLogModel = require("../models/auditLogModel");

// GET all audit logs
const getAllAuditLogs = async (req, res) => {
  try {
    const logs = await auditLogModel.getAllAuditLogs();
    res.json({
      success: true,
      data: logs,
      message: "Audit logs retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving audit logs",
      error: error.message,
    });
  }
};

// GET audit logs by table name
const getAuditLogsByTable = async (req, res) => {
  try {
    const { tableName } = req.params;
    const logs = await auditLogModel.getAuditLogsByTable(tableName);
    res.json({
      success: true,
      data: logs,
      message: "Audit logs retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving audit logs",
      error: error.message,
    });
  }
};

// GET audit logs by user
const getAuditLogsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const logs = await auditLogModel.getAuditLogsByUser(userId);
    res.json({
      success: true,
      data: logs,
      message: "Audit logs retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving audit logs",
      error: error.message,
    });
  }
};

module.exports = {
  getAllAuditLogs,
  getAuditLogsByTable,
  getAuditLogsByUser,
};
