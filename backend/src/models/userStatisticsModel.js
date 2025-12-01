const { getPool, sql } = require("../config/database");

// GET all user statistics
const getAllUserStatistics = async () => {
  const pool = getPool();
  const result = await pool
    .request()
    .query(`
      SELECT 
        us.*,
        u.Username,
        u.Email
      FROM UserStatistics us
      INNER JOIN Users u ON us.UserID = u.UserID
      ORDER BY us.TotalObservations DESC
    `);
  return result.recordset;
};

// GET user statistics by UserID
const getUserStatisticsByUserId = async (userId) => {
  const pool = getPool();
  const result = await pool
    .request()
    .input("UserID", sql.Int, userId)
    .query(`
      SELECT 
        us.*,
        u.Username,
        u.Email
      FROM UserStatistics us
      INNER JOIN Users u ON us.UserID = u.UserID
      WHERE us.UserID = @UserID
    `);
  return result.recordset[0];
};

module.exports = {
  getAllUserStatistics,
  getUserStatisticsByUserId,
};
