const { getPool, sql } = require("../config/database");

// GET all observation streaks
const getAllObservationStreaks = async () => {
  const pool = getPool();
  const result = await pool
    .request()
    .query(`
      SELECT 
        os.*,
        u.Username
      FROM ObservationStreaks os
      INNER JOIN Users u ON os.UserID = u.UserID
      ORDER BY os.StreakDate DESC
    `);
  return result.recordset;
};

// GET observation streaks by user
const getObservationStreaksByUser = async (userId) => {
  const pool = getPool();
  const result = await pool
    .request()
    .input("UserID", sql.Int, userId)
    .query(`
      SELECT 
        os.*,
        u.Username
      FROM ObservationStreaks os
      INNER JOIN Users u ON os.UserID = u.UserID
      WHERE os.UserID = @UserID
      ORDER BY os.StreakDate DESC
    `);
  return result.recordset;
};

module.exports = {
  getAllObservationStreaks,
  getObservationStreaksByUser,
};
