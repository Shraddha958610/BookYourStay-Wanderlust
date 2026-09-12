const mongoose = require('mongoose');

const schema = mongoose.Schema;

const listingSchema = new schema({
    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    image: {
    filename: {
        type: String,
        default: 'listingimage'
    },
    url: {
    type: String,
    default: 'https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg',
    set: (v) => v === "" 
        ? 'https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg'
        : v
}
},

    price: Number,

    location: String,

    country: String,
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

listingSchema.post("findOneAndDelete", async function (listing) {
    if (listing) {
        await Review.deleteMany({
            _id: { $in: listing.reviews }
        });
    }
});

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;