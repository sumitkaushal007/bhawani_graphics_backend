const { body, param } = require("express-validator");
exports.addProduct = [
    body("name")
        .notEmpty()
        .withMessage("name should not be empty")
        .isLength({min: 2})
        .withMessage("name must be at least 5 characters long"),

    body("standard_price")
        .notEmpty()
        .withMessage("Price should not be empty")
        .isDecimal()
        .withMessage("Price should be a number or flot value")
];

exports.getProduct = [
    param("id")
        .notEmpty()
        .withMessage("id should not be empty")
        .isNumeric()
        .withMessage("id must be a number"),
];

exports.updateProduct = [
    param('id')
        .notEmpty()
        .withMessage('id is required')
        .isNumeric()
        .withMessage('id should be a number'),
        
    body("name")
        .notEmpty()
        .withMessage("name should not be empty")
        .isLength({min: 2})
        .withMessage("name must be at least 5 characters long"),

    body("standard_price")
        .notEmpty()
        .withMessage("Price should not be empty")
        .isDecimal()
        .withMessage("Price should be a number or flot value")
];