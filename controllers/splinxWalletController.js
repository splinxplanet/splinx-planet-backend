const Wallet = require('../models/SplinxWallet');
const User = require('../models/User');

// Create Wallet Account
exports.createWallet = async (req, res) => {
  try {
    const user = await User.findById(req.user._id); // Assuming user is authenticated
    const lastTenDigits = user.phoneNumber.slice(-10);
    const newWallet = new Wallet({
      user: user._id,
      accountNumber: lastTenDigits,
    });
    await newWallet.save();
    res.status(201).json(newWallet);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fund Wallet
exports.fundWallet = async (req, res) => {
  try {
    const { amount } = req.body;
    const wallet = await Wallet.findOne({ user: req.user._id });
    wallet.balance += amount;
    wallet.transactions.push({
      type: 'FUND',
      amount,
      description: 'Wallet funding',
    });
    await wallet.save();
    res.status(200).json(wallet);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Transfer Funds
exports.transferFunds = async (req, res) => {
  try {
    const { toAccountNumber, amount } = req.body;
    const senderWallet = await Wallet.findOne({ user: req.user._id });
    const receiverWallet = await Wallet.findOne({ accountNumber: toAccountNumber });

    if (senderWallet.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    senderWallet.balance -= amount;
    receiverWallet.balance += amount;

    senderWallet.transactions.push({
      type: 'TRANSFER',
      amount,
      description: 'Transfer to ' + toAccountNumber,
      toWallet: toAccountNumber,
    });

    receiverWallet.transactions.push({
      type: 'FUND',
      amount,
      description: 'Received from ' + senderWallet.accountNumber,
    });

    await senderWallet.save();
    await receiverWallet.save();

    res.status(200).json({ senderWallet, receiverWallet });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Make Payment
exports.makePayment = async (req, res) => {
  try {
    const { amount, description } = req.body;
    const wallet = await Wallet.findOne({ user: req.user._id });

    if (wallet.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    wallet.balance -= amount;
    wallet.transactions.push({
      type: 'PAYMENT',
      amount,
      description,
    });
    await wallet.save();
    res.status(200).json(wallet);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// View Transaction History
exports.getTransactionHistory = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ user: req.user._id });
    res.status(200).json(wallet.transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
