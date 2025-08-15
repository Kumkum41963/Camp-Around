const mongoose = require("mongoose");
const Schema = mongoose.Schema; // destructuring
const Review = require("./reviewModel");
const User = require("./userModel");

const campgroundSchema = new Schema({
    title: String,
    images: [
        {
            url: String,
            filename: String
        }
    ],
    price: Number,
    description: String,
    location: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

// Post middleware for 'findOneAndDelete' to handle cascading deletion of reviews
// when campground deletes -> associated reviews will also be deleted
campgroundSchema.post("findOneAndDelete", async function (doc) {
    // Check if a document was deleted (doc is not null or undefined)
    if (doc) {
        // Delete all reviews with IDs present in the 'reviews' array of the deleted campground
        await Review.deleteMany({
            _id: {
                $in: doc.reviews, // Match reviews whose _id is in the 'reviews' array
            },
        });
    }
});

module.exports = mongoose.model("Campground", campgroundSchema);
