const express = require('express');
const walletController = require('../controllers/splinxWalletController');
const authMiddleware = require("../utils/validation"); // Middleware for user authentication

const router = express.Router();

// create wallet account
router.post('/create-wallet/:id', walletController.createWallet);
// get wallet
router.get('/get-wallet/:id', authMiddleware, walletController.getWallet);
// fund wallet
router.post('/fund-wallet/:id', authMiddleware, walletController.fundWallet);
// transfer funds
router.post('/transfer-funds/:id', authMiddleware, walletController.transferFunds);
// make payment
router.post('/make-payment', authMiddleware, walletController.makePayment);
// get transaction history
router.get('/transaction-history/:id', authMiddleware, walletController.getTransactionHistory);
// request money
router.post('/request-money/:id', authMiddleware, walletController.requestMoney);
// accept money request
router.post('/accept-request/:id', authMiddleware, walletController.acceptRequest);
// decline money request
router.post('/decline-request/:id', authMiddleware, walletController.declineRequest);

module.exports = router;
