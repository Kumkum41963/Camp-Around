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
    // Use the storeReturnTo middleware to save the returnTo value from session to res.locals
    storeReturnTo,
    // passport.authenticate logs the user in and clears req.session
    passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),
    // Now we can use res.locals.returnTo to redirect the user after login
    (req, res) => {
      req.flash('success', 'Welcome back!');
      const redirectUrl = res.locals.returnTo || '/campgrounds'; // Use res.locals.returnTo for redirection
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
