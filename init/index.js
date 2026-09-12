const express = require('express');
const mongoose = require('mongoose');

const app = express();

const Listing = require('../models/listings');

const MONGODB_URI = 'mongodb://localhost:27017/Wanderlust';

main()
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });

async function main() {
    await mongoose.connect(MONGODB_URI);
}

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/listings', async (req, res) => {
    const allListings = await Listing.find({});
    res.send(allListings);
    console.log(allListings);
});

app.listen(8080, () => {
    console.log('Server is running on port 8080');
});