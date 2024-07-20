const express = require("express");
const router = express.Router();
const walletController = require("../controllers/walletController");

// send payment html
router.get("/send-payment", walletController.sendHtml);

// transaction response from flutterwave
router.get("/wallet-response", walletController.walletResponse);    