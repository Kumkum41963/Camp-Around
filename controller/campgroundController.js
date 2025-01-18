const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campgroundModel');

const showAllCampgrounds = async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}

const newCampgroundForm = (req, res) => {
    res.render('campgrounds/new');
}

const saveNewCampground = async (req, res, next) => {
    const newCampground = new Campground(req.body.campground);
    // create an author associated to this currently logged in user
    newCampground.author=req.user._id
    await newCampground.save();
    req.flash('success', 'Campground created successfully')
    res.redirect(`/campgrounds/${newCampground._id}`);
}

const showSingleCampground = async (req, res, next) => {
    const campgrounds = await Campground.findById(req.params.id).populate('reviews').populate('author');
    console.log('Checking why author not coming : ',campgrounds)
    if (!campgrounds) {
        req.flash('error', 'Campground not found');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campgrounds });
}

const showEditForm = async (req, res, next) => {
    const campgrounds = await Campground.findById(req.params.id);
    if (!campgrounds) {
        req.flash('error', 'Campground not found')
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campgrounds });
}

const updateEditForm = async (req, res, next) => {
    const { id } = req.params;
    const campgrounds = await Campground.findById(id, { ...req.body.campground }, { new: true });
    if (!campgrounds) {
        return next(new ExpressError("Campground not found", 404)); // Pass the error to next()
    }
    req.flash('success', 'Successfully updated campground')
    res.redirect(`/campgrounds/${campgrounds._id}`);
}

const deleteCampground = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    if (!campground) {
        return next(new ExpressError("Campground not found", 404)); // Pass the error to next()
    }
    req.flash('success', 'Successfully deleted campground')
    res.redirect('/campgrounds');
}

module.exports = { showAllCampgrounds, newCampgroundForm, saveNewCampground, showSingleCampground, showEditForm, updateEditForm, deleteCampground }