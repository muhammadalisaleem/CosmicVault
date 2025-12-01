const express = require("express");
const router = express.Router();
const auditLogController = require("../controllers/auditLogController");

// GET all audit logs
router.get("/", auditLogController.getAllAuditLogs);

// GET audit logs by table name
router.get("/table/:tableName", auditLogController.getAuditLogsByTable);

// GET audit logs by user
router.get("/user/:userId", auditLogController.getAuditLogsByUser);

module.exports = router;
