const { getPool, sql } = require("../config/database");

// GET all audit logs
const getAllAuditLogs = async () => {
  const pool = getPool();
  const result = await pool
    .request()
    .query(`
      SELECT 
        al.*,
        u.Username as ChangedByUsername
      FROM AuditLog al
      LEFT JOIN Users u ON al.ChangedBy = u.UserID
      ORDER BY al.ChangeDate DESC
    `);
  return result.recordset;
};

// GET audit logs by table name
const getAuditLogsByTable = async (tableName) => {
  const pool = getPool();
  const result = await pool
    .request()
    .input("TableName", sql.VarChar, tableName)
    .query(`
      SELECT 
        al.*,
        u.Username as ChangedByUsername
      FROM AuditLog al
      LEFT JOIN Users u ON al.ChangedBy = u.UserID
      WHERE al.TableName = @TableName
      ORDER BY al.ChangeDate DESC
    `);
  return result.recordset;
};

// GET audit logs by user
const getAuditLogsByUser = async (userId) => {
  const pool = getPool();
  const result = await pool
    .request()
    .input("UserID", sql.Int, userId)
    .query(`
      SELECT 
        al.*,
        u.Username as ChangedByUsername
      FROM AuditLog al
      LEFT JOIN Users u ON al.ChangedBy = u.UserID
      WHERE al.ChangedBy = @UserID
      ORDER BY al.ChangeDate DESC
    `);
  return result.recordset;
};

module.exports = {
  getAllAuditLogs,
  getAuditLogsByTable,
  getAuditLogsByUser,
};
