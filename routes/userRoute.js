const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const User = require('../models/userModel')
const { storeReturnTo } = require('../middleware/isLoggedIn');
const passport = require('passport')


router.get('/register', (req, res) => {
    res.render('users/register')
})

router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body
        const user = new User({ email, username })
        const registeredUser = await User.register(user, password)
        console.log(registeredUser)
        req.login(registeredUser,err=>{
            if(err) return next(err);
            req.flash('success', 'welcome to camp-around')
            res.redirect('/campgrounds')
        })
    } catch (error) {
        req.flash('error', error.message)
        res.redirect('register')
    }
})

router.get('/login', (req, res) => {
    res.render('users/login')
})

router.post('/login',
    // use the storeReturnTo middleware to save the returnTo value from session to res.locals
    storeReturnTo,
    // passport.authenticate logs the user in and clears req.session
    passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}),
    // Now we can use res.locals.returnTo to redirect the user after login
    (req, res) => {
        req.flash('success', 'Welcome back!');
        const redirectUrl = res.locals.returnTo || '/campgrounds'; // update this line to use res.locals.returnTo now
        res.redirect(redirectUrl);
    });
module.exports = router