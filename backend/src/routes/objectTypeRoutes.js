const express = require("express");
const router = express.Router();
const objectTypeController = require("../controllers/objectTypeController");

// GET all object types
router.get("/", objectTypeController.getAllObjectTypes);

// GET object type by ID
router.get("/:id", objectTypeController.getObjectTypeById);

// CREATE object type
router.post("/", objectTypeController.createObjectType);

// DELETE object type
router.delete("/:id", objectTypeController.deleteObjectType);

module.exports = router;
