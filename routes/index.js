const express = require('express');
const router = express.Router();

const authController = require("../controllers/auth");
const matrixController = require("../controllers/matrix");
const userController = require("../controllers/user");

// AUTHENTICATION
// sign up
router.post("/signup", authController.signup);

// login
router.post("/login", authController.login);

// logout
router.post("/logout", authController.logout);

// delete account
router.post("/delete-user", authController.delete);

// MATRIX
// get matrix
router.post("/matrix", matrixController.getMatrix);

// get all matrix
router.post("/all-matrix", matrixController.getAllMatrix);

// create matrix
router.post("/new-matrix", matrixController.createMatrix);

// update matrix
router.put("/update-matrix", matrixController.updateMatrix);

//update matrix title
router.put("/update-title", matrixController.updateTitle);

// delete matrix
router.post("/delete-matrix", matrixController.deleteMatrix);

// USER PROFILE
router.post("/update-profile", userController.updateProfile);

module.exports = router;