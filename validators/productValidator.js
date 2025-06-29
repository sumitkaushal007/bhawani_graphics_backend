const { body, param, query } = require("express-validator");


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

// Search validators
exports.listProducts = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
    
    query('search')
        .optional()
        .isLength({ min: 1, max: 255 })
        .withMessage('Search term must be between 1 and 255 characters')
        .trim()
];

    exports.fullTextSearch = [
    query('q')
        .notEmpty()
        .withMessage('Search term is required')
        .isLength({ min: 1, max: 255 })
        .withMessage('Search term must be between 1 and 255 characters')
        .trim(),

    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),

    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),

        query('column')
        .optional()
        .isIn(['name', 'brand', 'material', 'description'])
        .withMessage('Column must be one of: name, brand, material, description'),
    ];
