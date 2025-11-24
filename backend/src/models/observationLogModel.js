const { getPool, sql } = require("../config/database");

// GET all observation logs with joins
const getAllObservationLogs = async () => {
  const pool = getPool();
  const result = await pool.request().query(`
    SELECT 
      ol.LogID,
      ol.UserID,
      u.Username,
      ol.ObjectID,
      co.Name as ObjectName,
      ol.ObservationDate,
      ol.Notes,
      ol.EquipmentUsed as Equipment,
      ol.SeeingConditions as SeeingCondition
    FROM ObservationLogs ol
    LEFT JOIN Users u ON ol.UserID = u.UserID
    LEFT JOIN CelestialObjects co ON ol.ObjectID = co.ObjectID
    ORDER BY ol.LogID DESC
  `);
  return result.recordset;
};

// GET observation logs by user ID with joins
const getObservationLogsByUser = async (userId) => {
  const pool = getPool();
  const result = await pool
    .request()
    .input("UserID", sql.Int, userId)
    .query(`
      SELECT 
        ol.LogID,
        ol.UserID,
        u.Username,
        ol.ObjectID,
        co.Name as ObjectName,
        ol.ObservationDate,
        ol.Notes,
        ol.EquipmentUsed as Equipment,
        ol.SeeingConditions as SeeingCondition
      FROM ObservationLogs ol
      LEFT JOIN Users u ON ol.UserID = u.UserID
      LEFT JOIN CelestialObjects co ON ol.ObjectID = co.ObjectID
      WHERE ol.UserID = @UserID
      ORDER BY ol.ObservationDate DESC
    `);
  return result.recordset;
};

// GET observation log by ID with joins
const getObservationLogById = async (logId) => {
  const pool = getPool();
  const result = await pool
    .request()
    .input("LogID", sql.Int, logId)
    .query(`
      SELECT 
        ol.LogID,
        ol.UserID,
        u.Username,
        ol.ObjectID,
        co.Name as ObjectName,
        ol.ObservationDate,
        ol.Notes,
        ol.EquipmentUsed as Equipment,
        ol.SeeingConditions as SeeingCondition
      FROM ObservationLogs ol
      LEFT JOIN Users u ON ol.UserID = u.UserID
      LEFT JOIN CelestialObjects co ON ol.ObjectID = co.ObjectID
      WHERE ol.LogID = @LogID
    `);
  return result.recordset[0];
};

// CREATE observation log
const createObservationLog = async (userId, objectId, observationDate, notes, equipment, seeingCondition) => {
  const pool = getPool();
  const result = await pool
    .request()
    .input("UserID", sql.Int, userId)
    .input("ObjectID", sql.Int, objectId)
    .input("ObservationDate", sql.DateTime, observationDate)
    .input("Notes", sql.VarChar, notes)
    .input("Equipment", sql.VarChar, equipment)
    .input("SeeingCondition", sql.VarChar, seeingCondition)
    .query(
      "INSERT INTO ObservationLogs (UserID, ObjectID, ObservationDate, Notes, EquipmentUsed, SeeingConditions) VALUES (@UserID, @ObjectID, @ObservationDate, @Notes, @Equipment, @SeeingCondition); SELECT SCOPE_IDENTITY() as LogID"
    );
  return result.recordset[0].LogID;
};

// UPDATE observation log
const updateObservationLog = async (logId, userId, objectId, observationDate, notes, equipment, seeingCondition) => {
  const pool = getPool();
  const result = await pool
    .request()
    .input("LogID", sql.Int, logId)
    .input("UserID", sql.Int, userId)
    .input("ObjectID", sql.Int, objectId)
    .input("ObservationDate", sql.DateTime, observationDate)
    .input("Notes", sql.VarChar, notes)
    .input("Equipment", sql.VarChar, equipment)
    .input("SeeingCondition", sql.VarChar, seeingCondition)
    .query(
      "UPDATE ObservationLogs SET UserID = @UserID, ObjectID = @ObjectID, ObservationDate = @ObservationDate, Notes = @Notes, EquipmentUsed = @Equipment, SeeingConditions = @SeeingCondition WHERE LogID = @LogID"
    );
  return result.rowsAffected[0];
};

// DELETE observation log
const deleteObservationLog = async (logId) => {
  const pool = getPool();
  const result = await pool
    .request()
    .input("LogID", sql.Int, logId)
    .query("DELETE FROM ObservationLogs WHERE LogID = @LogID");
  return result.rowsAffected[0];
};

module.exports = {
  getAllObservationLogs,
  getObservationLogsByUser,
  getObservationLogById,
  createObservationLog,
  updateObservationLog,
  deleteObservationLog,
};
