const User = require('../models/userModel')
const { storeReturnTo } = require('../middleware/isLoggedIn');
const passport = require('passport')

const showRegisterForm = (req, res) => {
    res.render('users/register')
}

const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body
        const user = new User({ email, username })
        const registeredUser = await User.register(user, password)
        console.log(registeredUser)
        // it is a method of passport only that 
        // creates a session and stores their serialized user ID in the session store
        // for invoking automatically log in the newly registered use
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'welcome to camp-around')
            res.redirect('/campgrounds')
        })
    } catch (error) {
        req.flash('error', error.message)
        res.redirect('register')
    }
}

const showLoginForm = (req, res) => {
    res.render('users/login')
}

const loginUser = [
    // Middleware 1: Save the 'returnTo' value for redirection
    storeReturnTo, 

    // Middleware 2: Authenticate the user using Passport.js
    passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),

    // Middleware 3: Final handler to flash a success message and redirect
    (req, res) => {
        req.flash('success', 'Welcome back!'); // Display success message
        // Redirect to the saved page or default to '/campgrounds'
        const redirectUrl = res.locals.returnTo || '/campgrounds';
        res.redirect(redirectUrl);
    }
];

const logoutUser = (req, res) => {
    req.logout((err) => {
        if (err) { return err }
        else {
            req.flash('success', 'goodbye cause now you are logged out')
            res.redirect('/login')
        }
    });
}

module.exports = { showRegisterForm, registerUser, showLoginForm, loginUser, logoutUser }
