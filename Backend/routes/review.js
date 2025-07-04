const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Event = require("../models/event.js");

// Create New Review
router.post("/", wrapAsync(async (req, res, next) => {
    try {
        let event = await Event.findById(req.params.id);
        if (!event) {
            throw new ExpressError(404, "Event not found");
        }

        // Create a new review based on the data from the form
        let newReview = new Review(req.body.review);

        // Save the review (this will trigger Mongoose validation)
        await newReview.save();

        // Add the new review to the event's reviews array
        event.reviews.push(newReview);
        await event.save();

        req.flash("success", "New Review Created!!");
        res.redirect(`/events/${event._id}`);
    } catch (err) {
        next(new ExpressError(400, `Failed to create review: ${err.message}`)); // Handle validation or save errors
    }
}));

// Delete Review
router.delete("/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    let event = await Event.findById(id);
    if (!event) {
        throw new ExpressError(404, "Event not found");
    }

    // Remove the review from the event's reviews array
    await Event.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

    // Delete the review from the reviews collection
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review Deleted!!");
    res.redirect(`/events/${id}`);
}));

module.exports = router;
