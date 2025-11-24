const express = require("express");
const router = express.Router();
const celestialObjectController = require("../controllers/celestialObjectController");

// GET all celestial objects
router.get("/", celestialObjectController.getAllCelestialObjects);

// GET celestial object by ID
router.get("/:id", celestialObjectController.getCelestialObjectById);

// CREATE celestial object
router.post("/", celestialObjectController.createCelestialObject);

// UPDATE celestial object
router.put("/:id", celestialObjectController.updateCelestialObject);

// DELETE celestial object
router.delete("/:id", celestialObjectController.deleteCelestialObject);

module.exports = router;
