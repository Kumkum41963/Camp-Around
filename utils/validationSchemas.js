const BaseJoi = require('joi'); 
const sanitizeHtml = require('sanitize-html'); 

// Define a custom Joi extension for HTML sanitization
const extension = (joi) => ({
    type: 'string',
    base: joi.string(), // Use "joi.string()" instead of "Joi.string()"
    messages: {
        'string.escapeHtml': '{{#label}} must not include HTML!',
    },
    rules: {
        escapeHtml: {
            validate(value, helpers) { // Corrected "headers" to "helpers"
                const clean = sanitizeHtml(value, {
                    allowedTags: [], // Remove all HTML tags
                    allowedAttributes: {}, // Remove all attributes
                });
                if (clean !== value) {
                    return helpers.error('string.escapeHtml', { value });
                }
                return clean;
            }
        }
    }
});

// Extend Joi with HTML escaping function
const Joi = BaseJoi.extend(extension);

module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required().escapeHtml(),
        location: Joi.string().required().escapeHtml(),
        images: Joi.array().items(Joi.object({ url: Joi.string(), filename: Joi.string() })), // Fixed "image" -> "images"
        description: Joi.string().required().escapeHtml(),
        price: Joi.number().required().min(0)
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().min(1).max(5).required(),
        body: Joi.string().required().escapeHtml()
    }).required()
});
