const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const validateReview = require('../middleware/reviewValidation')
const { saveReview, deleteReview } = require('../controller/reviewController')

// Review Routes
router.post('/:id/reviews', validateReview, catchAsync(saveReview));

// remove the review 
// remove the ref of this review from campground too
router.delete('/:id/reviews/:reviewId', catchAsync(deleteReview));

module.exports = router