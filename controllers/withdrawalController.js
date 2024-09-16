const WithdrawalRequest = require('../models/WithdrawalRequest');
const sendEmail = require('../utils/sendEmail');
// Submit Withdrawal Request
exports.submitWithdrawalRequest = async (req, res) => {
  try {
    const { creatorId, eventName, eventCost, eventId, totalPaidByMembers, bankName, accountNumber, accountName, amount, requesterEmail } = req.body;

    const newRequest = new WithdrawalRequest({
      eventId,
      creatorId,
      eventName,
      eventCost,
      totalPaidByMembers,
      bankName,
      accountNumber,
      accountName,
      amount,
      requesterEmail,
    });

    // check if the user has already submitted a withdrawal request for the event
    const existingRequest = await WithdrawalRequest.findOne({ eventId });
    
    if (existingRequest) {
      return res.status(400).json({ message: 'Withdrawal request already submitted for this event.' });
    }


    await newRequest.save();
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
    
    if (!withdrawalRequest) {
      return res.status(404).json({ message: 'Withdrawal request not found.' });
    }

    // call the payment gateway API here to make payment to the user
    withdrawalRequest.isApproved = true;
    withdrawalRequest.status = 'approved';

    await withdrawalRequest.save();
    res.status(200).json({ message: 'Withdrawal request approved successfully.' });
    // send email to user
    const message = `Your withdrawal request for ${withdrawalRequest.eventName} has been approved. You will receive your payment shortly.`;
    await sendEmail(withdrawalRequest.requesterEmail, 'Withdrawal Request Approved', message);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Deny Withdrawal
exports.denyWithdrawal = async (req, res) => {
  try {
    const { id } = req.params;
    const withdrawalRequest = await WithdrawalRequest.findById(id);

    if (!withdrawalRequest) {
      return res.status(404).json({ message: 'Withdrawal request not found.' });
    }

    withdrawalRequest.status = 'rejected';
    await withdrawalRequest.save();
    res.status(200).json({ message: 'Withdrawal request rejected successfully.' });

    // send email to user
    const message = `Your withdrawal request for ${withdrawalRequest.eventName} has been rejected. Reason: ${withdrawalRequest.rejectionReason}`;
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
