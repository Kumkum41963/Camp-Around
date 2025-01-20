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
    try {
        // Find the campground by ID, populate associated reviews, and populate authors for both campground and reviews
        const campground = await Campground.findById(req.params.id)
            .populate({
                path: 'reviews', // Populate the 'reviews' field
                populate: {
                    path: 'author', 
                    select:'username'
                },
            })
            .populate('author'); // Populate the 'author' field for the campground

        // Check if the campground exists
        if (!campground) {
            req.flash('error', 'Campground not found'); // Flash an error message if not found
            return res.redirect('/campgrounds'); // Redirect to the campgrounds list
        }

        // Log the campground for debugging purposes
        console.log('Campground data:', campground);

        // Render the show page, passing the campground data to the template
        res.render('campgrounds/show', { campground });
    } catch (error) {
        // Handle errors (e.g., invalid ID or database issues)
        console.error('Error fetching campground:', error);
        req.flash('error', 'Something went wrong, please try again later.');
        res.redirect('/campgrounds'); // Redirect to the campgrounds list
    }
};

const showEditForm = async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'Campground not found')
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}

const updateEditForm = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id, { ...req.body.campground }, { new: true });
    if (!campground) {
        return next(new ExpressError("Campground not found", 404)); // Pass the error to next()
    }
    req.flash('success', 'Successfully updated campground')
    res.redirect(`/campgrounds/${campground._id}`);
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