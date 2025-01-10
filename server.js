const dotenv = require('dotenv')
dotenv.config();
const express = require('express')
const ejsMate =require('ejs-mate')
const connectDb = require('./utils/dbConfig.js')
const campgroundRoute=require('./routes/campgroundRoutes.js')
const reviewRoute=require('./routes/reviewRoutes.js')
const errorHandling=require('./routes/errorHandlingRoutes.js')
const methodOverride=require('method-override')
const path = require('path')

const app = express()

const PORT = process.env.PORT || 3000;

app.engine('ejs',ejsMate)

// to parse the body into json
app.use(express.urlencoded({extended:true}))

app.use(express.json())

app.use(methodOverride('_method'))

app.use(express.static(path.join(__dirname,'public')))



app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
    res.render('home')
})

// Route integration : we can not use /:id directly in .use()
app.use('/campgrounds',campgroundRoute)
app.use('/campgrounds',reviewRoute)
app.use(errorHandling)

connectDb()

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})

// the error middle ware is still not working fine : it does now i repeated showError code two times , once where it is now and once in here server.js

