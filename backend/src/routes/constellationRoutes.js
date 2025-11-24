const express = require("express");
const router = express.Router();
const constellationController = require("../controllers/constellationController");

// GET all constellations
router.get("/", constellationController.getAllConstellations);

// GET constellation by ID
router.get("/:id", constellationController.getConstellationById);

// CREATE constellation
router.post("/", constellationController.createConstellation);

// UPDATE constellation
router.put("/:id", constellationController.updateConstellation);

// DELETE constellation
router.delete("/:id", constellationController.deleteConstellation);

module.exports = router;
