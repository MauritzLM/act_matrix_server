const express = require('express');
const router = express.Router();

const authController = require("../controllers/auth");
const matrixController = require("../controllers/matrix");

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

// delete matrix
router.delete("/delete-matrix", matrixController.deleteMatrix);

module.exports = router;