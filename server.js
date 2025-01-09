const dotenv = require('dotenv')
dotenv.config();
const express = require('express')
const engine =require('ejs-mate')
const connectDb = require('./utils/dbConfig.js')
const campgroundRoute=require('./routes/campgroundRoutes.js')
const reviewRoute=require('./routes/reviewRoutes.js')
const errorHandling=require('./routes/errorHandlingRoutes.js')
const methodOverride=require('method-override')

const app = express()

const PORT = process.env.PORT || 3000;

app.engine('ejs',engine)
// app.use(express.json())
// to parse the body into json
app.use(express.urlencoded({extended:true}))

app.use(express.json())

app.use(methodOverride('_method'))

const path = require('path')

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
    res.render('home')
})

// Route integration : we can not use /:id directly in .use()
app.use('/campgrounds',campgroundRoute)
app.use('/campgrounds',reviewRoute)
app.use(errorHandling)

app.use((err, req, res, next) => {
    const { message = "Something went wrong!", statusCode = 500 } = err;
    res.status(statusCode).render('error', { message });
});


connectDb()

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})

// the error midlle ware is still not working fine 

