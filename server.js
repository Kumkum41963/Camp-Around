const dotenv = require('dotenv');
require('dotenv').config();

const express = require('express');
const ejsMate = require('ejs-mate');

const connectDb = require('./utils/dbConfig.js');

const methodOverride = require('method-override');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');

// passport provides many strategy for auth, we use local-strategy
const passport = require('passport');
const LocalStrategy = require('passport-local');

const mongoSanitize = require('express-mongo-sanitize');

const helmet = require('helmet'); 

const campgroundRoute = require('./routes/campgroundRoutes.js');
const reviewRoute = require('./routes/reviewRoutes.js');
const userRoute = require('./routes/userRoute.js');

const errorHandling = require('./routes/errorHandlingRoutes.js');

const User = require('./models/userModel.js');

// App & Port initialization
const app = express();
const PORT = process.env.PORT || 3000;
app.engine('ejs', ejsMate);

// Middlewares for parsing requests
app.use(express.urlencoded({ extended: true })); // read form data & JSON
app.use(express.json()); // read form data & JSON
app.use(methodOverride('_method')); // allow PUT/DELETE from forms
app.use(mongoSanitize()); // blocks mongo injection
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: [
                    "'self'",
                    "https://cdn.jsdelivr.net", // Allow Bootstrap & Popper.js
                ],
                styleSrc: [
                    "'self'",
                    "'unsafe-inline'",
                    "https://cdn.jsdelivr.net", // Allow Bootstrap styles
                ],
                imgSrc: [
                    "'self'",
                    "data:", // Allow inline base64 images
                    "https://res.cloudinary.com", // Allow Cloudinary images
                ],
                connectSrc: ["'self'"],
                fontSrc: ["'self'", "https://fonts.gstatic.com"],
                objectSrc: ["'none'"],
                upgradeInsecureRequests: [],
            },
        },
    })
);


app.use(express.static(path.join(__dirname, 'public')));

// Session configuration
const sessionOptions = {
    name: 'session', // cookie name
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true // no client access allowed
    }
};

app.use(session(sessionOptions));
app.use(flash()); // Flash messages and locals

// Passport initialization for authentication 
app.use(passport.initialize()); // sets up Passport for use in the app.
app.use(passport.session()); // hooking passport to express-session for all over req. presistence
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); // Runs once on login - stores the user’s _id in the session.
passport.deserializeUser(User.deserializeUser()); // Runs on every request after login → takes _id from session, fetches full user object, attaches it to req.user.

// Flash middleware
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.get('/', (req, res) => {
    res.render('home');
});
app.use('/campgrounds', campgroundRoute);
app.use('/campgrounds', reviewRoute);
app.use('/', userRoute);

app.use(errorHandling);

// DB Connection Establishing
connectDb();

// Start server
app.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}`);
});