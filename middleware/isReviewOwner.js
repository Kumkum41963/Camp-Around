const Review=require('../models/reviewModel')

module.exports.isReviewAuthor=async(req,res,next)=>{
    const {reviewId}=req.params
    const review=await Review.findById(reviewId)
    if(!review.author.equals(req.user._id)){
        req.flash('error','You do not have permission, so stop trying')
        return res.redirect(`/reviews/${reviewId}`)
    }
}