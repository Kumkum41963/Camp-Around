// Middleware to check if the user is logged in
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) { // user authenticated or not
        // Store the current URL in the session for redirection after login (will be used in "storeReturnTo" middleware)
        req.session.returnTo = req.originalUrl; // originalUrl defined by express
        console.log(req.originalUrl);

        // Show a flash message to login
        req.flash('error', 'Kindly login first!');

        // Redirect to login page
        return res.redirect('/login');
    }
    // Otherwise proceed to the next middleware or router
    next();
};

// Middleware to retrieve and store the 'returnTo' URL in res.locals for dynamic redirection
module.exports.storeReturnToInLocals = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo; // copy to locals for current url access from locals
        delete req.session.returnTo; // cleanup to avoid stale redirects
    }
    // Proceed to the next middleware or route handler
    next();
};

// after storing originalUrl from express to session it is stored to locals cause :
// because locals allow easy access of it by EJS and it also avoid stale redirects 
// session helps when not authenticated but after auth we need to ensure it is not taken from session and used for stale practises
