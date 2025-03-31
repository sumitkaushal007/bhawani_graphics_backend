const { body } = require("express-validator");

exports.validateSignup = [
  body("username")
    .trim()
    .notEmpty().withMessage("Username is required")
    .isLength({ min: 3 }).withMessage("Username must be at least 3 characters long"),

  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email format"),

  body("password")
    .trim()
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),

  body("roleId")
    .isNumeric().withMessage("roleId should be a number")
    .notEmpty().withMessage("roleId is required"),
];

exports.validateSignin = [
    body("email")
      .trim()
      .notEmpty().withMessage("Email is required")
      .isEmail().withMessage("Invalid email format"),
      
    body("password")
      .trim()
      .notEmpty().withMessage("Password is required")
      .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),

    body("roleId")
      .trim()
      .notEmpty()
      .withMessage("Role id is required")
  ];


