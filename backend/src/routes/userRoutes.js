const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// GET all users
router.get("/", userController.getAllUsers);

// CREATE user
router.post("/", userController.createUser);

// LOGIN user
router.post("/login/authenticate", userController.loginUser);

// GET user by ID
router.get("/:id", userController.getUserById);

// UPDATE user
router.put("/:id", userController.updateUser);

// DELETE user
router.delete("/:id", userController.deleteUser);

module.exports = router;
