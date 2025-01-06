const dotenv = require('dotenv')
dotenv.config();
const express = require('express')
const engine =require('ejs-mate')
const connectDb = require('./config/db')
const campground=require('./routes/campground.route.js')
const methodOverride=require('method-override')

const app = express()

const PORT = process.env.PORT || 3000;

app.engine('ejs',engine)
// app.use(express.json())
// to parse the body into json
app.use(express.urlencoded({extended:true}))

app.use(methodOverride('_method'))

const path = require('path')

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
    res.render('home')
})

app.use('/',campground)

connectDb()

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})

// app.listen(PORT, () => {
//     console.log(`Listening on port ${PORT}`)
// })

