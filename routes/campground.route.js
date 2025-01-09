const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const validateCampground = require('../middleware/campgroundValidation')
const validateReview = require('../middleware/reviewValidation')
const Review = require('../models/review')

// Route: GET /campgrounds
router.get('/campgrounds', catchAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}));

// Route: GET /campgrounds/new
router.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
});

// Route: POST /campgrounds
router.post('/campgrounds', validateCampground, catchAsync(async (req, res, next) => {
    const newCampground = new Campground(req.body.campground);
    await newCampground.save();
    res.redirect(`/campgrounds/${newCampground._id}`);
}));

// Route: GET /campgrounds/:id
router.get('/campgrounds/:id', catchAsync(async (req, res, next) => {
    const campgrounds = await Campground.findById(req.params.id).populate('reviews');
    console.log(campgrounds)
    if (!campgrounds) {
        return next(new ExpressError("Campground not found", 404)); // Pass the error to next()
    }
    res.render('campgrounds/show', { campgrounds });
}));

// Route: GET /campgrounds/:id/edit
router.get('/campgrounds/:id/edit', catchAsync(async (req, res, next) => {
    const campgrounds = await Campground.findById(req.params.id);
    if (!campgrounds) {
        return next(new ExpressError("Campground not found", 404)); // Pass the error to next()
    }
    res.render('campgrounds/edit', { campgrounds });
}));

// Route: PUT /campgrounds/:id
router.put('/campgrounds/:id', validateCampground, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campgrounds = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { new: true });
    if (!campgrounds) {
        return next(new ExpressError("Campground not found", 404)); // Pass the error to next()
    }
    res.redirect(`/campgrounds/${campgrounds._id}`);
}));

// Route: DELETE /campgrounds/:id
router.delete('/campgrounds/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    if (!campground) {
        return next(new ExpressError("Campground not found", 404)); // Pass the error to next()
    }
    res.redirect('/campgrounds');
}));

// Review Routes
router.post('/campgrounds/:id/reviews', validateReview, catchAsync(async (req, res, next) => {
    const campgrounds = await Campground.findById(req.params.id);
    if (!campgrounds) {
        // If the campground is not found, return an error
        return next(new ExpressError('Campground not found', 404));
    }
    const review = new Review(req.body.review);
    campgrounds.reviews.push(review);
    try {
        await review.save();
        await campgrounds.save();
        res.redirect(`/campgrounds/${campgrounds._id}`);
    } catch (e) {
        next(new ExpressError('Error saving the review', 500));
    }
}));

// remove the review 
// remove the ref of this review from campground too
router.delete('/campgrounds/:id/reviews/:reviewId', catchAsync(async (req, res) => {
    // Extracting campground ID and review ID from request parameters
    const { id, reviewId } = req.params;

    // Use $pull to remove the review ID from the 'reviews' array in the Campground document
    // This ensures that the association between the campground and the review is removed by finding the campground document with the ID id and updates its reviews array by removing the element that matches reviewId.
    // $pull operator:
    // $pull is a MongoDB update operator that removes all instances of a value from an array.
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

    // Find the review by its ID and delete it from the 'Review' collection
    // This removes the actual review data from the database
    await Review.findByIdAndDelete(reviewId);

    // Redirect the user back to the campground's show page
    res.redirect(`/campgrounds/${id}`);
}));


router.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

router.use((err, req, res, next) => {
    const { message = "Something went wrong!", statusCode = 500 } = err;
    if (!err.message) err.message = 'oh , no something is going haywireeeeee!!!'
    res.status(statusCode).render('error', { err });
});


module.exports = router;

// joi
// The most powerful schema description language and data validator for JavaScript.

