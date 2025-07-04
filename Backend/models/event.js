const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

const eventSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        type: String,
        default: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        set: (v) => v === "" ? "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v,
    },
    date: {
        type: Date,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    venue: {
        type: String,
        required: true,
    },
    organizer: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    attendees: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    ticketPrice: {
        type: Number,
        default: 0, // Free event if 0
    },
    location: String, // city/state (optional)
    country: String,
    category: {
        type: String,
        enum: ['cultural', 'food', 'entertainment', 'sports', 'networking', 'religious'],
        default: 'cultural'
    },
    maxAttendees: {
        type: Number,
        default: 0 // 0 means unlimited
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    
}, { timestamps: true });

// Delete all reviews when an event is deleted
eventSchema.post("findOneAndDelete", async (event) => {
    if (event) {
        await Review.deleteMany({ _id: { $in: event.reviews } });
    }
});

const Event = mongoose.model("Event", eventSchema);
module.exports = Event;