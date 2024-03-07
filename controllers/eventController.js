
const Event = require('../models/Event');
const User = require('../models/User');
const mongoose = require('mongoose');

// create new event 
exports.createEvent = async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json({ event });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// update event
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.eventId, req.body, { new: true });
    res.status(200).json({ event });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// delete an event
exports.deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.eventId);
    res.status(204).end();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// get all events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json({ events });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// get single event
exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    res.status(200).json({ event });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// register for event
exports.registerForEvent = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const userId = req.body.userId; // Assuming you send userId in the request body
    const isAllowReminder = req.body.isAllowReminder; // Assuming you send isAllowReminder in the request body

    // Validate eventId
    if (!mongoose.isValidObjectId(eventId)) {
      return res.status(400).json({ message: 'Invalid eventId' });
    }

    // Check if the event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user is already registered for the event
    if (event.eventMembers.some(member => member.user.equals(userId))) {
      return res.status(400).json({ message: 'User already registered for the event' });
    }

    // Register the user for the event and set isAllowReminder
    event.eventMembers.push({ user: userId, isAllowReminder });
    await event.save();

    res.status(200).json({ message: 'User registered for the event successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Invite users
exports.inviteUsersToEvent = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const userIds = req.body.userIds; // Assuming you send userIds in the request body

    // Check if the event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Loop through each user to invite
    for (const userId of userIds) {
      // Check if the user exists
      const user = await User.findById(userId);
      if (!user) {
        // Handle user not found error
        continue;
      }

      // Check if the app is installed on the user's phone
      const isAppInstalled = user.isAppInstalled; // Assuming you have a field to track this in your User model
      if (isAppInstalled) {
        // Redirect user to event details screen in the app
        res.status(200).json({ message: 'App is installed', userId });
      } else {
        // Redirect user to Google Play Store or AppStore
        res.status(200).json({ message: 'App is not installed, redirect to store', userId });
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
