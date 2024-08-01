const express = require('express');
const walletController = require('../controllers/splinxWalletController');
const authMiddleware = require("../utils/validation"); // Middleware for user authentication

const router = express.Router();

router.post('/create-wallet/:id', walletController.createWallet);
router.post('/fund-wallet', authMiddleware, walletController.fundWallet);
router.post('/transfer-funds/:id', authMiddleware, walletController.transferFunds);
router.post('/make-payment', authMiddleware, walletController.makePayment);
router.get('/transaction-history/:id', authMiddleware, walletController.getTransactionHistory);
router.post('/request-money/:id', authMiddleware, walletController.requestMoney);

module.exports = router;
