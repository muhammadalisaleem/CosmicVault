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
const createConstellation = async (name, description, abbreviation) => {
  const pool = getPool();
  const result = await pool
    .request()
    .input("Name", sql.VarChar, name)
    .input("Description", sql.VarChar(sql.MAX), description)
    .input("Abbreviation", sql.VarChar, abbreviation)
    .query(
      "INSERT INTO Constellations (Name, Description, Abbreviation) VALUES (@Name, @Description, @Abbreviation); SELECT SCOPE_IDENTITY() as ConstellationID"
    );
  return result.recordset[0].ConstellationID;
};

// UPDATE constellation
const updateConstellation = async (constellationId, name, description, abbreviation) => {
  const pool = getPool();
  const result = await pool
    .request()
    .input("ConstellationID", sql.Int, constellationId)
    .input("Name", sql.VarChar, name)
    .input("Description", sql.VarChar(sql.MAX), description)
    .input("Abbreviation", sql.VarChar, abbreviation)
    .query(
      "UPDATE Constellations SET Name = @Name, Description = @Description, Abbreviation = @Abbreviation WHERE ConstellationID = @ConstellationID"
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
