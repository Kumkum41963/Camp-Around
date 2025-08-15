const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const validateCampground = require('../middleware/campgroundValidation')
const { isLoggedIn } = require('../middleware/isLoggedIn')
const { isAuthor } = require('../middleware/isOwner')
const multer = require('multer')
const { storage } = require('../cloudinary/index')
const upload = multer({ storage })
const { showAllCampgrounds, newCampgroundForm, saveNewCampground, showSingleCampground, showEditForm, updateEditForm, deleteCampground } = require('../controller/campgroundController')

router.get('/', catchAsync(showAllCampgrounds));

router.get('/new', newCampgroundForm);

// POST route for adding a new campground
router.post(
    '/',
    isLoggedIn,

    upload.array('image'), // // Multer handles multiple files from 'image' input and adds them to req.files

    // The image is uploaded first because the file is added to the request body before validation.
    // multer parses the incoming multipart/form-data, processes the file(s),
    // and attaches them to the `req.body` (in `req.files` for multiple files or `req.file` for a single file).

    validateCampground,
    // Validate the campground data in the request body after the file is uploaded
    // The `validateCampground` middleware ensures that the campground data is sent in the request body 
    // (such as title, location, description, and price) meets the required format and constraints 
    // (e.g., checking for empty fields, valid values, etc.). It ensures that only valid data 
    // is passed to the next middleware (saving the new campground to the database).

    catchAsync(saveNewCampground) // Save the new campground to the database, with the validated body and uploaded image(s)
);

// router.post('/', upload.array('image'), (req, res) => {
//     if (!req.file) {
//         return res.status(400).send('No file uploaded');
//     }
//     res.status(200).send({
//         message: 'File uploaded successfully',
//         body: req.body,
//         file: req.file
//     });
// });


router.get('/:id', catchAsync(showSingleCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(showEditForm));

router.put('/:id', isLoggedIn, isAuthor, upload.array('image'), catchAsync(updateEditForm));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(deleteCampground));

module.exports = router;

// joi
// The most powerful schema description language and data validator for JavaScript syntaxes.

