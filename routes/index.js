const express = require('express');
const router = express.Router();

const authController = require("../controllers/auth");
const matrixController = require("../controllers/matrix");

// sign up
router.post("/signup", authController.signup);

// login
router.post("/login", authController.login);

// logout
router.post("/logout", authController.logout);

// delete account
router.post("/delete", authController.delete);

module.exports = router;