const dotenv = require('dotenv')
dotenv.config();
const express = require('express')
const ejsMate = require('ejs-mate')
const connectDb = require('./utils/dbConfig.js')
const methodOverride = require('method-override')
const path = require('path')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const campgroundRoute = require('./routes/campgroundRoutes.js')
const reviewRoute = require('./routes/reviewRoutes.js')
const userRoute = require('./routes/userRoute.js')
const errorHandling = require('./routes/errorHandlingRoutes.js')
const User = require('./models/userModel.js')

const app = express()

const PORT = process.env.PORT || 3000;

app.engine('ejs', ejsMate)

// to parse the body into json
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(methodOverride('_method'))

app.use(express.static(path.join(__dirname, 'public')))

// Configuration options for express-session
const sessionOptions = {
    // Secret key used to sign the session ID cookie (should be a strong, unpredictable value in production)
    secret: 'thisshouldbethesecret',

    // Prevents the session from being saved back to the session store unless it has been modified
    resave: false,

    // Forces a session that is "uninitialized" (new but not modified) to be saved to the store
    saveUninitialized: true,

    // Cookie settings for the session
    cookie: {
        // Sets the expiration time for the cookie (7 days from now)
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),

        // Sets the maximum age of the cookie in milliseconds (7 days)
        maxAge: 1000 * 60 * 60 * 24 * 7,

        // Ensures the cookie is only accessible via HTTP(S) and not client-side scripts
        httpOnly: true
    }
};
app.use(session(sessionOptions))
app.use(flash())

// session must be used before passport

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Use passport-local-mongoose's built-in authenticate method
passport.use(new LocalStrategy(User.authenticate()));

// Serialize and deserialize users
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// flash middlleware
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// Route integration : we can not use /:id directly in .use()
app.get('/', (req, res) => {
    res.render('home')
})

app.use('/campgrounds', campgroundRoute)
app.use('/campgrounds', reviewRoute)
app.use('/', userRoute)
app.use(errorHandling)

connectDb()

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})

// the error middle ware is still not working fine : it does now i repeated showError code two times , once where it is now and once in here server.js

