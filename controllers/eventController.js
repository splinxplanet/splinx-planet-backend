
const Event = require('../models/Event');
const User = require('../models/User');
const SplitBill = require("../models/Splitbills"); 
const WalletTransaction = require("../models/SplinxWallet"); 

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
  const { eventId } = req.params;
  const {
    eventName,
    eventDescription,
    eventImage,
    eventDate,
    eventTime,
    eventLocation,
    eventUserRules,
    eventCreator,
    eventCost,
    isEventCostSplitted,
    eventCategory,
    eventHashtag,
    isPopular,
    isUpcoming,
    isOpen,
    eventMembers
  } = req.body;

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).send("Event not found");
    }

    // Update the fields if they are provided in the request body
    if (eventName !== undefined) event.eventName = eventName;
    if (eventDescription !== undefined) event.eventDescription = eventDescription;
    if (eventImage !== undefined) event.eventImage = eventImage;
    if (eventDate !== undefined) event.eventDate = eventDate;
    if (eventTime !== undefined) event.eventTime = eventTime;
    if (eventLocation !== undefined) event.eventLocation = eventLocation;
    if (eventUserRules !== undefined) event.eventUserRules = eventUserRules;
    if (eventCreator !== undefined) event.eventCreator = eventCreator;
    if (eventCost !== undefined) event.eventCost = eventCost;
    if (isEventCostSplitted !== undefined) event.isEventCostSplitted = isEventCostSplitted;
    if (eventCategory !== undefined) event.eventCategory = eventCategory;
    if (eventHashtag !== undefined) event.eventHashtag = eventHashtag;
    if (isPopular !== undefined) event.isPopular = isPopular;
    if (isUpcoming !== undefined) event.isUpcoming = isUpcoming;
    if (isOpen !== undefined) event.isOpen = isOpen;
    if (eventMembers !== undefined) event.eventMembers = eventMembers;

    await event.save();

    res.status(200).json({ message: "Event updated successfully", event });
  } catch (error) {
    res.status(500).send(error.message);
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

    // Determine the splitCost value
    let splitCost = 0;
    if (event.isEventCostSplitted) {
      splitCost = event.eventCost / (event.eventMembers.length + 1); // Adjust according to your splitting logic
    }

    // Register the user for the event and set isAllowReminder and splitCost
    event.eventMembers.push({ user: userId, isAllowReminder, splitCost });
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

// Split event cost
exports.splitCost = async (req, res) => {
  const { eventId } = req.params;
  const { splitPercentages } = req.body; // Object with memberId as key and percentage as value

  try {
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const totalCost = event.eventCost;
    const eventMembers = event.eventMembers;

    // Validate split percentages
    const totalPercentage = Object.values(splitPercentages).reduce((acc, percentage) => acc + percentage, 0);
    if (totalPercentage !== 100) {
      return res.status(400).json({ message: 'Total split percentages must equal 100%' });
    }

    // Update each member's split cost
    eventMembers.forEach(member => {
      const percentage = splitPercentages[member.user.toString()];
      if (percentage) {
        member.splitCost = (totalCost * percentage) / 100;
        member.paymentStatus = 'pending';
      }
    });

    // update isEventCostSplitted to true
    event.isEventCostSplitted = true;

    await event.save();
    res.status(200).json({ message: 'Event cost split successfully', event });

  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

// pay split cost
exports.paySplitCost = async (req, res) => {
  const { userId, splitBillId } = req.body;

  try {
    // Fetch the split bill and user data
    const splitBill = await SplitBill.findById(splitBillId);
    const user = await User.findById(userId);

    if (!splitBill || !user) {
      return res.status(404).json({ error: "Split bill or user not found" });
    }

    // Find the member in the split bill
    const member = splitBill.members.find((m) => m.user.toString() === userId);

    if (!member) {
      return res.status(400).json({ error: "User is not part of this split bill" });
    }

    // Check if the user has already paid
    if (member.status === "Paid") {
      return res.status(400).json({ error: "This bill has already been paid by the user" });
    }

    // Check if the user has sufficient funds in their wallet
    if (user.walletBalance < member.shareAmount) {
      return res.status(400).json({ error: "Insufficient wallet balance" });
    }

    // Deduct the amount from the user's wallet
    user.walletBalance -= member.shareAmount;

    // Create a wallet transaction
    const transaction = new WalletTransaction({
      amount: member.shareAmount,
      userId: user._id,
      isInflow: false,
      paymentMethod: "wallet",
      currency: "NGN", // Replace with dynamic currency if needed
      status: "successful",
    });

    // Update the split bill member status and paid amount
    member.paidAmount = member.shareAmount;
    member.status = "Paid";
    splitBill.paidAmount += member.shareAmount;

    // Save the updated documents
    await user.save();
    await transaction.save();
    await splitBill.save();

    // Return success response
    res.status(200).json({ message: "Payment successful", splitBill, transaction });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// fetch all split bills for a user
exports.fetchAllSplitBills = async (req, res) => {
  const { userId } = req.params;

  try {
    const splitBills = await SplitBill.find({ "members.user": userId });

    if (!splitBills.length) {
      return res.status(404).json({ message: 'No split bills found for this user' });
    }

    res.status(200).json({ splitBills });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// get all events created by a user
exports.getEventsByUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Validate userId
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: 'Invalid userId' });
    }

    // Find all events where the eventCreator matches the userId
    const events = await Event.find({ eventCreator: userId });

    if (!events.length) {
      return res.status(404).json({ message: 'No events found for this user' });
    }

    res.status(200).json({ events });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

