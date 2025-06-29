const { body, query } = require('express-validator');

// Create Client Validator
exports.validateClientCreate = [
    // Client basic info
    body('name')
        .notEmpty().withMessage('Name is required'),

    body('mobile_number')
        .notEmpty().withMessage('Mobile number is required')
        .isLength({ max: 12 }).withMessage('Mobile number must not exceed 15 characters'),

    body('description')
        .optional().isString(),

    body('gst_number')
        .optional().isString(),

    // Client address (if provided)
    body('client_address').optional().isObject().withMessage('Client address must be an object'),

body('client_address.full_address')
    .if(body('client_address').exists())
    .notEmpty().withMessage('Full address is required'),

body('client_address.country')
    .if(body('client_address').exists())
    .notEmpty().withMessage('Country is required'),

body('client_address.zip_code')
    .if(body('client_address').exists())
    .notEmpty().withMessage('Zip code is required'),

body('client_address.state')
    .if(body('client_address').exists())
    .notEmpty().withMessage('State is required'),


    // Contact persons (if provided)
    [
        body('contact_persons')
            .optional()
            .isArray()
            .withMessage('Contact persons should be an array'),

        body('contact_persons.*.name')
            .optional()
            .notEmpty()
            .withMessage('Contact person name is required'),

        body('contact_persons.*.mobile')
            .optional()
            .notEmpty()
            .withMessage('Contact person mobile is required')
            .isLength({ max: 12 })
            .withMessage('Mobile number must not exceed 12 characters'),

        body('contact_persons.*.email')
            .optional()
            .notEmpty()
            .withMessage('Contact person email is required')
            .isEmail()
            .withMessage('Contact person email must be valid'),

        body('contact_persons.*.designation')
            .optional()
            .notEmpty()
            .withMessage('Contact person designation is required'),
    ]
];

// Update Client Validator
exports.validateClientUpdate = [
    // Optional fields
    body('name').optional().notEmpty().withMessage('Name cannot be empty if provided'),

    body('mobile_number').optional().notEmpty().withMessage('Mobile number cannot be empty if provided'),

    body('description').optional().isString(),

    body('gst_number').optional().isString(),

    // Client address (if provided)
    body('client_address').optional().isObject().withMessage('Client address must be an object'),

body('client_address.full_address')
    .if(body('client_address').exists())
    .notEmpty().withMessage('Full address is required'),

body('client_address.country')
    .if(body('client_address').exists())
    .notEmpty().withMessage('Country is required'),

body('client_address.zip_code')
    .if(body('client_address').exists())
    .notEmpty().withMessage('Zip code is required'),

body('client_address.state')
    .if(body('client_address').exists())
    .notEmpty().withMessage('State is required'),

    // Contact persons (if provided)
    body('contact_persons').optional().isArray().withMessage('Contact persons should be an array'),

    body('contact_persons.*.name')
        .if(body('contact_persons').exists())
        .notEmpty().withMessage('Contact person name is required'),

    body('contact_persons.*.mobile')
        .if(body('contact_persons').exists())
        .notEmpty().withMessage('Contact person mobile is required'),
];

// Client ID Validator (optional if you use path params)
exports.validateClientId = [
    body('client_id')
        .notEmpty().withMessage('Client ID is required')
];

exports.validateClientDelete = [
    // You can add additional validation here if needed
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