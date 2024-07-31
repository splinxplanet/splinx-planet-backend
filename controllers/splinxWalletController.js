const Wallet = require('../models/SplinxWallet');
const User = require('../models/User');

// Create Wallet Account
exports.createWallet = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);

    // Check if user exists
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if phoneNumber is available
    if (!user.phoneNumber) {
      return res.status(400).json({ error: 'Phone number is required to create a wallet' });
    }

    const lastTenDigits = user.phoneNumber.slice(-10);
    const newWallet = new Wallet({
      user: id,
      accountNumber: lastTenDigits,
    });

    await newWallet.save();

    // Update user isWalletCreated to true and walletAccountNumber to lastTenDigits
    user.isWalletCreated = true;
    user.walletAccountNumber = lastTenDigits;
    await user.save();

    res.status(201).json(newWallet);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Fund Wallet
exports.fundWallet = async (req, res) => {
    const { id } = req.params;
  try {
    const { amount } = req.body;
    const wallet = await Wallet.findOne({ user: id });
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
    const { id } = req.params;
  try {
    const { toAccountNumber, amount } = req.body;
    const senderWallet = await Wallet.findOne({ user: id });
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
    const {id } = req.params;
  try {
    const wallet = await Wallet.findOne({ user: id });
    res.status(200).json(wallet.transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
