const Event = require("../models/event.js");
const wrapAsync = require("../utils/wrapAsync.js");
const multer = require('multer');
const { storage } = require('../cloudinary.js');
const upload = multer({ storage });
const dotenv = require("dotenv");
dotenv.config();


module.exports.allEvent = async (req, res) => {
        const events = await Event.find({})
            .populate("organizer", "username email")
            .populate("attendees", "username");
        res.json(events);
    };

module.exports.myEvents =  async (req, res) => {
      try {
        const userId = req.user._id; // from auth middleware
        const myEvents = await Event.find({ organizer: userId });
        res.json(myEvents);
      } catch (err) {
        res.status(500).json({ message: 'Failed to fetch your events' });
      }
    };
// wrapAsync(async (req, res) => {
//         const events = await Event.find({ organizer: req.user._id })
//             .populate("attendees", "username");
//         res.json(events);
//     });

module.exports.createEvent = async (req, res) => {
         try {
      const eventData = req.body;
      eventData.organizer = req.user._id;

      if (req.file) {
        console.log("Uploaded file:", req.file);
        eventData.image = req.file.path;
      }

      const newEvent = new Event(eventData);
      await newEvent.save();
      res.status(201).json(newEvent);
    } catch (err) {
      console.error("Error creating event:", err); // 👈 important for 500 errors
      throw err;
    }
    };

module.exports.registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    console.log("Registering:", req.user, "to", event?._id);

    if (!event) return res.status(404).json({ error: "Event not found" });
    if (!req.user) return res.status(401).json({ error: "Unauthorized user" });

    if (event.attendees.includes(req.user._id)) {
      return res.status(400).json({ error: "Already registered" });
    }

    event.attendees.push(req.user._id);
    await event.save();
    res.json(event);
  } catch (err) {
    console.error("Register error:", err.message);
    res.status(500).json({ error: "Something went wrong" });
  }
};


module.exports.likeEvent = async (req, res) => {
        const event = await Event.findById(req.params.id);
        if (!event) {
            throw new ExpressError(404, "Event not found");
        }
        const alreadyLiked = event.likes.some(like => like.equals(req.user._id));
        if (alreadyLiked) {
            event.likes = event.likes.filter(like => !like.equals(req.user._id));
        } else {
            event.likes.push(req.user._id);
        }
        await event.save();
        res.json(event);
    };

module.exports.updateEvent = async (req, res) => {
    const { id } = req.params;
    const eventData = req.body.event ? req.body.event : req.body;
    if(req.file){
      eventData.image = `/uploads/${req.file.filename}`;
    }
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { ...eventData },
      { new: true }
    );
    res.json(updatedEvent);
  };

module.exports.deleteEvent = async (req, res) => {
        const { id } = req.params;
        await Event.findByIdAndDelete(id);
        res.json({ success: true });
    };

module.exports.eventDetails = async (req, res) => {
        const event = await Event.findById(req.params.id)
            .populate("organizer", "username email")
            .populate("attendees", "username")
            .populate("reviews");
        if (!event) {
            throw new ExpressError(404, "Event not found");
        }
        res.json(event);
    };
   