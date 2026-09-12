const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/users.js");

require('dotenv').config();
const MONGO_URL = process.env.MONGO_URL;

const app = express();

const sessionOptions = {
    secret: 'thisisasecret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 24 * 7 ,// 7 days
        httpOnly: true
    }
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    next();
});



const Listing = require('./models/listings');
const Review = require('./models/reviews');
const wrapAsync = require('./utils/wrapAsync');
const ExpressError = require('./utils/ExpressError');

const listingRoutes = require('./routes/listing.js');



async function main() {
    await mongoose.connect(MONGO_URL);
}

main()
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.log(err);
    });

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.engine('ejs', ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/demouser', async (req, res) => {
    const fakeUser = new User({
        email: 'xyz@gmail.com',
        username: 'xyz'
    });

    const regUser = await User.register(fakeUser, 'helooworld');

    res.send(regUser);
});

app.use('/listings', listingRoutes);

app.use('/listings', listingRoutes);

app.post('/listings/:id/reviews', wrapAsync(async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
        throw new ExpressError('Listing not found', 404);
    }

    const newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success","new review added");

    res.redirect(`/listings/${id}`);
}));

app.delete('/listings/:id/reviews/:reviewId', wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;

    await Review.findByIdAndDelete(reviewId);

    await Listing.findByIdAndUpdate(id, {
        $pull: {
            reviews: reviewId
        }
    });
req.flash("success","review deleted");
    res.redirect(`/listings/${id}`);
}));

app.all('/{*splat}', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
    const {
        statusCode = 500,
        message = 'Something went wrong'
    } = err;

    res.status(statusCode).send(message);
});

app.listen(8080, () => {
    console.log('Server is listening on port 8080');
});