const { body, query } = require('express-validator');

// Create Client Validator
exports.validateClientCreate = [
    // Client basic info
    body('name')
        .notEmpty().withMessage('Name is required')
        .trim(),

    body('mobile_number')
        .notEmpty().withMessage('Mobile number is required')
        .isLength({ min: 10, max: 15 }).withMessage('Mobile number must be between 10-15 characters')
        .matches(/^\d+$/).withMessage('Mobile number must contain only digits'),

    body('description')
        .optional()
        .isString()
        .trim(),

    body('gst_number')
        .optional()
        .isString()
        .trim(),

    // Client address (optional and flexible)
    body('client_address')
        .optional()
        .isObject()
        .withMessage('Client address must be an object'),

    body('client_address.full_address')
        .optional()
        .isString()
        .trim(),

    body('client_address.country')
        .optional()
        .isString()
        .trim(),

    body('client_address.zip_code')
        .optional()
        .isString()
        .trim(),

    body('client_address.state')
        .optional()
        .isString()
        .trim(),

    // Contact persons (optional)
    body('contact_persons')
        .optional()
        .isArray()
        .withMessage('Contact persons should be an array'),

    body('contact_persons.*.name')
        .optional()
        .isString()
        .trim()
        .isLength({ min: 1 })
        .withMessage('Contact person name cannot be empty'),

    body('contact_persons.*.mobile')
        .optional()
        .isString()
        .trim()
        .matches(/^\d{10,15}$/)
        .withMessage('Contact person mobile must be 10-15 digits'),

    body('contact_persons.*.email')
        .optional()
        .isString()
        .trim()
        .custom((value) => {
            // Allow empty strings or valid emails
            if (!value || value.length === 0) {
                return true;
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                throw new Error('Invalid email format');
            }
            return true;
        }),

    body('contact_persons.*.designation')
        .optional()
        .isString()
        .trim(),

    // Client products validation (FIXED field names)
    body('client_products')
        .isArray({ min: 1 })
        .withMessage('At least one product is required'),

    body('client_products.*.product_name')
        .notEmpty()
        .withMessage('Product name is required')
        .isString()
        .trim(),

    body('client_products.*.product_description')
        .optional()
        .isString()
        .trim(),

    body('client_products.*.quantity')
        .notEmpty()
        .withMessage('Product quantity is required')
        .custom((value) => {
            const num = Number(value);
            if (isNaN(num) || num < 1 || !Number.isInteger(num)) {
                throw new Error('Product quantity must be a positive integer');
            }
            return true;
        }),

    body('client_products.*.price')
        .notEmpty()
        .withMessage('Product price is required')
        .custom((value) => {
            const num = Number(value);
            if (isNaN(num) || num < 0) {
                throw new Error('Product price must be a non-negative number');
            }
            return true;
        }),

    body('client_products.*.unit')
        .optional()
        .isString()
        .trim(),

    body('client_products.*.hsn_code')
        .optional()
        .isString()
        .trim(),

    // Allow product_id for updates
    body('client_products.*.product_id')
        .optional()
        .isString()
        .trim()
];

// Update Client Validator
exports.validateClientUpdate = [
    // Optional fields for update
    body('name')
        .optional()
        .notEmpty()
        .withMessage('Name cannot be empty if provided')
        .trim(),

    body('mobile_number')
        .optional()
        .notEmpty()
        .withMessage('Mobile number cannot be empty if provided')
        .isLength({ min: 10, max: 15 })
        .withMessage('Mobile number must be between 10-15 characters')
        .matches(/^\d+$/)
        .withMessage('Mobile number must contain only digits'),

    body('description')
        .optional()
        .isString()
        .trim(),

    body('gst_number')
        .optional()
        .isString()
        .trim(),

    // Client address (optional for update)
    body('client_address')
        .optional()
        .isObject()
        .withMessage('Client address must be an object'),

    body('client_address.full_address')
        .optional()
        .isString()
        .trim(),

    body('client_address.country')
        .optional()
        .isString()
        .trim(),

    body('client_address.zip_code')
        .optional()
        .isString()
        .trim(),

    body('client_address.state')
        .optional()
        .isString()
        .trim(),

    // Contact persons (optional for update)
    body('contact_persons')
        .optional()
        .isArray()
        .withMessage('Contact persons should be an array'),

    body('contact_persons.*.name')
        .optional()
        .isString()
        .trim()
        .isLength({ min: 1 })
        .withMessage('Contact person name cannot be empty'),

    body('contact_persons.*.mobile')
        .optional()
        .isString()
        .trim()
        .matches(/^\d{10,15}$/)
        .withMessage('Contact person mobile must be 10-15 digits'),

    body('contact_persons.*.email')
        .optional()
        .isString()
        .trim()
        .custom((value) => {
            if (!value || value.length === 0) {
                return true;
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                throw new Error('Invalid email format');
            }
            return true;
        }),

    body('contact_persons.*.designation')
        .optional()
        .isString()
        .trim(),

    // Client products validation for update (FIXED field names)
    body('client_products')
        .optional()
        .isArray()
        .withMessage('Client products should be an array'),

    body('client_products.*.product_name')
        .optional()
        .isString()
        .trim()
        .isLength({ min: 1 })
        .withMessage('Product name cannot be empty if provided'),

    body('client_products.*.product_description')
        .optional()
        .isString()
        .trim(),

    body('client_products.*.quantity')
        .optional()
        .custom((value) => {
            if (value !== undefined && value !== null && value !== '') {
                const num = Number(value);
                if (isNaN(num) || num < 1 || !Number.isInteger(num)) {
                    throw new Error('Product quantity must be a positive integer');
                }
            }
            return true;
        }),

    body('client_products.*.price')
        .optional()
        .custom((value) => {
            if (value !== undefined && value !== null && value !== '') {
                const num = Number(value);
                if (isNaN(num) || num < 0) {
                    throw new Error('Product price must be a non-negative number');
                }
            }
            return true;
        }),

    body('client_products.*.unit')
        .optional()
        .isString()
        .trim(),

    body('client_products.*.hsn_code')
        .optional()
        .isString()
        .trim(),

    body('client_products.*.product_id')
        .optional()
        .isString()
        .trim()
];

// Client ID Validator
exports.validateClientId = [
    body('client_id')
        .notEmpty()
        .withMessage('Client ID is required')
];

exports.validateClientDelete = [
    // Additional validation can be added here if needed
];

// Full-text search validator for clients
exports.fullTextSearch = [
    // At least one field must be provided
    query()
        .custom((value, { req }) => {
            const { client_name, contact_no, gst, address, contact_person_name } = req.query;
            
            // Check if at least one search field is provided and not empty
            const hasClientName = client_name && client_name.trim().length > 0;
            const hasContactNo = contact_no && contact_no.trim().length > 0;
            const hasGst = gst && gst.trim().length > 0;
            const hasAddress = address && address.trim().length > 0;
            const hasContactPersonName = contact_person_name && contact_person_name.trim().length > 0;
            
            if (!hasClientName && !hasContactNo && !hasGst && !hasAddress && !hasContactPersonName) {
                throw new Error('At least one search field is required (client_name, contact_no, gst, address, or contact_person_name)');
            }
            
            return true;
        }),

    // Individual field validations (all optional but with constraints when provided)
    query('client_name')
        .optional()
        .isLength({ min: 1, max: 255 })
        .withMessage('Client name must be between 1 and 255 characters')
        .trim(),

    query('contact_no')
        .optional()
        .isLength({ min: 1, max: 15 })
        .withMessage('Contact number must be between 1 and 15 characters')
        .trim(),

    query('gst')
        .optional()
        .isLength({ min: 1, max: 20 })
        .withMessage('GST number must be between 1 and 20 characters')
        .trim(),

    query('address')
        .optional()
        .isLength({ min: 1, max: 500 })
        .withMessage('Address must be between 1 and 500 characters')
        .trim(),

    query('contact_person_name')
        .optional()
        .isLength({ min: 1, max: 255 })
        .withMessage('Contact person name must be between 1 and 255 characters')
        .trim(),

    // Pagination parameters
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),

    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100')
];