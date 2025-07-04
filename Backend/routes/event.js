const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { eventSchema } = require("../schema.js");
const Event = require("../models/event.js");
const { isLoggedIn, isEventOrganizer } = require("../middleware.js");
const multer = require('multer');
const { storage } = require('../cloudinary.js'); // ✅ correct import
const upload = multer({ storage });
const eventControlles = require("../controllers/eventControllers.js")

// Validate Event Middleware
const validateEvent = (req, res, next) => {
    const { error } = eventSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};


// all event
router.get(
    "/",
   wrapAsync(eventControlles.allEvent)
);

// current user event 
// router.get(
//     "/my-events",
//     isLoggedIn,
//     eventControlles.myEvents
// );

// create new event
router.post(
    "/",
    isLoggedIn,
    upload.single('image'),
    validateEvent,
    wrapAsync(eventControlles.createEvent)
);

// Register for event
router.post(
    "/:id/register",
    isLoggedIn,
    wrapAsync(eventControlles.registerForEvent)
);

// Like event
router.post(
    "/:id/like",
    isLoggedIn,
    wrapAsync(eventControlles.likeEvent)
);

router.get('/my', isLoggedIn, eventControlles.myEvents);


// Update event 
router.put(
  "/:id",
  isLoggedIn,
  isEventOrganizer,
  upload.single('image'), // add if allowing image update
  validateEvent,
  wrapAsync(eventControlles.updateEvent)
);

// Delete event
router.delete(
    "/:id",
    isLoggedIn,
    validateEvent,
    isEventOrganizer,
    wrapAsync(eventControlles.deleteEvent)
);

// event details
router.get(
    "/:id",
    wrapAsync(eventControlles.eventDetails)
);

module.exports = router;