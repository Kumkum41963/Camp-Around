const ExpressError = require('../utils/ExpressError')
const { reviewSchema } = require('../validationSchemas')

// Middleware for validation
const validateReview = (req, res, next) => {
    // req.body becauce we reuire the whole joi review
    const { error } = reviewSchema.validate(req.body);

    if (error) {
        const msg = error.details.map(el => el.message).join(', ');
        return next(new ExpressError(msg, 400)); // Send the error to the next middleware
    } else {
        next(); // Proceed to the next middleware if validation passes
    }
};

module.exports = validateReview;