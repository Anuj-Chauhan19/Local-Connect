const jwt = require('jsonwebtoken');

module.exports.isLoggedIn = async (req, res, next) => {
  try {
    // 1. Check if Authorization header exists
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) throw new Error('No token provided');

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = decoded; 
    next();
  } catch (err) {
    res.status(401).json({ error: 'Not authenticated' });
  }
};

const Event = require('./models/event');

module.exports.isEventOrganizer = async (req, res, next) => {
    const { id } = req.params;
    const event = await Event.findById(id);
    
    if (!event) {
        req.flash('error', 'Event not found!');
        return res.redirect('/events');
    }
    
    if (!event.organizer.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/events/${id}`);
    }
    
    next();
};