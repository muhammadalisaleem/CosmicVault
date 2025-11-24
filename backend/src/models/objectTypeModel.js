const { getPool, sql } = require("../config/database");

// GET all object types
const getAllObjectTypes = async () => {
  const pool = getPool();
  const result = await pool
    .request()
    .query("SELECT * FROM ObjectTypes ORDER BY TypeID");
  return result.recordset;
};

// GET object type by ID
const getObjectTypeById = async (typeId) => {
  const pool = getPool();
  const result = await pool
    .request()
    .input("TypeID", sql.Int, typeId)
    .query("SELECT * FROM ObjectTypes WHERE TypeID = @TypeID");
  return result.recordset[0];
};

// CREATE object type
const createObjectType = async (typeName, description) => {
  const pool = getPool();
  const result = await pool
    .request()
    .input("TypeName", sql.VarChar, typeName)
    .input("Description", sql.VarChar, description)
    .query(
      "INSERT INTO ObjectTypes (TypeName, Description) VALUES (@TypeName, @Description); SELECT SCOPE_IDENTITY() as TypeID"
    );
  return result.recordset[0].TypeID;
};

// DELETE object type
const deleteObjectType = async (typeId) => {
  const pool = getPool();
  const result = await pool
    .request()
    .input("TypeID", sql.Int, typeId)
    .query("DELETE FROM ObjectTypes WHERE TypeID = @TypeID");
  return result.rowsAffected[0];
};

module.exports = {
  getAllObjectTypes,
  getObjectTypeById,
  createObjectType,
  deleteObjectType,
};
