const express = require("express");
const router = express.Router();
const observationLogController = require("../controllers/observationLogController");

// GET all observation logs
router.get("/", observationLogController.getAllObservationLogs);

// GET observation logs by user ID
router.get("/user/:userId", observationLogController.getObservationLogsByUser);

// GET observation log by ID
router.get("/:id", observationLogController.getObservationLogById);

// CREATE observation log
router.post("/", observationLogController.createObservationLog);

// UPDATE observation log
router.put("/:id", observationLogController.updateObservationLog);

// DELETE observation log
router.delete("/:id", observationLogController.deleteObservationLog);

module.exports = router;
