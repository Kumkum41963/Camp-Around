const User = require('../models/userModel')
const { storeReturnToInLocals } = require('../middleware/isLoggedIn');
const passport = require('passport')

const showRegisterForm = (req, res) => {
    res.render('users/register')
}

const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body // get data

        const user = new User({ email, username }) // create user object

        const registeredUser = await User.register(user, password)

        console.log(registeredUser)
        // "Model.register()" : It create a new user, hashes the password, stores it with the user, and saves the user to MongoDB

        // For invoking automatic login of the newly registered user:
        req.login(registeredUser, err => { // It stores the user’s ID in the session (serialization)
            if (err) return next(err);
            req.flash('success', 'Welcome To Camp-Around')
            res.redirect('/campgrounds')
        })
    } catch (error) {
        req.flash('error', error.message)
        res.redirect('/register')
    }
}

const showLoginForm = (req, res) => {
    res.render('users/login')
}

// [] as we wish to run these middlewares one after other in writtten form only
const loginUser = [
    // Middleware 1: Save the 'returnTo' value for redirection
    storeReturnToInLocals, 

    // Middleware 2: Authenticate the user using Passport.js
    passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), // it was used here instead of req.login() cause it first validtes users credentials then internally login whereas the other directly login since in register user is already validated 

    // "successRedirect" is not used in passport.authenticate()
    // here is because we want to dynamically redirect the user
    // back to where they were trying to go before logging in

    // Middleware 3: Final handler to flash a success message and redirect
    (req, res) => {
        req.flash('success', 'Welcome back!');
        // Redirect to the saved page or default to '/campgrounds'
        const redirectUrl = res.locals.returnTo || '/campgrounds';
        res.redirect(redirectUrl);
    }
];

// Passport fxn to removethe user from the session
// And Clear authentication info
const logoutUser = (req, res) => {
    req.logout((err) => {
        if (err) { return err }
        else {
            req.flash('success', 'Goodbye, cause now you are Logged out')
            res.redirect('/login')
        }
    });
}

module.exports = { showRegisterForm, registerUser, showLoginForm, loginUser, logoutUser }
