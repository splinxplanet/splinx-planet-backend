const mongoose = require('mongoose');

// Define a schema for event members
const eventMemberSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isAllowReminder: { type: Boolean, default: true }
});

const eventSchema = new mongoose.Schema({
  eventName: { type: String, required: true },
  eventDescription: { type: String, required: true },
  eventImage: String,
  eventDate: { type: Date, required: true },
  eventTime: { type: String, required: true },
  eventLocation: { type: String, required: true },
  eventUserRules: String,
  eventCreator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  eventCost: Number,
  eventCategory: String,
  eventHashtag: String,
  isPopular: { type: Boolean, default: false },
  isUpcoming: { type: Boolean, default: true },
  isOpen: { type: Boolean, default: true },
  eventMembers: [eventMemberSchema] // Use the eventMemberSchema for eventMembers
},
  { timestamps: true }
);

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
