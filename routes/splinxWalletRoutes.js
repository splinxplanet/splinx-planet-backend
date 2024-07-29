const express = require('express');
const walletController = require('../controllers/splinxWalletController');
const authenticationToken = require("../utils/validation"); // Middleware for user authentication

const router = express.Router();

router.post('/create-wallet', authMiddleware, walletController.createWallet);
router.post('/fund-wallet', authMiddleware, walletController.fundWallet);
router.post('/transfer-funds', authMiddleware, walletController.transferFunds);
router.post('/make-payment', authMiddleware, walletController.makePayment);
router.get('/transaction-history', authMiddleware, walletController.getTransactionHistory);

module.exports = router;
