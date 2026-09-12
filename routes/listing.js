const express = require('express');
const router = express.Router();

const Listing = require('../models/listings');
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');
const { listingSchema } = require('../schema.js');

const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);

    if (error) {
        throw new ExpressError(error.details[0].message, 400);
    }

    next();
};

router.get('/', wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render('listings/index.ejs', { allListings });
}));

router.get('/new', (req, res) => {
    res.render('listings/new.ejs');
});

router.post('/', validateListing, wrapAsync(async (req, res) => {
    if (!req.body.listing.image || !req.body.listing.image.url) {
        delete req.body.listing.image;
    }

    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success","new listing created");
    res.redirect('/listings');
}));

router.get('/:id/edit', wrapAsync(async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
        throw new ExpressError('Listing not found', 404);
    }

    res.render('listings/edit.ejs', { listing });
}));

router.put('/:id', validateListing, wrapAsync(async (req, res) => {
    const { id } = req.params;

    if (!req.body.listing.image || !req.body.listing.image.url) {
        delete req.body.listing.image;
    }

    if(!listing){
        req.flash("err","Listing you requested doesnt exist");
        res.redirect('listings');
    }

    const listing = await Listing.findByIdAndUpdate(
        id,
        req.body.listing,
        {
            new: true,
            runValidators: true
        }
    );

    if (!listing) {
        throw new ExpressError('Listing not found', 404);
    }

    res.redirect(`/listings/${id}`);
}));

router.get('/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findById(id).populate('reviews');

    if (!listing) {
        throw new ExpressError('Listing not found', 404);
    }

    res.render('listings/show.ejs', { listing });
}));

router.delete('/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findByIdAndDelete(id);

    if (!listing) {
        throw new ExpressError('Listing not found', 404);
    }
    req.flash("success","new listing deleted");
    res.redirect('/listings');
}));

module.exports = router;