const WithdrawalRequest = require('../models/WithdrawalRequest');
const User = require('../models/User');
const Event = require('../models/Event');
const sendEmail = require('../utils/sendEmail');
// Submit Withdrawal Request
exports.submitWithdrawalRequest = async (req, res) => {
  try {
    const { creatorId, eventId, bankName, accountNumber, accountName, amount } = req.body;

    // Validate required fields
    if (!creatorId || !eventId || !bankName || !accountNumber || !accountName || !amount) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // find the user by creatorId
    const user = await User.findById(creatorId);
    // find the event by eventId
    const event = await Event.findById(eventId);
    // check if the user and event exist
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    const newRequest = new WithdrawalRequest({
      eventId,
      creatorId,
      eventName: event.eventName,
      holdDate: event.eventDate,
      eventCost: parseInt(event.eventCost),
      totalPaidByMembers: parseInt(event.totalPaidByMembers),
      bankName,
      accountNumber,
      accountName,
      amount: parseInt(amount),
      requesterEmail: user.emailAddress,
    });

    // check if the user has already submitted a withdrawal request for the event
    const existingRequest = await WithdrawalRequest.findOne({ eventId });
    
    if (existingRequest) {
      return res.status(400).json({ message: 'Withdrawal request already submitted for this event.' });
    }


    await newRequest.save();
    // update the event to set isWithdrawRequested to true
    event.isWithdrawRequested = true;
    await event.save();
    res.status(201).json({ message: 'Withdrawal request submitted successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Approve Withdrawal
exports.approveWithdrawal = async (req, res) => {
  try {
    const { id } = req.params;
    const withdrawalRequest = await WithdrawalRequest.findById(id);
    const event = await Event.findById(withdrawalRequest.eventId);
    
    if (!withdrawalRequest) {
      return res.status(404).json({ message: 'Withdrawal request not found.' });
    }

    // check if event.totalPaidByMembers is >= amount requested
    const isSufficient = parseInt(event.totalPaidByMembers) >= parseInt(withdrawalRequest.amount);
    if (isSufficient) {

      // call the payment gateway API here to make payment to the user

      withdrawalRequest.isApproved = true;
      withdrawalRequest.status = 'approved';
  
      await withdrawalRequest.save();
  
      // update the event to set isWithdrawalPaid to true
      event.isWithdrawalPaid = true;
      await event.save();
  
      res.status(200).json({ message: 'Withdrawal request approved successfully.' });
      // send email to user
      const message = `Your withdrawal request for ${withdrawalRequest.eventName} has been approved. You will receive your payment shortly.`;
      await sendEmail(withdrawalRequest.requesterEmail, 'Withdrawal Request Approved', message);
    } else {
      return res.status(403).json({ message: 'Insufficient balance' });
    }


  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Deny Withdrawal
exports.denyWithdrawal = async (req, res) => {
  try {
    const { id } = req.params;
    const withdrawalRequest = await WithdrawalRequest.findById(id);
    const event = await Event.findById(withdrawalRequest.eventId);

    if (!withdrawalRequest) {
      return res.status(404).json({ message: 'Withdrawal request not found.' });
    }

    withdrawalRequest.status = 'rejected';
    await withdrawalRequest.save();

    // update the event to set isWithdrawRequested to false
    event.isWithdrawRequested = false;
    await event.save();

    res.status(200).json({ message: 'Withdrawal request rejected successfully.' });

    // send email to user
    const message = `Your withdrawal request for${withdrawalRequest.eventName} has been rejected. Reason: Your request did not meet the necessary criteria. Please contact support for more details.`;
    await sendEmail(withdrawalRequest.requesterEmail, 'Withdrawal Request Rejected', message);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch All Withdrawal Requests
exports.fetchAllWithdrawals = async (req, res) => {
  try {
    const withdrawals = await WithdrawalRequest.find();
    
    res.status(200).json(withdrawals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// fetch user only withdrawal request using userId
exports.fetchUserWithdrawal = async (req, res) => { 
  try {
    const { userId } = req.params;
    const withdrawals = await WithdrawalRequest.find({ creatorId: userId });

    if (!withdrawals || withdrawals.length === 0) {
      return res.status(404).json({ message: 'No withdrawal  history found for this user.' });
    }

    res.status(200).json(withdrawals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// delete a withdrawal request
exports.deleteWithdrawalRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const withdrawalRequest = await WithdrawalRequest.findByIdAndDelete(id);

    if (!withdrawalRequest) {
      return res.status(404).json({ message: 'Withdrawal request not found.' });
    }

    res.status(200).json({ message: 'Withdrawal request deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


