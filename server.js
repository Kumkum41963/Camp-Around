const dotenv = require('dotenv');
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const express = require('express');
const ejsMate = require('ejs-mate');
const connectDb = require('./utils/dbConfig.js');
const methodOverride = require('method-override');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const campgroundRoute = require('./routes/campgroundRoutes.js');
const reviewRoute = require('./routes/reviewRoutes.js');
const userRoute = require('./routes/userRoute.js');
const errorHandling = require('./routes/errorHandlingRoutes.js');
const User = require('./models/userModel.js');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet'); // Import helmet

const app = express();

const PORT = process.env.PORT || 3000;

app.engine('ejs', ejsMate);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(mongoSanitize());
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
    name: 'session',
    secret: 'thisshouldbethesecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
};
app.use(session(sessionOptions));
app.use(flash());

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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

connectDb();

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
// the error middleware is still not working fine : it does now i repeated showError code two times , once where it is now and once in here server.js

