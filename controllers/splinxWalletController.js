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

// Fetch Wallet
exports.getWallet = async (req, res) => {
  const { id } = req.params;
  try {
    const wallet = await Wallet.findOne({ user: id });
    res.status(200).json(wallet);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fund Wallet
exports.fundWallet = async (req, res) => {
  const { id } = req.params;
  try {
    const { amount, name, email, currency } = req.body;
    const wallet = await Wallet.findOne({ user: id });
    wallet.balance += amount;
    wallet.transactions.push({
      type: 'FUND',
      amount,
      description: 'Wallet funding',
      name,
      email,
      currency,
      paymentStatus: 'successful',
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
    const { toAccountNumber, amount, name, email, currency, note } = req.body;
    const senderWallet = await Wallet.findOne({ user: id });
    const receiverWallet = await Wallet.findOne({ accountNumber: toAccountNumber });

    if (!receiverWallet) {
      return res.status(404).json({ error: 'Receiver wallet not found' });
    }

    if (senderWallet.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    senderWallet.balance -= amount;
    receiverWallet.balance += amount;

    senderWallet.transactions.push({
      type: 'TRANSFER',
      amount,
      description: `Transfer to ${toAccountNumber} | ${note}`,
      toWallet: toAccountNumber,
      name,
      email,
      currency,
      paymentStatus: 'successful',
    });

    receiverWallet.transactions.push({
      type: 'FUND',
      amount,
      description: `Received from ${senderWallet.accountNumber}`,
      name,
      email,
      currency,
      paymentStatus: 'successful',
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
  const { id } = req.params;
  try {
    const { amount, description, name, email, currency } = req.body;
    const wallet = await Wallet.findOne({ user: id });

    if (wallet.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    wallet.balance -= amount;
    wallet.transactions.push({
      type: 'PAYMENT',
      amount,
      description,
      name,
      email,
      currency,
      paymentStatus: 'successful',
    });
    await wallet.save();
    res.status(200).json(wallet);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// View Transaction History
exports.getTransactionHistory = async (req, res) => {
  const { id } = req.params;
  try {
    const wallet = await Wallet.findOne({ user: id });
    res.status(200).json(wallet.transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Request Money
exports.requestMoney = async (req, res) => {
  const { id } = req.params; // requester's ID
  try {
    const { requesteeId, amount, description } = req.body;

    const requesterWallet = await Wallet.findOne({ user: id });
    
    const requesteeWallet = await Wallet.findOne({ user: requesteeId });

    if (!requesteeWallet) {
      return res.status(404).json({ error: 'Requestee wallet not found' });
    }

    const moneyRequest = {
      requester: id,
      requestee: requesteeId,
      amount,
      description,
      status: 'pending',
    };

    requesterWallet.moneyRequests.push(moneyRequest);
    requesteeWallet.moneyRequests.push(moneyRequest);

    await requesterWallet.save();
    await requesteeWallet.save();

    res.status(200).json({ message: 'Money request sent', moneyRequest });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// accept request
exports.acceptRequest = async (req, res) => {
  const { id } = req.params; // requestee's ID
  try {
    const { requestId } = req.body;

    const requesteeWallet = await Wallet.findOne({ user: id });

    const requesterWallet = await Wallet.findOne({ 'moneyRequests._id': requestId });

    if (!requesterWallet) {
      return res.status(404).json({ error: 'Requester wallet not found' });
    }

    const moneyRequest = requesteeWallet.moneyRequests.id(requestId);

    if (!moneyRequest) {
      return res.status(404).json({ error: 'Money request not found' });
    }

    moneyRequest.status = 'accepted';

    requesteeWallet.balance -= moneyRequest.amount;
    requesterWallet.balance += moneyRequest.amount;

    await requesteeWallet.save();
    await requesterWallet.save();

    res.status(200).json({ message: 'Money request accepted', moneyRequest });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
