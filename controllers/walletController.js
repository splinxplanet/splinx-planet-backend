const path = require("path");
const axios = require("axios");
const User = require("./model/user");
// const Wallet = require("./model/wallet");
const WalletTransaction = require("./model/wallet_transaction");
const Transaction = require("./model/transaction");
const { validateUserWallet, createWalletTransaction, createTransaction, updateWallet, } = require("../utils/walletMethod");

// send payment html
exports.sendHtml = (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
};

// transaction response from flutterwave
exports.walletResponse = async (req, res) => {
  try {
    const { transaction_id } = req.query;
    const url = `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`;

    const response = await axios({
        url,
        method: "get",
        headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${process.env.FLUTTERWAVE_V3_SECRET_KEY}`,
        },
    });

    const { status, currency, id, amount, customer } = response.data.data;

    const user = await User.findOne({ email: customer.email });

    const wallet = await validateUserWallet(user._id);

    await createWalletTransaction(user._id, status, currency, amount);

    await createTransaction(user._id, id, status, currency, amount, customer);

    await updateWallet(user._id, amount);

    return res.status(200).json({
        response: "wallet funded successfully",
        data: wallet,
    });
  } catch (error) {
    console.log(error);
  }
};