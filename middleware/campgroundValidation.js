const ExpressError = require('../utils/ExpressError'); // Ensure you are importing ExpressError properly
const { campgroundSchema } = require('../validationSchemas')

// Middleware for validation
const validateCampground = (req, res, next) => {
    // req.body becauce we require the whole 'joi' campground
    const { error } = campgroundSchema.validate(req.body);

    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        return next(new ExpressError(msg, 400)); // Send the error to the next middleware
    } else {
        next(); // Proceed to the next middleware if validation passes
    }
};

module.exports = validateCampground;
