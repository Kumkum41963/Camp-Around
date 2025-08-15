const mongoose = require('mongoose')
const { Schema } = mongoose
const User = require('./userModel')

const reviewSchema = new Schema({
    body: String,
    rating: Number,
    author: { // mongoDB ObjectID
        type: Schema.Types.ObjectId, // data type: _id
        ref: "User" // it creates a relationship btw User and Review, i.e relation btw collections, telling mongoose this obj. refers to a doc. in User collection
    }
})

const Review = mongoose.model('Review', reviewSchema)

module.exports = Review