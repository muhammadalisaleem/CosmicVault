const { getPool, sql } = require("../config/database");

// GET all users
const getAllUsers = async () => {
  const pool = getPool();
  const result = await pool
    .request()
    .query("SELECT * FROM Users ORDER BY UserID DESC");
  return result.recordset;
};

// GET user by ID
const getUserById = async (userId) => {
  const pool = getPool();
  const result = await pool
    .request()
    .input("UserID", sql.Int, userId)
    .query("SELECT * FROM Users WHERE UserID = @UserID");
  return result.recordset[0];
};

// GET user by username
const getUserByUsername = async (username) => {
  const pool = getPool();
  const result = await pool
    .request()
    .input("Username", sql.VarChar, username)
    .query("SELECT * FROM Users WHERE Username = @Username");
  return result.recordset[0];
};

// CREATE user
const createUser = async (username, email, password) => {
  const pool = getPool();
  const result = await pool
    .request()
    .input("Username", sql.VarChar, username)
    .input("Email", sql.VarChar, email)
    .input("Pass_word", sql.VarChar, password)
    .query(
      "INSERT INTO Users (Username, Email, Pass_word, CreatedAt) VALUES (@Username, @Email, @Pass_word, GETDATE()); SELECT SCOPE_IDENTITY() as UserID"
    );
  return result.recordset[0].UserID;
};

// UPDATE user
const updateUser = async (userId, username, email, password) => {
  const pool = getPool();
  const result = await pool
    .request()
    .input("UserID", sql.Int, userId)
    .input("Username", sql.VarChar, username)
    .input("Email", sql.VarChar, email)
    .input("Pass_word", sql.VarChar, password)
    .query(
      "UPDATE Users SET Username = @Username, Email = @Email, Pass_word = @Pass_word WHERE UserID = @UserID"
    );
  return result.rowsAffected[0];
};

// DELETE user
const deleteUser = async (userId) => {
  const pool = getPool();
  const result = await pool
    .request()
    .input("UserID", sql.Int, userId)
    .query("DELETE FROM Users WHERE UserID = @UserID");
  return result.rowsAffected[0];
};

module.exports = {
  getAllUsers,
  getUserById,
  getUserByUsername,
  createUser,
  updateUser,
  deleteUser,
};
