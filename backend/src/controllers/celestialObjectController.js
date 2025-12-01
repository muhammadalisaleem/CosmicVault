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

    // Get the type name to determine what details to create
    const type = await objectTypeModel.getObjectTypeById(typeId);
    const typeName = type?.TypeName;

    // If type is Star and star details provided
    if (starDetails && typeName === 'Star') {
      starId = await celestialObjectModel.createStarDetails(
        objectId,
        starDetails.spectralClass || null,
        starDetails.luminosityClass || null,
        starDetails.temperature || null,
        starDetails.mass || null
      );
    }

    // If type is Exoplanet and exoplanet details provided
    if (exoplanetDetails && typeName === 'Exoplanet') {
      exoplanetId = await celestialObjectModel.createExoplanetDetails(
        objectId,
        exoplanetDetails.hostStarId || null,
        exoplanetDetails.orbitalPeriod || null,
        exoplanetDetails.semiMajorAxis || null,
        exoplanetDetails.eccentricity || null
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

    // Get the type name to determine what details to update
    const type = await objectTypeModel.getObjectTypeById(typeId);
    const typeName = type?.TypeName;

    // Update or create star details if provided and type is Star
    if (starDetails && typeName === 'Star') {
      const star = await celestialObjectModel.getStarDetailsByObjectId(id);
      if (star) {
        await celestialObjectModel.updateStarDetails(
          star.StarID,
          starDetails.spectralClass,
          starDetails.luminosityClass,
          starDetails.temperature,
          starDetails.mass
        );
      } else {
        // Create star details if they don't exist
        await celestialObjectModel.createStarDetails(
          id,
          starDetails.spectralClass,
          starDetails.luminosityClass,
          starDetails.temperature,
          starDetails.mass
        );
      }
    }

    // Update or create exoplanet details if provided and type is Exoplanet
    if (exoplanetDetails && typeName === 'Exoplanet') {
      const exoplanet = await celestialObjectModel.getExoplanetDetailsByObjectId(id);
      if (exoplanet) {
        await celestialObjectModel.updateExoplanetDetails(
          exoplanet.ExoplanetID,
          exoplanetDetails.hostStarId,
          exoplanetDetails.orbitalPeriod,
          exoplanetDetails.semiMajorAxis,
          exoplanetDetails.eccentricity
        );
      } else {
        // Create exoplanet details if they don't exist
        await celestialObjectModel.createExoplanetDetails(
          id,
          exoplanetDetails.hostStarId,
          exoplanetDetails.orbitalPeriod,
          exoplanetDetails.semiMajorAxis,
          exoplanetDetails.eccentricity
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
    
    // Check if this object is being used as a host star for any exoplanets
    const isHostStar = await celestialObjectModel.isUsedAsHostStar(id);
    
    if (isHostStar) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete this celestial object because it is being used as a host star for one or more exoplanets. Please remove or update the exoplanet references first.",
      });
    }
    
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
