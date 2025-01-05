const express = require('express')
const router = express.Router()
const Campground = require('../models/campground')

// all camgrounds
router.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
})

// router.get('/makecampground', async (req, res) => {
//     const camp = new Campground({
//         title: 'My Backyard but from routes folder',
//         description: 'A beautiful place to relax and enjoy nature.',
//         price: 25,
//         location: 'New York, USA'
//     });
//     await camp.save();
//     res.send(camp);
// });

// the order does matter for we can not have new being treated as our id if campgrounds/:id comes first
// displaying the page where we can create new campground -> form
router.get('/campgrounds/new',(req,res)=>{
    res.render('campgrounds/new')
})

// allows client to enter and save the data
router.post('/campgrounds',async (req,res)=>{
    const newCampground=new Campground(req.body.campground)
    await newCampground.save();
    res.redirect(`/campgrounds/${newCampground._id}`)
})

// displaying single campground
router.get('/campgrounds/:id',async (req,res)=>{
    const campgrounds = await Campground.findById(req.params.id);
    res.render('campgrounds/show',{campgrounds})
})

// displaying to be edit campground form
router.get('/campgrounds/:id/edit',async (req,res)=>{
    const campgrounds = await Campground.findById(req.params.id);
    res.render('campgrounds/edit',{campgrounds})
})

router.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campgrounds = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { new: true });
    res.redirect(`/campgrounds/${campgrounds._id}`);
});

router.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
   await Campground.findByIdAndDelete(id, { ...req.body.campground }, { new: true });
    res.redirect(`/campgrounds`);
});



module.exports = router