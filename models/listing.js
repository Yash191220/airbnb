const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const { required } = require("joi");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,

    image: {
        url: String,
        filename: String,
    },
    price: Number,
    location: String,
    country: String,
    categories: [{
        type: String,
        enum: [
        "hotel",
        "villa",
        "sea",
        "beach",
        "mountain",
        "city",
        "resort",
        "luxury",
        "budget"
        ]
    }],

    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],

});

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

module.exports = mongoose.model("Listing", listingSchema);
