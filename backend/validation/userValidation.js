const Joi = require('joi');

// Sanitization function to remove HTML tags and dangerous characters
const sanitizeString = (value, helpers) => {
    if (typeof value !== 'string') return value;
    
    // Remove HTML tags and dangerous characters
    const sanitized = value
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/[<>]/g, '') // Remove < and >
        .replace(/javascript:/gi, '') // Remove javascript: protocol
        .replace(/on\w+=/gi, '') // Remove event handlers
        .trim();
    
    if (sanitized !== value) {
        return helpers.error('any.invalid');
    }
    
    return value;
};

// Email validation with sanitization
const emailSchema = Joi.string()
    .email({ tlds: { allow: false } })
    .lowercase()
    .trim()
    .max(254)
    .custom(sanitizeString, 'sanitize email')
    .messages({
        'string.email': 'Please provide a valid email address',
        'string.max': 'Email address is too long',
        'any.invalid': 'Email contains invalid characters'
    });

// Password validation
const passwordSchema = Joi.string()
    .min(8)
    .max(128)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .messages({
        'string.min': 'Password must be at least 8 characters long',
        'string.max': 'Password is too long',
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    });

// Name validation with sanitization
const nameSchema = Joi.string()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-Z\s'-]+$/)
    .custom(sanitizeString, 'sanitize name')
    .messages({
        'string.min': 'Name must be at least 2 characters long',
        'string.max': 'Name is too long',
        'string.pattern.base': 'Name can only contain letters, spaces, hyphens, and apostrophes',
        'any.invalid': 'Name contains invalid characters'
    });

// Phone validation
const phoneSchema = Joi.string()
    .pattern(/^[\+]?[1-9][\d]{0,15}$/)
    .max(20)
    .custom(sanitizeString, 'sanitize phone')
    .messages({
        'string.pattern.base': 'Please provide a valid phone number',
        'string.max': 'Phone number is too long',
        'any.invalid': 'Phone number contains invalid characters'
    });

// Address validation with sanitization
const addressSchema = Joi.string()
    .min(5)
    .max(200)
    .custom(sanitizeString, 'sanitize address')
    .messages({
        'string.min': 'Address must be at least 5 characters long',
        'string.max': 'Address is too long',
        'any.invalid': 'Address contains invalid characters'
    });

// Country validation
const countrySchema = Joi.string()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-Z\s'-]+$/)
    .custom(sanitizeString, 'sanitize country')
    .messages({
        'string.min': 'Country must be at least 2 characters long',
        'string.max': 'Country name is too long',
        'string.pattern.base': 'Country can only contain letters, spaces, hyphens, and apostrophes',
        'any.invalid': 'Country contains invalid characters'
    });

// Region/State validation
const regionStateSchema = Joi.string()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-Z\s'-]+$/)
    .custom(sanitizeString, 'sanitize region/state')
    .messages({
        'string.min': 'Region/State must be at least 2 characters long',
        'string.max': 'Region/State name is too long',
        'string.pattern.base': 'Region/State can only contain letters, spaces, hyphens, and apostrophes',
        'any.invalid': 'Region/State contains invalid characters'
    });

// Item validation schemas
const itemNameSchema = Joi.string()
    .min(2)
    .max(100)
    .custom(sanitizeString, 'sanitize item name')
    .messages({
        'string.min': 'Item name must be at least 2 characters long',
        'string.max': 'Item name is too long',
        'any.invalid': 'Item name contains invalid characters'
    });

const descriptionSchema = Joi.string()
    .min(10)
    .max(1000)
    .custom(sanitizeString, 'sanitize description')
    .messages({
        'string.min': 'Description must be at least 10 characters long',
        'string.max': 'Description is too long',
        'any.invalid': 'Description contains invalid characters'
    });

const priceSchema = Joi.number()
    .positive()
    .precision(2)
    .max(999999.99)
    .messages({
        'number.base': 'Price must be a number',
        'number.positive': 'Price must be positive',
        'number.precision': 'Price can have maximum 2 decimal places',
        'number.max': 'Price is too high'
    });

const quantitySchema = Joi.number()
    .integer()
    .min(0)
    .max(999999)
    .messages({
        'number.base': 'Quantity must be a number',
        'number.integer': 'Quantity must be a whole number',
        'number.min': 'Quantity cannot be negative',
        'number.max': 'Quantity is too high'
    });

// Validation schemas for different operations
const signUpSchema = Joi.object({
    first_name: nameSchema.required(),
    last_name: nameSchema.required(),
    email: emailSchema.required(),
    confirm_password: passwordSchema.required(),
    phone: phoneSchema.required(),
    address: addressSchema.required(),
    country: countrySchema.required(),
    region_state: regionStateSchema.required(),
    profile_picture: Joi.string().optional(),
    role: Joi.string().valid('admin', 'user').default('user')
});

const loginSchema = Joi.object({
    email: emailSchema.required(),
    password: Joi.string().required().messages({
        'string.empty': 'Password is required',
        'any.required': 'Password is required'
    })
});

const updateProfileSchema = Joi.object({
    first_name: nameSchema.optional(),
    last_name: nameSchema.optional(),
    email: emailSchema.optional(),
    phone: phoneSchema.optional(),
    address: addressSchema.optional(),
    country: countrySchema.optional(),
    region_state: regionStateSchema.optional(),
    profile_picture: Joi.string().optional()
});

const forgotPasswordSchema = Joi.object({
    email: emailSchema.required()
});

const resetPasswordSchema = Joi.object({
    token: Joi.string().required().messages({
        'string.empty': 'Token is required',
        'any.required': 'Token is required'
    }),
    newPassword: passwordSchema.required()
});

const verifyOtpSchema = Joi.object({
    email: emailSchema.required(),
    otp: Joi.string().length(6).pattern(/^\d{6}$/).required().messages({
        'string.length': 'OTP must be exactly 6 digits',
        'string.pattern.base': 'OTP must contain only numbers',
        'any.required': 'OTP is required'
    })
});

const createItemSchema = Joi.object({
    item_name: itemNameSchema.required(),
    description: descriptionSchema.required(),
    item_price: priceSchema.required(),
    item_quantity: quantitySchema.required(),
    item_type: Joi.string().min(2).max(50).required().custom(sanitizeString, 'sanitize item type'),
    sub_item_type: Joi.string().min(2).max(50).optional().custom(sanitizeString, 'sanitize sub item type')
});

const updateItemSchema = Joi.object({
    item_name: itemNameSchema.optional(),
    description: descriptionSchema.optional(),
    item_price: priceSchema.optional(),
    item_quantity: quantitySchema.optional(),
    item_type: Joi.string().min(2).max(50).optional().custom(sanitizeString, 'sanitize item type'),
    sub_item_type: Joi.string().min(2).max(50).optional().custom(sanitizeString, 'sanitize sub item type')
});

const addToCartSchema = Joi.object({
    userId: Joi.string().required().messages({
        'string.empty': 'User ID is required',
        'any.required': 'User ID is required'
    }),
    items: Joi.array().items(
        Joi.object({
            itemId: Joi.string().required(),
            quantity: Joi.number().integer().min(1).max(100).default(1)
        })
    ).min(1).required().messages({
        'array.min': 'At least one item is required',
        'any.required': 'Items are required'
    })
});

const placeOrderSchema = Joi.object({
    userId: Joi.string().required(),
    address: addressSchema.required(),
    phone_no: phoneSchema.required(),
    items: Joi.array().items(
        Joi.object({
            itemId: Joi.string().required(),
            quantity: Joi.number().integer().min(1).max(100).required(),
            price: priceSchema.required()
        })
    ).min(1).required(),
    total_amount: priceSchema.required()
});

const searchItemsSchema = Joi.object({
    query: Joi.string().min(1).max(100).required().custom(sanitizeString, 'sanitize search query').messages({
        'string.min': 'Search query must be at least 1 character long',
        'string.max': 'Search query is too long',
        'any.required': 'Search query is required',
        'any.invalid': 'Search query contains invalid characters'
    })
});

// Validation middleware
const validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, { 
            abortEarly: false,
            stripUnknown: true 
        });
        
        if (error) {
            const errorMessage = error.details.map(detail => detail.message).join(', ');
            return res.status(400).json({ 
                message: 'Validation failed', 
                errors: errorMessage 
            });
        }
        
        // Replace request body with sanitized data
        req.body = value;
        next();
    };
};

// Query validation middleware
const validateQuery = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.query, { 
            abortEarly: false,
            stripUnknown: true 
        });
        
        if (error) {
            const errorMessage = error.details.map(detail => detail.message).join(', ');
            return res.status(400).json({ 
                message: 'Query validation failed', 
                errors: errorMessage 
            });
        }
        
        // Replace request query with sanitized data
        req.query = value;
        next();
    };
};

module.exports = {
    signUpSchema,
    loginSchema,
    updateProfileSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    verifyOtpSchema,
    createItemSchema,
    updateItemSchema,
    addToCartSchema,
    placeOrderSchema,
    searchItemsSchema,
    validate,
    validateQuery,
    sanitizeString
};