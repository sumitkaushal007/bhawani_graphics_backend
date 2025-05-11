


const { body } = require('express-validator');

// Create Client Validator
exports.validateClientCreate = [
    // Client basic info
    body('name')
        .notEmpty().withMessage('Name is required'),

    body('mobile_number')
        .notEmpty().withMessage('Mobile number is required'),

    body('description')
        .optional().isString(),

    body('gst_number')
        .optional().isString(),

    // Client address (if provided)
    body('client_address').optional().isObject(),

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

// Update Client Validator
exports.validateClientUpdate = [
    // Optional fields
    body('name').optional().notEmpty().withMessage('Name cannot be empty if provided'),

    body('mobile_number').optional().notEmpty().withMessage('Mobile number cannot be empty if provided'),

    body('description').optional().isString(),

    body('gst_number').optional().isString(),

    // Client address (if provided)
    body('client_address').optional().isObject(),

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