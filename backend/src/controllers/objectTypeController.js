const objectTypeModel = require("../models/objectTypeModel");

// GET all object types
const getAllObjectTypes = async (req, res) => {
  try {
    const types = await objectTypeModel.getAllObjectTypes();
    res.json({
      success: true,
      data: types,
      message: "Object types retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving object types",
      error: error.message,
    });
  }
};

// GET object type by ID
const getObjectTypeById = async (req, res) => {
  try {
    const { id } = req.params;
    const type = await objectTypeModel.getObjectTypeById(id);

    if (!type) {
      return res.status(404).json({
        success: false,
        message: "Object type not found",
      });
    }

    res.json({
      success: true,
      data: type,
      message: "Object type retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving object type",
      error: error.message,
    });
  }
};

// CREATE object type
const createObjectType = async (req, res) => {
  try {
    const { typeName, description } = req.body;

    if (!typeName) {
      return res.status(400).json({
        success: false,
        message: "Type name is required",
      });
    }

    const typeId = await objectTypeModel.createObjectType(typeName, description || "");
    res.status(201).json({
      success: true,
      data: { TypeID: typeId, typeName, description },
      message: "Object type created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating object type",
      error: error.message,
    });
  }
};

// DELETE object type
const deleteObjectType = async (req, res) => {
  try {
    const { id } = req.params;
    const rowsAffected = await objectTypeModel.deleteObjectType(id);

    if (rowsAffected === 0) {
      return res.status(404).json({
        success: false,
        message: "Object type not found",
      });
    }

    res.json({
      success: true,
      message: "Object type deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting object type",
      error: error.message,
    });
  }
};

module.exports = {
  getAllObjectTypes,
  getObjectTypeById,
  createObjectType,
  deleteObjectType,
};
