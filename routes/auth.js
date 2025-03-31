const express = require("express");
const { validateSignup, validateSignin } = require("../validators/authValidator");
const { signup, login } = require("../controllers/authController");

const router = express.Router();

router.post("/signup", validateSignup, signup);
router.post("/login", validateSignin, login);

module.exports = router;
