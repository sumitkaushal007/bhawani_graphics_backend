// validators/search.validator.js

const { body, query, validationResult } = require('express-validator');

const validateSearchRequest = [
  query('type')
    .isIn(['product', 'client'])
    .withMessage('Type must be either "product" or "client"'),
  query('query')
    .isLength({ min: 3 })
    .withMessage('Query must be at least 3 characters long'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = {
  validateSearchRequest
};