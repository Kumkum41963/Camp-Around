const ExpressError = require('../utils/ExpressError');
const Review = require('../models/reviewModel')
const Campground = require('../models/campgroundModel');

const saveReview = async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        // If the campground is not found, return an error
        return next(new ExpressError('Campground not found', 404));
    }
    const review = new Review(req.body.review);
    review.author=req.user._id;
    campground.reviews.push(review);
    try {
        await review.save();
        await campground.save();
        req.flash('success', 'Successfully saved review')
        res.redirect(`/campgrounds/${campground._id}`);
    } catch (e) {
        next(new ExpressError('Error saving the review', 500));
    }
}

// remove the review 
// remove the ref of this review from campground too
const deleteReview = async (req, res) => {
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

    req.flash('success', 'Successfully deleted review')

    // Redirect the user back to the campground's show page
    res.redirect(`/campgrounds/${id}`);
}

module.exports = { saveReview, deleteReview }