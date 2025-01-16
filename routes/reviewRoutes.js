const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const validateReview = require('../middleware/reviewValidation')
const {isLoggedIn}=require('../middleware/isLoggedIn')
const { saveReview, deleteReview } = require('../controller/reviewController')

// Review Routes
router.post('/:id/reviews', isLoggedIn,validateReview, catchAsync(saveReview));

// remove the review 
// remove the ref of this review from campground too
router.delete('/:id/reviews/:reviewId', isLoggedIn,catchAsync(deleteReview));

module.exports = router

// Therefore, make sure to update your /logout route in the routes/users.js code so it looks like this:

// router.get('/logout', (req, res, next) => {
//     req.logout(function (err) {
//         if (err) {
//             return next(err);
//         }
//         req.flash('success', 'Goodbye!');
//         res.redirect('/campgrounds');
//     });
// }); 