// Middleware to check if the user is logged in
module.exports.isLoggedIn = (req, res, next) => {
    // Check if the user is not authenticated
    if (!req.isAuthenticated()) {
        // Store the current URL (original request) in the session for redirection after login
        req.session.returnTo = req.originalUrl; 
        console.log(req.originalUrl); // Log the URL to the console for debugging purposes
        // Show a flash message to the user saying they need to log in first
        req.flash('error', 'You must be signed in first!');
        // Redirect the user to the login page
        return res.redirect('/login');
    }
    // If the user is authenticated, proceed to the next middleware or route handler
    next();
};

// Middleware to retrieve and store the 'returnTo' URL in res.locals for redirection
module.exports.storeReturnTo = (req, res, next) => {
    // Check if the session has a 'returnTo' URL stored
    if (req.session.returnTo) {
        // Store the 'returnTo' URL in res.locals, making it accessible in the response lifecycle
        res.locals.returnTo = req.session.returnTo;
    }
    // Proceed to the next middleware or route handler
    next();
};
