const celestialObjectModel = require("../models/celestialObjectModel");
const objectTypeModel = require("../models/objectTypeModel");

// GET all celestial objects
const getAllCelestialObjects = async (req, res) => {
  try {
    const objects = await celestialObjectModel.getAllCelestialObjects();
    res.json({
      success: true,
      data: objects,
      message: "Celestial objects retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving celestial objects",
      error: error.message,
    });
  }
};

// GET celestial object by ID
const getCelestialObjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const object = await celestialObjectModel.getCelestialObjectById(id);

    if (!object) {
      return res.status(404).json({
        success: false,
        message: "Celestial object not found",
      });
    }

    res.json({
      success: true,
      data: object,
      message: "Celestial object retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving celestial object",
      error: error.message,
    });
  }
};

// CREATE celestial object
const createCelestialObject = async (req, res) => {
  try {
    const {
      name,
      typeId,
      constellationId,
      rightAscension,
      declination,
      magnitude,
      distance,
      starDetails,
      exoplanetDetails,
    } = req.body;

    if (!name || !typeId) {
      return res.status(400).json({
        success: false,
        message: "Name and TypeID are required",
      });
    }

    // Create celestial object
    const objectId = await celestialObjectModel.createCelestialObject(
      name,
      typeId,
      constellationId || null,
      rightAscension || "",
      declination || "",
      magnitude || null,
      distance || null
    );

    let starId = null;
    let exoplanetId = null;

    // If type is Star and star details provided
    if (starDetails && typeId === 1) {
      starId = await celestialObjectModel.createStarDetails(
        objectId,
        starDetails.surfaceTemperature || null,
        starDetails.luminosity || null,
        starDetails.radius || null,
        starDetails.mass || null
      );
    }

    // If type is Exoplanet and exoplanet details provided
    if (exoplanetDetails && typeId === 2) {
      exoplanetId = await celestialObjectModel.createExoplanetDetails(
        objectId,
        exoplanetDetails.hostStarName || "",
        exoplanetDetails.discoveryYear || null,
        exoplanetDetails.orbitalPeriod || null,
        exoplanetDetails.radius || null
      );
    }

    res.status(201).json({
      success: true,
      data: {
        ObjectID: objectId,
        name,
        typeId,
        starId,
        exoplanetId,
      },
      message: "Celestial object created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating celestial object",
      error: error.message,
    });
  }
};

// UPDATE celestial object
const updateCelestialObject = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      typeId,
      constellationId,
      rightAscension,
      declination,
      magnitude,
      distance,
      starDetails,
      exoplanetDetails,
    } = req.body;

    if (!name || !typeId) {
      return res.status(400).json({
        success: false,
        message: "Name and TypeID are required",
      });
    }

    // Update celestial object
    const rowsAffected = await celestialObjectModel.updateCelestialObject(
      id,
      name,
      typeId,
      constellationId || null,
      rightAscension || "",
      declination || "",
      magnitude || null,
      distance || null
    );

    if (rowsAffected === 0) {
      return res.status(404).json({
        success: false,
        message: "Celestial object not found",
      });
    }

    // Update star details if provided
    if (starDetails) {
      const star = await celestialObjectModel.getStarDetailsByObjectId(id);
      if (star) {
        await celestialObjectModel.updateStarDetails(
          star.StarID,
          starDetails.surfaceTemperature,
          starDetails.luminosity,
          starDetails.radius,
          starDetails.mass
        );
      }
    }

    // Update exoplanet details if provided
    if (exoplanetDetails) {
      const exoplanet = await celestialObjectModel.getExoplanetDetailsByObjectId(id);
      if (exoplanet) {
        await celestialObjectModel.updateExoplanetDetails(
          exoplanet.ExoplanetID,
          exoplanetDetails.hostStarName,
          exoplanetDetails.discoveryYear,
          exoplanetDetails.orbitalPeriod,
          exoplanetDetails.radius
        );
      }
    }

    res.json({
      success: true,
      data: { ObjectID: id, name, typeId },
      message: "Celestial object updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating celestial object",
      error: error.message,
    });
  }
};

// DELETE celestial object
const deleteCelestialObject = async (req, res) => {
  try {
    const { id } = req.params;
    const rowsAffected = await celestialObjectModel.deleteCelestialObject(id);

    if (rowsAffected === 0) {
      return res.status(404).json({
        success: false,
        message: "Celestial object not found",
      });
    }

    res.json({
      success: true,
      message: "Celestial object deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting celestial object",
      error: error.message,
    });
  }
};

module.exports = {
  getAllCelestialObjects,
  getCelestialObjectById,
  createCelestialObject,
  updateCelestialObject,
  deleteCelestialObject,
};
