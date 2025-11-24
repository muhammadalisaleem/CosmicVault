const { getPool, sql } = require("../config/database");

// GET all constellations
const getAllConstellations = async () => {
  const pool = getPool();
  const result = await pool
    .request()
    .query("SELECT * FROM Constellations ORDER BY ConstellationID");
  return result.recordset;
};

// GET constellation by ID
const getConstellationById = async (constellationId) => {
  const pool = getPool();
  const result = await pool
    .request()
    .input("ConstellationID", sql.Int, constellationId)
    .query("SELECT * FROM Constellations WHERE ConstellationID = @ConstellationID");
  return result.recordset[0];
};

// CREATE constellation
const createConstellation = async (name, description, rightAscension, declination) => {
  const pool = getPool();
  const result = await pool
    .request()
    .input("Name", sql.VarChar, name)
    .input("Description", sql.VarChar, description)
    .input("RightAscension", sql.VarChar, rightAscension)
    .input("Declination", sql.VarChar, declination)
    .query(
      "INSERT INTO Constellations (Name, Description, RightAscension, Declination) VALUES (@Name, @Description, @RightAscension, @Declination); SELECT SCOPE_IDENTITY() as ConstellationID"
    );
  return result.recordset[0].ConstellationID;
};

// UPDATE constellation
const updateConstellation = async (constellationId, name, description, rightAscension, declination) => {
  const pool = getPool();
  const result = await pool
    .request()
    .input("ConstellationID", sql.Int, constellationId)
    .input("Name", sql.VarChar, name)
    .input("Description", sql.VarChar, description)
    .input("RightAscension", sql.VarChar, rightAscension)
    .input("Declination", sql.VarChar, declination)
    .query(
      "UPDATE Constellations SET Name = @Name, Description = @Description, RightAscension = @RightAscension, Declination = @Declination WHERE ConstellationID = @ConstellationID"
    );
  return result.rowsAffected[0];
};

// DELETE constellation
const deleteConstellation = async (constellationId) => {
  const pool = getPool();
  const result = await pool
    .request()
    .input("ConstellationID", sql.Int, constellationId)
    .query("DELETE FROM Constellations WHERE ConstellationID = @ConstellationID");
  return result.rowsAffected[0];
};

module.exports = {
  getAllConstellations,
  getConstellationById,
  createConstellation,
  updateConstellation,
  deleteConstellation,
};
