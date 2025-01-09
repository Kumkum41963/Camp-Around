const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campgroundModel');

const showAllCampgrounds=async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}

const newCampgroundForm=(req, res) => {
    res.render('campgrounds/new');
}
const saveNewCampground=async (req, res, next) => {
    const newCampground = new Campground(req.body.campground);
    await newCampground.save();
    res.redirect(`/campgrounds/${newCampground._id}`);
}

const showSingleCampground=async (req, res, next) => {
    const campgrounds = await Campground.findById(req.params.id).populate('reviews');
    console.log(campgrounds)
    if (!campgrounds) {
        return next(new ExpressError("Campground not found", 404)); // Pass the error to next()
    }
    res.render('campgrounds/show', { campgrounds });
}

const showEditForm=async (req, res, next) => {
    const campgrounds = await Campground.findById(req.params.id);
    if (!campgrounds) {
        return next(new ExpressError("Campground not found", 404)); // Pass the error to next()
    }
    res.render('campgrounds/edit', { campgrounds });
}

const updateEditForm=async (req, res, next) => {
    const { id } = req.params;
    const campgrounds = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { new: true });
    if (!campgrounds) {
        return next(new ExpressError("Campground not found", 404)); // Pass the error to next()
    }
    res.redirect(`/campgrounds/${campgrounds._id}`);
}

const deleteCampground=async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    if (!campground) {
        return next(new ExpressError("Campground not found", 404)); // Pass the error to next()
    }
    res.redirect('/campgrounds');
}



module.exports={showAllCampgrounds,newCampgroundForm,saveNewCampground,showSingleCampground,showEditForm,updateEditForm,deleteCampground}