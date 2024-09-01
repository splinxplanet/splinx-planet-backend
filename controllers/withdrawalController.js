const WithdrawalRequest = require('../models/WithdrawalRequest');

// Submit Withdrawal Request
exports.submitWithdrawalRequest = async (req, res) => {
  try {
    const { creatorId, eventName, eventCost, totalAmount, paidAmount, bankName, accountNumber } = req.body;

    const newRequest = new WithdrawalRequest({
      creatorId,
      eventName,
      eventCost,
      totalAmount,
      paidAmount,
      bankName,
      accountNumber,
    });

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

    withdrawalRequest.isApproved = true;
    await withdrawalRequest.save();
    res.status(200).json({ message: 'Withdrawal request approved successfully.' });
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

    await withdrawalRequest.remove();
    res.status(200).json({ message: 'Withdrawal request denied and removed.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch All Withdrawal Requests
exports.fetchAllWithdrawals = async (req, res) => {
  try {
    const withdrawals = await WithdrawalRequest.find().populate('creatorId', 'name email');
    res.status(200).json(withdrawals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
