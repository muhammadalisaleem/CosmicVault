const constellationModel = require("../models/constellationModel");

// GET all constellations
const getAllConstellations = async (req, res) => {
  try {
    const constellations = await constellationModel.getAllConstellations();
    res.json({
      success: true,
      data: constellations,
      message: "Constellations retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving constellations",
      error: error.message,
    });
  }
};

// GET constellation by ID
const getConstellationById = async (req, res) => {
  try {
    const { id } = req.params;
    const constellation = await constellationModel.getConstellationById(id);

    if (!constellation) {
      return res.status(404).json({
        success: false,
        message: "Constellation not found",
      });
    }

    res.json({
      success: true,
      data: constellation,
      message: "Constellation retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving constellation",
      error: error.message,
    });
  }
};

// CREATE constellation
const createConstellation = async (req, res) => {
  try {
    const { name, description, rightAscension, declination } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Constellation name is required",
      });
    }

    const constellationId = await constellationModel.createConstellation(
      name,
      description || "",
      rightAscension || "",
      declination || ""
    );

    res.status(201).json({
      success: true,
      data: {
        ConstellationID: constellationId,
        name,
        description,
        rightAscension,
        declination,
      },
      message: "Constellation created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating constellation",
      error: error.message,
    });
  }
};

// UPDATE constellation
const updateConstellation = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, rightAscension, declination } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Constellation name is required",
      });
    }

    const rowsAffected = await constellationModel.updateConstellation(
      id,
      name,
      description || "",
      rightAscension || "",
      declination || ""
    );

    if (rowsAffected === 0) {
      return res.status(404).json({
        success: false,
        message: "Constellation not found",
      });
    }

    res.json({
      success: true,
      data: {
        ConstellationID: id,
        name,
        description,
        rightAscension,
        declination,
      },
      message: "Constellation updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating constellation",
      error: error.message,
    });
  }
};

// DELETE constellation
const deleteConstellation = async (req, res) => {
  try {
    const { id } = req.params;
    const rowsAffected = await constellationModel.deleteConstellation(id);

    if (rowsAffected === 0) {
      return res.status(404).json({
        success: false,
        message: "Constellation not found",
      });
    }

    res.json({
      success: true,
      message: "Constellation deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting constellation",
      error: error.message,
    });
  }
};

module.exports = {
  getAllConstellations,
  getConstellationById,
  createConstellation,
  updateConstellation,
  deleteConstellation,
};
