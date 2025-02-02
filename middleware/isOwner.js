const Campground=require('../models/campgroundModel')

module.exports.isAuthor=async(req,res,next)=>{
    const {id}=req.params
    const campground=await Campground.findById(id)
    if (!campground || !campground.author) {
        req.flash('error', 'Campground not found or missing author field');
        return res.redirect('/campgrounds');
    }

    if (!req.user || !req.user._id) {
        req.flash('error', 'You must be logged in');
        return res.redirect('/login');
    }

    if(!campground.author.equals(req.user._id)){
        req.flash('error','You do not have permission, so stop trying')
        return res.redirect(`/campgrounds/${id}`)
    }

    next(); // Proceed to next middleware if authorized
}